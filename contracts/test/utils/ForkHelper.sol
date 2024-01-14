// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.17;

import {Vm} from "forge-std/Vm.sol";

contract ForkHelper {
    function fork(Vm vm) public {
        string memory rpcUrl = vm.envString("ETH_NODE_URI_MAINNET");
        uint256 blockNumber = 18976993;

        vm.createSelectFork(rpcUrl, blockNumber);
    }
}
