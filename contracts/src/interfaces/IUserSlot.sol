// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserSlot {
    struct Position {
        address tokenContract;
        uint256 tokenId;
        address tokenRequest;
        uint256 amountRequest;
        address tokenToBorrow;
        uint256 loanDuration;
        uint256 loanDeadline;
        address supplier;
        uint256 rewards;
        uint64 chainSelector;
    }

    //Errors
    error LoanNotActive();
    error LoanActive();
    error PrematureLoanRecovery();
    error LoanDeadlineExceeded();
    error PendingDebtExists();
    error InsufficientAvailableCollateral();
    error LoanAlreadySupplied();
    error ConnectorUnauthorizedAccount(address account);
    error SupplierUnauthorizedAccount(address account);
    error InsufficientRewards(uint256 rewards);

    function openRequest(
        address tokenContract,
        uint256 tokenId,
        address tokenRequest,
        uint256 amountRequest,
        address tokenToBorrow,
        uint256 rewards,
        uint256 loanDeadline
    ) external;
    function supplyRequest() external;
    function supplyRequest(address _supplier, uint64 chainSelector) external;
    function completeLoanSupplier() external;
    function completeLoanSupplier(address sender) external;
    function completeLoanOwner() external;
}
