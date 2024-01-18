// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {CCIPConnector} from "src/core/CCIPConnector.sol";

contract DeployCCIPConnector is Script {
    
    
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        address  ccipRouter = 0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59;
        CCIPConnector ccipConnector = new CCIPConnector(ccipRouter);
  
        vm.stopBroadcast();
    }

}

//forge script script/deploys/DeployCCIPConnector.sol:DeployCCIPConnector --rpc-url $SEPOLIA_RPC_URL --broadcast --verify -vvvv --via-ir

