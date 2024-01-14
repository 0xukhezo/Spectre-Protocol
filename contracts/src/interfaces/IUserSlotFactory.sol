// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUserSlotFactory {
    error InvalidAddressForConstructorArgument(string argument);

    function createSlot() external;
    function slotExists(address _slotAddress) external view returns (bool);
}
