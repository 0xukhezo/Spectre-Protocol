import useNFTData from "@/hooks/useNFTData";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SelectNftModal from "../Modals/SelectNftModal";
import Image from "next/image";
import SelectTokenModal from "../Modals/SelectTokenModal";
import { initialSteps, tokens } from "../../../constants/constants";
import GHO from "../../../public/GHO.svg";
import WalletButton from "../Buttons/WalletButton";
import Steps from "../Steps/Steps";
import { calculateTimeComponents, formatDate } from "../../../utils/utils";

export default function CreateLoanSection() {
  const { address, isConnected } = useAccount();
  const { nftData: data } = useNFTData(address as `0x${string}`);

  const [connected, setConnected] = useState(false);
  const [steps, setSteps] = useState(initialSteps);

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
  const [loanDuration, setLoanDuration] = useState<number | undefined>(
    undefined
  );
  const [loanDurationToContrat, setLoanDurationToContrat] = useState<
    number | undefined
  >(undefined);
  const [approveTx, setApproveTx] = useState<boolean | undefined>(false);

  const getShowMenuNft = (state: boolean) => {
    setOpenNFTModal(state);
  };

  const getShowMenuToken = (state: boolean) => {
    setOpenTokenModal(state);
  };

  const handleLoanDuration = (duration: number) => {
    if (duration >= 0) {
      setLoanDuration(duration);
      setLoanDurationToContrat(duration * 3600 * 1000 * 24 + Date.now());
    } else {
      setLoanDuration(0);
      setLoanDurationToContrat(0);
    }
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
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "current",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "upcoming",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "upcoming",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "upcoming",
        },
      ]);
  }, [nftContract]);

  useEffect(() => {
    if (tokenContract && amountSupply === undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "current",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "upcoming",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "upcoming",
        },
      ]);
  }, [tokenContract]);

  useEffect(() => {
    if (rewards === undefined && amountSupply !== undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "current",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "upcoming",
        },
      ]);
  }, [amountSupply]);

  useEffect(() => {
    if (rewards !== undefined && loanDuration === undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "complete",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "current",
        },
      ]);
  }, [rewards]);

  useEffect(() => {
    if (rewards !== undefined && loanDuration !== undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "complete",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "complete",
        },
      ]);
  }, [loanDuration]);

  console.log(loanDurationToContrat);

  return (
    <main className="pb-10 pt-8 navbarTextOpacity">
      {!connected ? (
        <div className="h-[700px] flex justify-center items-center flex-col">
          <h1 className="font-extralight mb-10 text-3xl">
            You need to be connected to get a loan
          </h1>
          <WalletButton />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col px-24 rounded-xl mainBackground py-6 mx-auto max-w-[1000px] mb-10">
            <div className="mb-6">
              <h1 className="text-3xl navbarTitle pb-2">Fill your Slot</h1>{" "}
              <hr className="modalAnimatedLine" />
            </div>

            <div className="p-10 grid grid-cols-2">
              <Steps steps={steps} />
              <div className="flex flex-col items-end">
                {" "}
                <button
                  onClick={() => {
                    setOpenNFTModal(true);
                  }}
                  className="bg-main text-black font-light px-4 py-2 rounded-xl hover:bg-secondary w-[300px] mb-4 h-[54px]"
                >
                  {nftContract ? (
                    <div className="flex items-center justify-between">
                      <span>{nftTitle}</span>
                      {nftImage && (
                        <Image
                          src={nftImage}
                          alt={`${nftTitle} image`}
                          width={40}
                          height={40}
                          id="nftCardImage"
                          className="rounded-lg h-[40px] min-w-[40px]"
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
                  className={`bg-main text-black font-light px-4 py-2 rounded-xl hover:bg-secondary my-4 w-[300px] items-center flex justify-between h-[54px] ${
                    nftContract === null && "opacity-50"
                  }`}
                >
                  {tokenContract ? (
                    <>
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
                    </>
                  ) : (
                    <span className="mx-auto">Select Token</span>
                  )}
                </button>
                <div
                  className={`rounded-xl text-black bg-main font-light h-[54px] flex items-center my-4 px-4 w-[300px] ${
                    tokenContract === null && "opacity-50"
                  }`}
                >
                  <input
                    type="number"
                    value={amountSupply}
                    min={0}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        setAmountSupply(Number(e.target.value));
                      } else {
                        setAmountSupply(0);
                      }
                    }}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="bg-main pr-8 py-1 text-black bg-main font-light h-[46px] ring-0 focus:ring-0 outline-0"
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
                <div
                  className={`rounded-xl text-black bg-main font-light h-[54px] flex items-center my-4 px-4 w-[300px] ${
                    amountSupply === undefined && "opacity-50"
                  }`}
                >
                  <input
                    type="number"
                    value={rewards}
                    min={0}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        setRewards(Number(e.target.value));
                      } else {
                        setRewards(0);
                      }
                    }}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="rounded-lg pr-8 py-1 text-black bg-main font-light h-[46px] ring-0 focus:ring-0 outline-0"
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
                </div>{" "}
                <div
                  className={`rounded-xl text-black bg-main font-light h-[54px] flex items-center my-4 px-4 w-[300px] ${
                    rewards === undefined && "opacity-50"
                  }`}
                >
                  <input
                    type="number"
                    value={loanDuration}
                    min={0}
                    onChange={(e) => handleLoanDuration(Number(e.target.value))}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="rounded-lg pr-8 py-1 text-black bg-main font-light h-[46px] ring-0 focus:ring-0 outline-0"
                    disabled={rewards === undefined}
                  />
                  <span className="rounded-lg  min-w-[40px] ml-[24px] ml-3 text-center ">
                    d
                  </span>
                </div>{" "}
                {loanDurationToContrat && loanDurationToContrat !== 0 && (
                  <div className=" flex justify-between w-3/4 items-center font-light text-xs">
                    <span>The loan finish:</span>
                    <span>{formatDate(loanDurationToContrat)}</span>
                  </div>
                )}
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
