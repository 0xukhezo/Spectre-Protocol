// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {UserSlotFactory} from "src/core/UserSlotFactory.sol";
import {CCIPConnector} from "src/core/CCIPConnector.sol";

contract ScriptConfigFactory is Script {

    address constant ccipRouter = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
 
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        CCIPConnector ccipConnector = new CCIPConnector(ccipRouter);

        UserSlotFactory factory = UserSlotFactory(0xe0AE52B7b2440f3959F7a5997538D3A273Ad0dF3);
        factory.setConnector(address(ccipConnector));

        vm.stopBroadcast();
    }
}

//forge script script/config/ScriptConfigFactory.sol:ScriptConfigFactory --rpc-url $SEPOLIA_RPC_URL --broadcast --via-ir

