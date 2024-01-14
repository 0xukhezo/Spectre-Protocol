// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserSlot {
    struct Position {
        address tokenContract;
        uint256 tokenId;
        address tokenRequest;
        uint256 amountRequest;
        address tokenToBorrow;
        uint256 loanDeadline;
        address supplier;
        uint256 rewards;
        uint64 chainSelector;
        bool activeLoan;
    }
}
