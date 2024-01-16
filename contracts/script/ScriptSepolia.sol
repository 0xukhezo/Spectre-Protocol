// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {UserSlotFactory} from "src/core/UserSlotFactory.sol";
import {CCIPConnector} from "src/core/CCIPConnector.sol";

contract CounterScript is Script {

    address constant aavePool = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951;
    address constant poolDataProvider = 0x3e9708d80f7B3e43118013075F7e95CE3AB31F31;
    address constant ccipRouter = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        CCIPConnector connector = new CCIPConnector(ccipRouter);
 
        UserSlotFactory slotFactory = new UserSlotFactory(aavePool, poolDataProvider, ccipConnector, GHO);
        vm.stopBroadcast();
    }
}
