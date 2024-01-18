// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {UserSlotFactory} from "src/core/UserSlotFactory.sol";
import {CCIPConnector} from "src/core/CCIPConnector.sol";

contract ScriptDeploySlotFactory is Script {
    address constant aavePool = 0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951;
    address constant poolDataProvider = 0x3e9708d80f7B3e43118013075F7e95CE3AB31F31;
    address constant GHO = 0xc4bF5CbDaBE595361438F8c6a187bDc330539c60;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        UserSlotFactory slotFactory = new UserSlotFactory(aavePool, poolDataProvider, GHO);

        address eventEmitter = address(slotFactory.eventEmitter());
        console2.log(eventEmitter);

        vm.stopBroadcast();
    }
}

//forge script script/deploys/DeploySlotFactory.sol:ScriptDeploySlotFactory --rpc-url $SEPOLIA_RPC_URL --broadcast --verify

//forge verify-contract --chain-id 11155111 --num-of-optimizations 1000000 --watch --constructor-args $(cast abi-encode "constructor(address,address,address,address)" "0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951" "0x3e9708d80f7B3e43118013075F7e95CE3AB31F31" "0xd479F9D2BD64dd6580247E0160Bf93fDad7045Cd" "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60") --etherscan-api-key PV2MMF7I4P9FXZ624NHSWFNNAJNKJUFPB6 --compiler-version v0.8.23+commit.f704f362 0x8eEc07Be9Df9D7850Fc7Ae74f86d4D0BA41F9162 src/core/UserSlotFactory.sol:UserSlotFactory
