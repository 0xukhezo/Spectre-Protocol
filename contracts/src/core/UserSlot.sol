// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IPool} from "aave-v3-core/contracts/interfaces/Ipool.sol";
import {IPoolDataProvider} from "aave-v3-core/contracts/interfaces/IpoolDataProvider.sol";
import {ICreditDelegationToken} from "aave-v3-core/contracts/interfaces/ICreditDelegationToken.sol";

import {IUserSlot} from "src/interfaces/IUserSlot.sol";
import {ICCIPConnector} from "src/interfaces/ICCIPConnector.sol";
import {IEventEmitter} from "src/interfaces/IEventEmitter.sol";

import {console2} from "forge-std/Test.sol";

contract UserSlot is IUserSlot, Ownable, ERC721Holder {
    using SafeERC20 for IERC20;

    IPool immutable pool;
    IPoolDataProvider immutable protocolDataProvider;
    ICCIPConnector immutable connector;
    IEventEmitter immutable eventEmitter;
    IERC20 immutable ghoToken;

    Position public position;

    modifier onlySupplier() {
        if (position.supplier != _msgSender()) {
            revert SupplierUnauthorizedAccount(_msgSender());
        }
        _;
    }

    modifier onlySupplierFromConnector(address sender) {
        if (_msgSender() != address(connector) || sender != position.supplier) {
            revert SupplierUnauthorizedAccount(_msgSender());
        }
        _;
    }

    modifier onlyConnector() {
        if (address(connector) != _msgSender()) {
            revert ConnectorUnauthorizedAccount(_msgSender());
        }
        _;
    }

    modifier loanActive() {
        if (!_isLoanActive()) {
            revert LoanNotActive();
        }
        _;
    }

    constructor(
        address _pool,
        address _aaveDataProvider,
        address _connector,
        address _eventEmitter,
        address _ghoToken,
        address _owner
    ) Ownable(_owner) {
        pool = IPool(_pool);
        protocolDataProvider = IPoolDataProvider(_aaveDataProvider);
        connector = ICCIPConnector(_connector);
        eventEmitter = IEventEmitter(_eventEmitter);
        ghoToken = IERC20(_ghoToken);
    }

    function openRequest(
        address tokenContract,
        uint256 tokenId,
        address tokenRequest,
        uint256 amountRequest,
        address tokenToBorrow,
        uint256 rewards,
        uint256 loanDuration
    ) external onlyOwner {
        if (_isLoanActive()) {
            revert LoanActive();
        }

        // may have debt
        if (_hasPendingDebt()) {
            revert PendingDebtExists();
        }

        ghoToken.safeTransferFrom(_msgSender(), address(this), rewards);

        require(tokenContract != address(0), "Token contract could not be zero");
        require(tokenRequest != address(0), "Token request could not be zero");
        require(amountRequest != 0, "Amount request could not be zero");
        IERC721(tokenContract).safeTransferFrom(_msgSender(), address(this), tokenId);
        position = Position(
            tokenContract,
            tokenId,
            tokenRequest,
            amountRequest,
            tokenToBorrow,
            loanDuration,
            type(uint256).max,
            address(0),
            rewards,
            0
        );

        eventEmitter.emitNewRequestLoan(
            tokenContract, tokenId, tokenRequest, amountRequest, tokenToBorrow, rewards, loanDuration
        );
    }

    function supplyRequest() external {
        if (_isLoanActive()) {
            revert LoanAlreadySupplied();
        }

        IERC20(position.tokenRequest).safeTransferFrom(_msgSender(), address(this), position.amountRequest);
        position.chainSelector = 0;
        position.supplier = _msgSender();
        position.loanDeadline = block.timestamp + position.loanDuration;
        IERC20(position.tokenRequest).approve(address(pool), position.amountRequest);
        pool.supply(position.tokenRequest, position.amountRequest, address(this), 0);

        (, address stableDebtTokenAddress, address variableDebtTokenAddress) =
            protocolDataProvider.getReserveTokensAddresses(position.tokenToBorrow);
        ICreditDelegationToken(stableDebtTokenAddress).approveDelegation(owner(), type(uint256).max);
        ICreditDelegationToken(variableDebtTokenAddress).approveDelegation(owner(), type(uint256).max);

        eventEmitter.emitSuppliedLoan(_msgSender(), 0);
    }

    function supplyRequest(address supplier, uint64 chainSelector) external onlyConnector {
        if (!_isLoanActive()) {
            revert LoanAlreadySupplied();
        }

        IERC20(position.tokenRequest).safeTransferFrom(_msgSender(), address(this), position.amountRequest);
        position.supplier = supplier;
        position.chainSelector = chainSelector;
        position.loanDeadline = block.timestamp + position.loanDuration;
        IERC20(position.tokenRequest).approve(address(pool), position.amountRequest);
        pool.supply(position.tokenRequest, position.amountRequest, address(this), 0);

        (, address stableDebtTokenAddress, address variableDebtTokenAddress) =
            protocolDataProvider.getReserveTokensAddresses(position.tokenToBorrow);
        ICreditDelegationToken(stableDebtTokenAddress).approveDelegation(owner(), type(uint256).max);
        ICreditDelegationToken(variableDebtTokenAddress).approveDelegation(owner(), type(uint256).max);

        eventEmitter.emitSuppliedLoan(supplier, chainSelector);
    }

    function recoverRemainingSupply(address token, uint256 amount) external onlyOwner {
        if (_isLoanActive()) {
            revert LoanActive();
        }

        pool.withdraw(token, amount, owner());
        IERC20(token).safeTransfer(owner(), amount);
    }

    function _isLoanActive() internal view returns (bool) {
        //return position.activeLoan;
        return position.supplier != address(0);
    }

    function _hasSupplier() internal view returns (bool) {
        return position.supplier != address(0);
    }

    function _hasPendingDebt() internal view returns (bool) {
        if (position.tokenToBorrow != address(0)) {
            (, uint256 stableDebtTokenBalance, uint256 variableDebtTokenBalance,,,,,,) =
                protocolDataProvider.getUserReserveData(position.tokenToBorrow, address(this));
            return stableDebtTokenBalance != 0 || variableDebtTokenBalance != 0;
        }
        return false;
    }

    function completeLoanSupplier() external onlySupplier loanActive {
        if (position.loanDeadline > block.timestamp) {
            revert PrematureLoanRecovery();
        }
        _completeLoan();
    }

    function completeLoanSupplier(address sender) external onlySupplierFromConnector(sender) loanActive {
        if (position.loanDeadline > block.timestamp) {
            revert PrematureLoanRecovery();
        }
        _completeLoan();
    }

    function _completeLoan() internal {
        (uint256 aTokenBalance,,,,,,,,) = protocolDataProvider.getUserReserveData(position.tokenRequest, address(this));
        (, uint256 stableDebtTokenBalance, uint256 variableDebtTokenBalance,,,,,,) =
            protocolDataProvider.getUserReserveData(position.tokenToBorrow, address(this));

        if (aTokenBalance >= position.amountRequest && stableDebtTokenBalance == 0 && variableDebtTokenBalance == 0) {
            pool.withdraw(position.tokenRequest, type(uint256).max, address(this));
            _finalizeSuccessfulLoanTransfer(aTokenBalance);
        } else {
            _finalizeFailedLoanTransfer();
        }
    }

    /**
     * Cuando se puede finalizar el prestamo
     *     - ha pasado el tiempo - position.loanDeadline>block.timestamp -> por supplier
     *     - lo han liquidado -> por supplier y por owner
     *     - finalizar antes de tiempo -> por owner
     */
    function completeLoanOwner() external onlyOwner {
        if (position.loanDeadline < block.timestamp) {
            revert LoanDeadlineExceeded();
        }

        if (_hasPendingDebt()) {
            revert PendingDebtExists();
        }

        (uint256 aTokenBalance,,,,,,,,) = protocolDataProvider.getUserReserveData(position.tokenRequest, address(this));

        if (_hasSupplier() && aTokenBalance < position.amountRequest) {
            revert InsufficientAvailableCollateral();
        }

        pool.withdraw(position.tokenRequest, aTokenBalance, address(this));

        _finalizeSuccessfulLoanTransfer(aTokenBalance);
    }

    //TODO nonreentrancy?
    function _finalizeSuccessfulLoanTransfer(uint256 aTokenAmount) internal {
        IERC721(position.tokenContract).safeTransferFrom(address(this), owner(), position.tokenId);

        if (position.chainSelector == 0) {
            IERC20(position.tokenRequest).safeTransfer(position.supplier, aTokenAmount);
        } else {
            IERC20(position.tokenRequest).approve(address(connector), aTokenAmount);
            connector.sendMessage(
                position.chainSelector,
                position.supplier,
                ICCIPConnector.ActionType.TRANSFER,
                position.tokenRequest,
                aTokenAmount
            );
        }
        _transferRewardsToSupplier();
        position.supplier = address(0);
        eventEmitter.emitCompleteLoan(true, aTokenAmount);
    }

    //TODO no reentrancy?
    function _finalizeFailedLoanTransfer() internal {
        uint256 currentBalance = IERC20(position.tokenRequest).balanceOf(address(this));
        if (currentBalance != 0) {
            if (position.chainSelector == 0) {
                IERC20(position.tokenRequest).safeTransfer(position.supplier, currentBalance);
            } else {
                IERC20(position.tokenRequest).approve(address(connector), currentBalance);
                connector.sendMessage(
                    position.chainSelector,
                    position.supplier,
                    ICCIPConnector.ActionType.TRANSFER,
                    position.tokenRequest,
                    currentBalance
                );
            }
        }
        IERC721(position.tokenContract).safeTransferFrom(address(this), position.supplier, position.tokenId);
        _transferRewardsToSupplier();
        position.supplier = address(0);
        eventEmitter.emitCompleteLoan(false, 0);
    }

    function _transferRewardsToSupplier() internal {
        ghoToken.safeTransfer(position.supplier, position.rewards);
    }
}
