import useNFTData from "@/hooks/useNFTData";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SelectNftModal from "../Modals/SelectNftModal";
import Image from "next/image";
import SelectTokenModal from "../Modals/SelectTokenModal";
import { tokens } from "../../../constants/constants";
import GHO from "../../../public/GHO.svg";
import WalletButton from "../Buttons/WalletButton";
import Steps from "../Steps/Steps";

export default function CreateLoanSection() {
  const { address, isConnected } = useAccount();
  const { nftData: data } = useNFTData(address as `0x${string}`);

  const [connected, setConnected] = useState(false);
  const [steps, setSteps] = useState([
    {
      name: "Select NFT",
      description: "Vitae sed mi luctus laoreet.",
      status: "current",
    },
    {
      name: "Select Token",
      description: "Cursus semper viverra facilisis et et some more.",
      status: "upcoming",
    },
    {
      name: "Supply amount",
      description: "Penatibus eu quis ante.",
      status: "upcoming",
    },
    {
      name: "Rewards amount",
      description: "Faucibus nec enim leo et.",
      status: "upcoming",
    },
  ]);

  const [openNFTModal, setOpenNFTModal] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);

  const [nftTitle, setNftTitle] = useState<string | null>(null);
  const [nftContract, setNftContract] = useState<string | null>(null);
  const [nftImage, setNftImage] = useState<string | null>(null);

  const [tokenSymbol, setTokenSymbol] = useState<string | null>(null);
  const [tokenContract, setTokenContract] = useState<string | null>(null);
  const [tokenImage, setTokenImage] = useState<string | null>(null);

  const [amountSupply, setAmountSupply] = useState<number | undefined>(
    undefined
  );
  const [rewards, setRewards] = useState<number | undefined>(undefined);

  const [approveTx, setApproveTx] = useState<boolean | undefined>(false);

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

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (nftContract && tokenContract === null)
      setSteps([
        {
          name: "Select NFT",
          description: "Vitae sed mi luctus laoreet.",
          status: "complete",
        },
        {
          name: "Select Token",
          description: "Cursus semper viverra facilisis et et some more.",
          status: "current",
        },
        {
          name: "Supply amount",
          description: "Penatibus eu quis ante.",
          status: "upcoming",
        },
        {
          name: "Rewards amount",
          description: "Faucibus nec enim leo et.",
          status: "upcoming",
        },
      ]);
  }, [nftContract]);

  useEffect(() => {
    if (tokenContract && amountSupply === undefined)
      setSteps([
        {
          name: "Select NFT",
          description: "Vitae sed mi luctus laoreet.",
          status: "complete",
        },
        {
          name: "Select Token",
          description: "Cursus semper viverra facilisis et et some more.",
          status: "complete",
        },
        {
          name: "Supply amount",
          description: "Penatibus eu quis ante.",
          status: "current",
        },
        {
          name: "Rewards amount",
          description: "Faucibus nec enim leo et.",
          status: "upcoming",
        },
      ]);
  }, [tokenContract]);

  useEffect(() => {
    if (rewards === undefined && amountSupply !== undefined)
      setSteps([
        {
          name: "Select NFT",
          description: "Vitae sed mi luctus laoreet.",
          status: "complete",
        },
        {
          name: "Select Token",
          description: "Cursus semper viverra facilisis et et some more.",
          status: "complete",
        },
        {
          name: "Supply amount",
          description: "Penatibus eu quis ante.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description: "Faucibus nec enim leo et.",
          status: "current",
        },
      ]);
  }, [amountSupply]);

  useEffect(() => {
    if (rewards !== undefined && amountSupply !== undefined)
      setSteps([
        {
          name: "Select NFT",
          description: "Vitae sed mi luctus laoreet.",
          status: "complete",
        },
        {
          name: "Select Token",
          description: "Cursus semper viverra facilisis et et some more.",
          status: "complete",
        },
        {
          name: "Supply amount",
          description: "Penatibus eu quis ante.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description: "Faucibus nec enim leo et.",
          status: "complete",
        },
      ]);
  }, [rewards]);

  return (
    <main className="py-10 navbarTextOpacity">
      {!connected ? (
        <div className="h-[700px] flex justify-center items-center flex-col">
          <h1 className="font-extralight mb-10 text-3xl">
            You need to be connected to get a loan
          </h1>
          <WalletButton />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col px-24 rounded-xl mainBackground py-6 mx-auto max-w-[1000px] my-10">
            <div className="mb-6">
              <h1 className="text-3xl navbarTitle pb-2">Fill your Slot</h1>{" "}
              <hr className="modalAnimatedLine" />
            </div>

            <div className="px-10 grid grid-cols-2">
              <Steps steps={steps} />
              <div className="flex flex-col items-end">
                {" "}
                <button
                  onClick={() => {
                    setOpenNFTModal(true);
                  }}
                  className="bg-main text-black font-light px-4 py-2 rounded-xl hover:bg-secondary max-w-fit mb-4"
                >
                  {nftContract ? (
                    <div className="flex items-center">
                      <span>{nftTitle}</span>
                      {nftImage && (
                        <Image
                          src={nftImage}
                          alt={`${nftTitle} image`}
                          width={40}
                          height={40}
                          id="nftCardImage"
                          className="rounded-lg h-[40px] min-w-[40px] ml-[24px]"
                        />
                      )}
                    </div>
                  ) : (
                    "Select NFT"
                  )}
                </button>{" "}
                <button
                  onClick={() => {
                    setOpenTokenModal(true);
                  }}
                  disabled={nftContract === null}
                  className="bg-main text-black font-light px-4 py-2 rounded-xl hover:bg-secondary max-w-fit my-4"
                >
                  {tokenContract ? (
                    <div className="flex items-center">
                      <span>{tokenSymbol}</span>
                      {tokenImage && (
                        <Image
                          src={tokenImage}
                          alt={`${tokenSymbol} image`}
                          width={40}
                          height={40}
                          id="nftCardImage"
                          className="rounded-lg h-[40px] min-w-[40px] ml-[24px]"
                        />
                      )}
                    </div>
                  ) : (
                    "Select Token"
                  )}
                </button>
                <div className="flex items-center my-4">
                  <input
                    type="number"
                    value={amountSupply}
                    onChange={(e) => setAmountSupply(Number(e.target.value))}
                    className="rounded-lg px-4 py-1 text-black"
                    disabled={tokenContract === null}
                  />{" "}
                  {tokenImage && (
                    <Image
                      src={tokenImage}
                      alt={`${tokenSymbol} image`}
                      width={40}
                      height={40}
                      id="nftCardImage"
                      className="rounded-lg h-[40px] min-w-[40px] ml-[24px] ml-3"
                    />
                  )}
                </div>{" "}
                <div className="flex items-center mt-4">
                  <input
                    type="number"
                    value={rewards}
                    onChange={(e) => setRewards(Number(e.target.value))}
                    className="rounded-lg px-4 py-1 text-black"
                    disabled={amountSupply === undefined}
                  />

                  <Image
                    src={GHO.src}
                    alt={`GHO image`}
                    width={40}
                    height={40}
                    id="nftCardImage"
                    className="rounded-lg h-[40px] min-w-[40px] ml-[24px] ml-3"
                  />
                </div>
              </div>

              {/* <div className="flex justify-between mt-4">
                <div className="flex items-center">
                  <span className="mr-[24px]">1. Select your NFT</span>
                </div>
              </div>
              <div className="flex justify-between my-8">
                <div className="flex items-center">
                  <span className="mr-[24px]">
                    2. Select the token you want as supply in AAVE
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <span className="mr-[24px]">
                    3. Tell your sponsor how much you wawwant as supply
                  </span>
                </div>{" "}
              </div>
              <div className="flex justify-between mt-8">
                <div className="flex items-center">
                  <span className="mr-[24px]">
                    {" "}
                    4. Select the amout of rewards you will give
                  </span>
                </div>
              </div> */}
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

          {nftContract && tokenContract && amountSupply && rewards ? (
            <button className="bg-main text-black font-light px-24 py-4 rounded-xl hover:bg-secondary flex mx-auto mb-4">
              Approve {nftTitle}
            </button>
          ) : (
            <button
              className="flex flex-col px-24 rounded-xl mainBackground py-4 mx-auto mb-4 opacity-50"
              disabled
            >
              Approve NFT
            </button>
          )}
          {approveTx ? (
            <button className="bg-main text-black font-light px-24 py-4 rounded-xl hover:bg-secondary flex mx-auto">
              Create Loan
            </button>
          ) : (
            <button
              className="flex flex-col px-24 rounded-xl mainBackground py-4 mx-auto opacity-50"
              disabled
            >
              Create Loan
            </button>
          )}
        </>
      )}
    </main>
  );
}
