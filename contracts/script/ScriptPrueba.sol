// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {UserSlotFactory} from "src/core/UserSlotFactory.sol";


contract ScriptPrueba is Script {
    

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        UserSlotFactory slotFactory = UserSlotFactory(0x8eEc07Be9Df9D7850Fc7Ae74f86d4D0BA41F9162);
        address eventEmitter = address(slotFactory.eventEmitter());
        console2.log(eventEmitter);

        slotFactory.createSlot();

         vm.stopBroadcast();

    }
}


