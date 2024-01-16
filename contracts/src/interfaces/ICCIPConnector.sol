// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICCIPConnector {
    //Errors
    error ChainNotAllowlisted(uint64 chainSelector);
    error NotEnoughBalance(uint256 currentBalance, uint256 calculatedFees);
    error ContractProtocolAddressZero(uint64 chainSelector);
    error OnlySelf();
    error MessageNotFailed(bytes32 messageId);
    error NotOwnerOfFailedMessage(address sender);
    error NothingToWithdraw();
    error ErrorCase();

    enum ErrorCode {
        RESOLVED,
        BASIC
    }

    //Events
    event MessageSent(
        bytes32 indexed messageId,
        uint64 indexed chainSelector,
        address receiver,
        address token,
        uint256 tokenAmount,
        address feeToken,
        uint256 fees
    );
    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed chainSelector,
        ActionType action,
        address sender,
        address receiver,
        address token,
        uint256 tokenAmount
    );
    event MessageFailed(bytes32 indexed messageId, bytes reason);
    event MessageRecovered(bytes32 indexed messageId);

    enum ActionType {
        SUPPLY,
        TRANSFER
    }

    function sendMessage(uint64 _chainSelector, address _receiver, ActionType _action, address _token, uint256 _amount)
        external
        payable
        returns (bytes32 messageId);

    function allowlistChain(uint64 _chainSelector, bool _allowed, address _contractProtocol) external;
    function retryFailedMessage(bytes32 messageId, address tokenReceiver) external;
    function withdrawToken(address _beneficiary, address _token) external;
}
