// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC721} from "src/mocks/MockERC721.sol";


contract ScriptDeployMockERC721 is Script {
    

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        MockERC721 collection = new MockERC721("Sonar", "SNR");

        collection.safeMint(0x31AE9D5A302bAEC5A1c5fBeeB8A1308364BeFC80,1, "ipfs://QmZQfrYoDy8RZZNsf8Udo3NE6QrNZaTLNKU8sNiaHcUJ9N/1.json");
        collection.safeMint(0x31AE9D5A302bAEC5A1c5fBeeB8A1308364BeFC80,2, "ipfs://QmZQfrYoDy8RZZNsf8Udo3NE6QrNZaTLNKU8sNiaHcUJ9N/2.json");
        collection.safeMint(0x31AE9D5A302bAEC5A1c5fBeeB8A1308364BeFC80,3, "ipfs://QmZQfrYoDy8RZZNsf8Udo3NE6QrNZaTLNKU8sNiaHcUJ9N/3.json");
        collection.safeMint(0x31AE9D5A302bAEC5A1c5fBeeB8A1308364BeFC80,4, "ipfs://QmZQfrYoDy8RZZNsf8Udo3NE6QrNZaTLNKU8sNiaHcUJ9N/4.json");
      
        vm.stopBroadcast();

    }
}

//forge script script/ERC721/ScriptDeployMockERC721.sol:ScriptDeployMockERC721 --rpc-url $SEPOLIA_RPC_URL --broadcast --verify


