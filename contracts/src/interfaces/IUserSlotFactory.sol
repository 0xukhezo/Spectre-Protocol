// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserSlotFactory {
    function createSlot() external;
    function slotExists(address _slotAddress) external view returns (bool);
}
