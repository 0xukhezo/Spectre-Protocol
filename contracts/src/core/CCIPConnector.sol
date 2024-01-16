// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/token/ERC20/utils/SafeERC20.sol";
import {EnumerableMap} from
    "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.0/contracts/utils/structs/EnumerableMap.sol";
import {IUserSlot} from "src/interfaces/IUserSlot.sol";
import {ICCIPConnector} from "src/interfaces/ICCIPConnector.sol";

contract CCIPConnector is ICCIPConnector, CCIPReceiver, OwnerIsCreator {
    using EnumerableMap for EnumerableMap.Bytes32ToUintMap;
    using SafeERC20 for IERC20;

    // Mapping to keep track of allowlisted chains.
    mapping(uint64 => bool) public allowlistedChains;
    mapping(uint64 => address) public protocolContractByChain;
    EnumerableMap.Bytes32ToUintMap internal failedMessages; // Contains failed messages and their state.
    mapping(bytes32 messageId => Client.Any2EVMMessage contents) public messageContents; // The message contents of failed messages are stored here.
    Client.Any2EVMMessage private lastMessage;

    bool internal simRevert = false;

    //modifiers
    modifier onlyAllowlistedChain(uint64 _chainSelector) {
        if (!allowlistedChains[_chainSelector]) {
            revert ChainNotAllowlisted(_chainSelector);
        }
        _;
    }

    modifier onlySelf() {
        if (msg.sender != address(this)) revert OnlySelf();
        _;
    }

    constructor(address _router) CCIPReceiver(_router) {}

    function allowlistChain(uint64 _chainSelector, bool _allowed, address _contractProtocol) external onlyOwner {
        allowlistedChains[_chainSelector] = _allowed;
        if (_allowed && _contractProtocol == address(0)) {
            revert ContractProtocolAddressZero(_chainSelector);
        }
        protocolContractByChain[_chainSelector] = _contractProtocol;
    }

    function sendMessage(uint64 _chainSelector, address _receiver, ActionType _action, address _token, uint256 _amount)
        external
        payable
        onlyAllowlistedChain(_chainSelector)
        returns (bytes32 messageId)
    {
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);

        Client.EVM2AnyMessage memory evm2AnyMessage =
            _buildCCIPMessage(_chainSelector, _receiver, _action, _token, _amount, address(0));

        IRouterClient router = IRouterClient(this.getRouter());

        uint256 fees = router.getFee(_chainSelector, evm2AnyMessage);

        if (
            (msg.sender != address(this) && fees > msg.value)
                || (msg.sender == address(this) && fees > address(this).balance)
        ) {
            revert NotEnoughBalance(address(this).balance, fees);
        }

        IERC20(_token).approve(address(router), _amount);

        messageId = router.ccipSend{value: fees}(_chainSelector, evm2AnyMessage);

        emit MessageSent(messageId, _chainSelector, _receiver, _token, _amount, address(0), fees);

        return messageId;
    }

    /// @notice _receiver is contract to supply on destination chain in ActionType.SUPPLY and wallet for return tokens for ActionType.TRANSFER
    function _buildCCIPMessage(
        uint64 _chainSelector,
        address _receiver,
        ActionType _action,
        address _token,
        uint256 _amount,
        address _feeTokenAddress
    ) internal view returns (Client.EVM2AnyMessage memory) {
        Client.EVMTokenAmount[] memory tokenAmounts = new Client.EVMTokenAmount[](1);
        Client.EVMTokenAmount memory tokenAmount = Client.EVMTokenAmount({token: _token, amount: _amount});
        tokenAmounts[0] = tokenAmount;

        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(protocolContractByChain[_chainSelector]),
            data: _encodeDataAction(_action, _receiver),
            tokenAmounts: tokenAmounts,
            extraArgs: Client._argsToBytes(Client.EVMExtraArgsV1({gasLimit: 2_000_000})),
            feeToken: _feeTokenAddress
        });
        return evm2AnyMessage;
    }

    /// @notice The entrypoint for the CCIP router to call. This function should
    /// never revert, all errors should be handled internally in this contract.
    /// @param any2EvmMessage The message to process.
    /// @dev Extremely important to ensure only router calls this.
    function ccipReceive(Client.Any2EVMMessage calldata any2EvmMessage)
        external
        override
        onlyRouter
        onlyAllowlistedChain(any2EvmMessage.sourceChainSelector)
    {
        try this.processMessage(any2EvmMessage) {
            // Intentionally empty in this example; no action needed if processMessage succeeds
        } catch (bytes memory err) {
            failedMessages.set(any2EvmMessage.messageId, uint256(ErrorCode.BASIC));
            messageContents[any2EvmMessage.messageId] = any2EvmMessage;
            // Don't revert so CCIP doesn't revert. Emit event instead.
            // The message can be retried later without having to do manual execution of CCIP.
            emit MessageFailed(any2EvmMessage.messageId, err);
            return;
        }
    }

    function processMessage(Client.Any2EVMMessage calldata any2EvmMessage)
        external
        onlySelf
        onlyAllowlistedChain(any2EvmMessage.sourceChainSelector)
    {
        // Simulate a revert for testing purposes
        if (simRevert) revert ErrorCase();

        _executeAction(any2EvmMessage);

        _ccipReceive(any2EvmMessage); // process the message - may revert as well
    }

    //
    function _ccipReceive(Client.Any2EVMMessage memory any2EvmMessage) internal override {
        lastMessage = any2EvmMessage;

        (ActionType action, address receiver, address sender) = _decodeDataAction(lastMessage.data);
        emit MessageReceived(
            any2EvmMessage.messageId,
            any2EvmMessage.sourceChainSelector,
            action,
            sender,
            receiver,
            any2EvmMessage.destTokenAmounts[0].token,
            any2EvmMessage.destTokenAmounts[0].amount
        );
    }

    function _encodeDataAction(ActionType _action, address _receiver) internal view returns (bytes memory) {
        if (ActionType.SUPPLY == _action) {
            return abi.encodePacked(_action, _receiver, msg.sender);
        } else {
            //if (ActionType.TRANSFER ==  _action) {
            return abi.encodePacked(_action, _receiver);
        }
    }

    function _decodeDataAction(bytes memory data) internal pure returns (ActionType, address, address) {
        ActionType action;
        address receiver;
        address sender;

        // Assuming that the first 32 bytes represent ActionType
        assembly {
            action := mload(add(data, 32))
        }

        if (action == ActionType.SUPPLY) {
            assembly {
                receiver := mload(add(data, 64))
                sender := mload(add(data, 96))
            }
        } else if (action == ActionType.TRANSFER) {
            assembly {
                receiver := mload(add(data, 32))
            }
        }

        return (action, receiver, sender);
    }

    function _executeAction(Client.Any2EVMMessage memory any2EvmMessage) internal {
        address tokenAddress = any2EvmMessage.destTokenAmounts[0].token;
        uint256 tokenAmount = any2EvmMessage.destTokenAmounts[0].amount;
        (ActionType action, address receiver, address sender) = _decodeDataAction(any2EvmMessage.data);

        if (ActionType.SUPPLY == action) {
            _executeSupply(sender, tokenAddress, tokenAmount);
        } else if (ActionType.TRANSFER == action) {
            _executeTransfer(receiver, tokenAddress, tokenAmount);
        }
    }

    function _executeSupply(address _slot, address _token, uint256 _amount) internal {
        IERC20(_token).approve(_slot, _amount);
        IUserSlot(_slot).supplyRequest();
    }

    function _executeTransfer(address _receiver, address _token, uint256 _amount) internal {
        IERC20(_token).safeTransfer(_receiver, _amount);
    }

    function retryFailedMessage(bytes32 messageId, address tokenReceiver) external {
        if (failedMessages.get(messageId) != uint256(ErrorCode.BASIC)) {
            revert MessageNotFailed(messageId);
        }

        Client.Any2EVMMessage memory message = messageContents[messageId];
        (,, address sender) = _decodeDataAction(message.data);

        if (msg.sender != sender) {
            revert NotOwnerOfFailedMessage(msg.sender);
        }

        failedMessages.set(messageId, uint256(ErrorCode.RESOLVED));

        IERC20(message.destTokenAmounts[0].token).safeTransfer(tokenReceiver, message.destTokenAmounts[0].amount);

        emit MessageRecovered(messageId);
    }

    function withdrawToken(address _beneficiary, address _token) external onlyOwner {
        uint256 amount = IERC20(_token).balanceOf(address(this));

        if (amount == 0) revert NothingToWithdraw();

        IERC20(_token).transfer(_beneficiary, amount);
    }

    function getLastReceivedMessageDetails()
        public
        view
        returns (
            bytes32 messageId,
            ActionType action,
            address receiver,
            address sender,
            address tokenAddress,
            uint256 tokenAmount
        )
    {
        (action, receiver, sender) = _decodeDataAction(lastMessage.data);

        return (
            lastMessage.messageId,
            action,
            receiver,
            sender,
            lastMessage.destTokenAmounts[0].token,
            lastMessage.destTokenAmounts[0].amount
        );
    }

    function setSimRevert(bool _simRevert) external onlyOwner {
        simRevert = _simRevert;
    }
}
