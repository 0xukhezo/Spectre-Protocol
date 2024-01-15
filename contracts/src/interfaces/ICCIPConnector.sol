// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ICCIPConnector {
    enum ActionType {
        SUPPLY,
        TRANSFER
    }

    function sendMessage(uint64 _chainSelector, address _receiver, ActionType _action, address _token, uint256 _amount)
        external
        payable
        returns (bytes32 messageId);
}
