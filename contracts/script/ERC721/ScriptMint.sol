// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console2} from "forge-std/Script.sol";
import {MockERC721} from "src/mocks/MockERC721.sol";


contract ScriptMint is Script {
    

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        
        MockERC721 collection = MockERC721(0xB919133E05E67476e37748299c8235F83A331e9a);
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,1, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/1.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,2, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/2.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,3, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/3.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,4, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/4.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,5, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/5.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,6, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/6.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,7, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/7.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,8, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/8.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,9, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/9.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,10, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/10.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,11, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/11.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,12, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/12.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,13, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/13.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,14, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/14.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,15, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/15.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,16, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/16.json");
        collection.safeMint(0x872f2Fc756b18B3Cc028bd0Cee10a9aE1683Cc0B,17, "ipfs://QmNspLBCSVPDPDqCMx4Yd4VoCLA5RTDbtAqphkLT4489ms/17.json");
        
        //collection.setTokenuri(1,"https://ipfs.io/ipfs/Qmf3AoXap9A2AKXKGJpVo7ZbYEJLM7Gm1fY1sGnBP2ZjWq/");
        //console2.log(collection.tokenURI(2));
        
        vm.stopBroadcast();

    }
}

//forge script script/ERC721/ScriptMint.sol:ScriptMint --rpc-url $SEPOLIA_RPC_URL --broadcast --verify


