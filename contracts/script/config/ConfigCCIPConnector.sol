// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {CCIPConnector} from "src/core/CCIPConnector.sol";

contract DeployCCIPConnector is Script {
    
    
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

       /* uint64 chainSelectorSepolia = 16015286601757825753;
        uint64 chainSelectorArbitrumSepolia = 3478487238524512106;
        
        address ccipConnectorArbitrum = address(0x02);
        address ccipConnectorSepolia = address(0x01);

        //Config for arbitrum
        CCIPConnector connectorArbitrum = CCIPConnector(ccipConnectorArbitrum);
        connectorArbitrum.allowlistChain(chainSelectorSepolia,true,ccipConnectorSepolia); //Arbitrum
        
        //Config for sepolia
        CCIPConnector connectorSepolia = CCIPConnector(ccipConnectorSepolia);
        connectorSepolia.allowlistChain(chainSelectorArbitrumSepolia,true, ccipConnectorArbitrum); //Sepolia*/
  
        vm.stopBroadcast();
    }

}