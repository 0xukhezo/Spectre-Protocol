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
      }[]
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const settings = {
        apiKey: "demo",
        network: Network.ETH_MAINNET,
      };

      const alchemy = new Alchemy(settings);

      try {
        const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
        console.log(nftsForOwner);
        const formattedNFTData = nftsForOwner.ownedNfts.map((nft) => ({
          contractAddress: nft.contract.address,
          name: nft.name,
          image: nft?.image?.pngUrl || nft.image.originalUrl,
          collection: nft?.collection?.name,
          owner: ownerAddr,
        }));
        console.log(nftsForOwner);
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
