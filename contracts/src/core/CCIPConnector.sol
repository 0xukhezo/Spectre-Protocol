// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ICCIPConnector} from "src/interfaces/ICCIPConnector.sol";

contract CCIPConnector is ICCIPConnector {
    constructor() {}

    function sendMessage(uint64 _chainSelector, address _receiver, ActionType _action, address _token, uint256 _amount)
        external
        payable
        returns (bytes32 messageId)
    {}
}
