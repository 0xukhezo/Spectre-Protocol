// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC721} from "src/mocks/MockERC721.sol";


contract ScriptDeployMockERC721 is Script {
    

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        MockERC721 collection = new MockERC721("Spectre Collection", "SPC");
      
        vm.stopBroadcast();

    }
}


