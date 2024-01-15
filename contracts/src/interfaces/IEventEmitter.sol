// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEventEmitter {
    //OnlySlot
    event NewRequestLoan(
        address indexed slot,
        address tokenContract,
        uint256 tokenId,
        address tokenRequest,
        uint256 amountRequest,
        address tokenToBorrow,
        uint256 rewards,
        uint256 loanDeadline
    );
    event SuppliedLoan(address indexed slot, address supplier, uint64 chainSelector);
    event CompleteLoan(address indexed slot, bool successfull, uint256 amountWithdraw);

    //OnlyFactory
    event SlotUserCreated(address indexed owner, address indexed slot);

    function emitUserSlotCreated(address owner, address slot) external;
    function emitNewRequestLoan(
        address tokenContract,
        uint256 tokenId,
        address tokenRequest,
        uint256 amountRequest,
        address tokenToBorrow,
        uint256 rewards,
        uint256 loanDeadline
    ) external;
    function emitSuppliedLoan(address supplier, uint64 chainSelector) external;
    function emitCompleteLoan(bool successfull, uint256 amountWithdraw) external;
}
