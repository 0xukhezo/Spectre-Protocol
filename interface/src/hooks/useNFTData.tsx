import { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";

export default function useNFTData(ownerAddr: `0x${string}`) {
  const [nftData, setNFTData] = useState<
    | null
    | {
        contractAddress: string;
        name: string | undefined;
        image: string | undefined;
        collection: string | undefined;
        tokenId: string;
      }[]
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const settings = {
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID,
        network: Network.ETH_SEPOLIA,
      };

      const alchemy = new Alchemy(settings);

      try {
        const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
        console.log(nftsForOwner);
        const formattedNFTData = nftsForOwner.ownedNfts.map((nft) => ({
          contractAddress: nft.contract.address,
          name: nft.name || nft.tokenId,
          image: nft?.image?.pngUrl || nft.image.originalUrl,
          collection: nft?.contract.name,
          owner: ownerAddr,
          tokenId: nft.tokenId,
        }));

        setNFTData(formattedNFTData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NFT data:", error);
        setNFTData(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [ownerAddr]);

  return { nftData, loading };
}
