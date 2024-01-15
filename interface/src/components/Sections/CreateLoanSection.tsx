import useNFTData from "@/hooks/useNFTData";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import SelectNftModal from "../Modals/SelectNftModal";
import Image from "next/image";
import SelectTokenModal from "../Modals/SelectTokenModal";
import { tokens } from "../../../constants/constants";

export default function CreateLoanSection() {
  const { address } = useAccount();
  const { nftData: data } = useNFTData(address as `0x${string}`);

  const [openNFTModal, setOpenNFTModal] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);

  const [nftTitle, setNftTitle] = useState<string>("Select your NFT");
  const [nftContract, setNftContract] = useState<string | null>(null);
  const [nftImage, setNftImage] = useState<string | null>(null);

  const [tokenSymbol, setTokenSymbol] = useState<string>("Select your Token");
  const [tokenContract, setTokenContract] = useState<string | null>(null);
  const [tokenImage, setTokenImage] = useState<string | null>(null);

  const [amountSupply, setAmountSupply] = useState<number | undefined>(
    undefined
  );

  const [rewards, setRewards] = useState<number | undefined>(0);

  const getShowMenuNft = (state: boolean) => {
    setOpenNFTModal(state);
  };

  const getShowMenuToken = (state: boolean) => {
    setOpenTokenModal(state);
  };

  const getNft = (nft: any) => {
    setNftContract(nft.contractAddress);
    setNftImage(nft.image);
    setNftTitle(nft.name);
  };

  const getToken = (token: any) => {
    setTokenContract(token.contract);
    setTokenImage(token.image);
    setTokenSymbol(token.symbol);
  };

  return (
    <main className="py-10 navbarTextOpacity">
      <div className="mainBackground p-6 rounded-xl flex justify-between text-lg max-w-[1000px] mx-auto">
        <div className="w-full">
          <span>
            You need to create a slot in order to can have a loan in one of your
            NFTs.
          </span>
          <div className="w-full my-4 gap-x-[24px] text-start">
            <ul>1. Select your NFT.</ul>
            <ul className="my-1">
              2. Select the token you want as supply in AAVE.
            </ul>
            <ul>3. Tell your sponsor how much you want as supply.</ul>
            <ul className="my-1">
              4. Select the amout of rewards you will give.
            </ul>{" "}
          </div>{" "}
        </div>{" "}
      </div>

      <div className="w-full flex flex-col px-24 rounded-xl mainBackground py-6 mx-auto max-w-[1000px] my-10">
        <div className="mb-6">
          <h1 className="text-3xl navbarTitle pb-2">Create your loan</h1>{" "}
          <hr className="modalAnimatedLine" />
        </div>
        <div className="px-10">
          {" "}
          <div className="flex justify-between mt-4">
            <div className="flex items-center">
              {nftContract && <span className="mr-[24px]">Nft Selected:</span>}
              <span>{nftTitle}</span>
              {nftImage && (
                <Image
                  src={nftImage}
                  alt={`${nftTitle} image`}
                  width={50}
                  height={50}
                  id="nftCardImage"
                  className="rounded-lg h-[50px] min-w-[50px] ml-[24px]"
                />
              )}
            </div>
            <button
              onClick={() => {
                setOpenNFTModal(true);
              }}
              className="bg-main text-black font-light px-4 py-2 rounded-xl max-h-[44px] hover:bg-secondary min-w-[140px]"
            >
              {nftContract ? "Change" : "Select NFT"}
            </button>
          </div>
          <div className="flex justify-between my-8">
            <div className="flex items-center">
              {tokenContract && (
                <span className="mr-[24px]">Token Selected:</span>
              )}
              <span>{tokenSymbol}</span>
              {tokenImage && (
                <Image
                  src={tokenImage}
                  alt={`${tokenSymbol} image`}
                  width={50}
                  height={50}
                  id="nftCardImage"
                  className="rounded-lg h-[50px] min-w-[50px] ml-[24px]"
                />
              )}
            </div>
            <button
              onClick={() => {
                setOpenTokenModal(true);
              }}
              className="bg-main text-black font-light px-4 py-2 rounded-xl max-h-[44px] hover:bg-secondary min-w-[140px]"
            >
              {nftContract ? "Change" : "Select Token"}
            </button>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              {amountSupply !== undefined ? (
                <span className="mr-[24px]">Total supply:</span>
              ) : (
                <span className="mr-[24px]">Sponsor supply:</span>
              )}
              {amountSupply !== undefined && <span>{amountSupply}</span>}
              {tokenSymbol !== "Select your Token" &&
                amountSupply !== undefined && (
                  <span className="ml-3">{tokenSymbol}</span>
                )}
            </div>
            <input
              type="number"
              value={amountSupply}
              onChange={(e) => setAmountSupply(Number(e.target.value))}
              className="rounded-lg px-4 py-1 text-black"
            />{" "}
          </div>
          <div className="flex justify-between mt-8">
            <div className="flex items-center">
              {rewards !== undefined ? (
                <span className="mr-[24px]">Total rewards:</span>
              ) : (
                <span className="mr-[24px]">Sponsor supply:</span>
              )}
              {rewards !== undefined && <span>{rewards}</span>}
              <span className="ml-3">GHO</span>
            </div>
            <input
              type="number"
              value={rewards}
              onChange={(e) => setRewards(Number(e.target.value))}
              className="rounded-lg px-4 py-1 text-black"
            />{" "}
          </div>
        </div>
        {openNFTModal && data && (
          <SelectNftModal
            getShowMenu={getShowMenuNft}
            title="Select Nft"
            assetsArray={data}
            getAsset={getNft}
          />
        )}
        {openTokenModal && (
          <SelectTokenModal
            getShowMenu={getShowMenuToken}
            title="Select Nft"
            assetsArray={tokens}
            getAsset={getToken}
          />
        )}
      </div>
    </main>
  );
}
