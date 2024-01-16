// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC721} from "src/mocks/MockERC721.sol";


contract ScriptMint is Script {
    

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        MockERC721 collection = MockERC721(0x19cfa3A50Abf669FF7000675e81F6A6Cbbe7436A);
        collection.mint(0xb4f28403cC940878292046208Cb9476b00C5C197,2);
        //collection.setBaseUri("https://ipfs.io/ipfs/Qmf3AoXap9A2AKXKGJpVo7ZbYEJLM7Gm1fY1sGnBP2ZjWq/");
        
        console2.log(collection.tokenURI(2));
        
        vm.stopBroadcast();

    }
}


