// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IEventEmitter} from "src/interfaces/IEventEmitter.sol";
import {IUserSlotFactory} from "src/interfaces/IUserSlotFactory.sol";

contract EventEmitter is IEventEmitter {
    IUserSlotFactory public userSlotFactory;

    error SlotNotExists(address slot);
    error NotSlotFactory(address sender);

    modifier onlySlot() {
        if (!userSlotFactory.slotExists(msg.sender)) {
            revert SlotNotExists(msg.sender);
        }
        _;
    }

    modifier onlyFactory() {
        if (msg.sender != address(userSlotFactory)) {
            revert NotSlotFactory(msg.sender);
        }
        _;
    }

    constructor(address _userSlotFactory) {
        userSlotFactory = IUserSlotFactory(_userSlotFactory);
    }

    function emitUserSlotCreated(address owner, address slot) public onlyFactory {
        emit SlotUserCreated(owner, slot);
    }

    function emitNewRequestLoan(
        address tokenContract,
        uint256 tokenId,
        address tokenRequest,
        uint256 amountRequest,
        address tokenToBorrow,
        uint256 rewards,
        uint256 loanDeadline
    ) public onlySlot {
        emit NewRequestLoan(
            msg.sender, tokenContract, tokenId, tokenRequest, amountRequest, tokenToBorrow, rewards, loanDeadline
        );
    }

    function emitSuppliedLoan(address supplier, uint64 chainSelector) public onlySlot {
        emit SuppliedLoan(msg.sender, supplier, chainSelector);
    }

    function emitCompleteLoan(uint64 chainSelector) public onlySlot {
        emit CompleteLoan(msg.sender, chainSelector);
    }
}
