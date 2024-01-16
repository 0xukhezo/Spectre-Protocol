import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Arrow from "../../../public/Arrow.svg";
import WalletButton from "../Buttons/WalletButton";
import { useAccount, useEnsName } from "wagmi";
import {
  calculateTimeComponents,
  formatAddress,
  formatDate,
} from "../../../utils/utils";
import GHO from "../../../public/GHO.svg";
// Wagmi
import { useContractRead } from "wagmi";
import { abiAAVEPool } from "../../../abis/abis.json";
import { AAVEPoolAddress } from "../../../abis/contractAddress.json";

type NftModalProps = {
  getShowMenu: (open: boolean) => void;
  nftIndex: any;
  nftsCopy: any;
  isLoan: boolean;
  isPortfolio: boolean;
};

export default function NftModal({
  getShowMenu,
  nftIndex,
  nftsCopy,
  isLoan,
  isPortfolio,
}: NftModalProps) {
  const [open, setOpen] = useState(true);
  const [image, setImage] = useState(nftsCopy[nftIndex].image);
  const [isClosing, setIsClosing] = useState(false);
  const [currentNftIndex, setCurrentNftIndex] = useState(nftIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<string>("Initial");
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  const { isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address: nftsCopy[currentNftIndex].owner,
  });

  const { data: accountInfo } = useContractRead({
    address: AAVEPoolAddress as `0x${string}`,
    abi: abiAAVEPool,
    functionName: "getUserAccountData",
    args: ["0xb3204E7bD17273790f5ffb0Bb1e591Ab0011dC55"],
  });
  const healthFactor = accountInfo as any;

  const [approveTx, setApproveTx] = useState<boolean | undefined>(false);

  const handleNextNft = () => {
    setButtonClicked("next");
    setIsAnimating(true);
    const imageContainer = document.getElementById("imageContainer");
    if (imageContainer) {
      imageContainer.classList.add("imagenModalMove");
    }
    setTimeout(() => {
      setImage(nftsCopy[(currentNftIndex + 1) % nftsCopy.length].image);
    }, 400);

    setTimeout(() => {
      setCurrentNftIndex(
        (prevIndex: number) => (prevIndex + 1) % nftsCopy.length
      );
      if (imageContainer) {
        imageContainer.classList.remove("imagenModalMove");
      }

      setIsAnimating(false);
    }, 700);
  };

  const handlePrevNft = () => {
    setButtonClicked("previous");
    setIsAnimating(true);
    const imageContainer = document.getElementById("imageContainer");

    if (imageContainer) {
      imageContainer.classList.add("imagenModalMove");
    }

    setTimeout(() => {
      setImage(
        nftsCopy[(currentNftIndex - 1 + nftsCopy.length) % nftsCopy.length]
          .image
      );
    }, 400);

    setTimeout(() => {
      setCurrentNftIndex(
        (prevIndex: number) =>
          (prevIndex - 1 + nftsCopy.length) % nftsCopy.length
      );
      if (imageContainer) {
        imageContainer.classList.remove("imagenModalMove");
      }
      setIsAnimating(false);
    }, 700);
  };

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setOpen(false);
      getShowMenu(false);
      setIsClosing(false);
    }, 800);
  };

  useEffect(() => {
    setTimeout(() => {
      setButtonClicked("Initial");
    }, 400);
  }, [currentNftIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative " onClose={() => console.log()}>
        <div
          className={`overlay flex justify-between ${open ? "open" : ""}`}
          onClick={() => closeModal()}
        >
          <Dialog.Panel
            className={`textModal mainBackground text-white z-50 ${
              isClosing ? "closing" : ""
            } rounded-lg px-4 pb-4 py-10 text-left sm:p-10 overflow-auto absolute flex flex-col justify-between `}
          >
            <div>
              <h1 className="text-3xl modalAnimatedText pb-1 navbarTitle">
                Nft Information
              </h1>
              <hr className="modalAnimatedLine" />
              <ul className="mt-6 modalAnimatedText">
                <li className="text-2xl mb-3">{`${nftsCopy[currentNftIndex].name}`}</li>
                <li className="text-lg text-xs">
                  Created by{" "}
                  <span className="text-main text-lg">{`${nftsCopy[currentNftIndex].collection}`}</span>
                </li>
                <li className="text-lg mb-3 text-xs">
                  Owner{" "}
                  <span className="text-main text-lg">
                    {ensName
                      ? ensName
                      : `${formatAddress(nftsCopy[currentNftIndex].owner)}`}
                  </span>
                </li>
                <li className="mb-2 mt-3 flex text-black font-light">
                  <span className="bg-main rounded-full px-6">ERC 721</span>
                  <span className="bg-main rounded-full px-6 ml-8">Listed</span>
                </li>
              </ul>
              {!isPortfolio && (
                <>
                  {!isLoan && (
                    <>
                      <h1 className="text-3xl modalAnimatedText pb-1 navbarTitle mt-10">
                        Desired terms
                      </h1>
                      <hr className="modalAnimatedLine" />
                      <ul className="mt-6 modalAnimatedText">
                        <li className="text-lg text-xs flex items-center">
                          Token supply
                          <span className="text-main text-lg mx-2">{`100`}</span>{" "}
                          <Image
                            src={GHO.src}
                            alt={`Token image`}
                            width={24}
                            height={24}
                            className="rounded-lg h-[24px] min-w-[24px]"
                          />
                        </li>
                        <li className="text-lg text-xs flex items-center">
                          Rewards
                          <span className="text-main text-lg mx-2">{`100`}</span>{" "}
                          <Image
                            src={GHO.src}
                            alt={`Token image`}
                            width={24}
                            height={24}
                            className="rounded-lg h-[24px] min-w-[24px]"
                          />
                        </li>
                      </ul>
                    </>
                  )}
                  <h1 className="text-3xl modalAnimatedText pb-1 navbarTitle mt-10">
                    Loan Duration
                  </h1>
                  <hr className="modalAnimatedLine" />
                  <ul className="mt-6 modalAnimatedText">
                    <li className="text-lg text-xs flex items-center">
                      Duration
                      <span className="text-main text-lg mx-2">{`${calculateTimeComponents(
                        360000
                      )}`}</span>{" "}
                    </li>
                    <li className="text-lg text-xs flex items-center">
                      Finish
                      <span className="text-main text-lg mx-2">{`${formatDate(
                        3805408412003 - currentTimestamp
                      )}`}</span>{" "}
                    </li>
                  </ul>
                  <div className="modalAnimatedText">
                    {" "}
                    {!isConnected ? (
                      <div className="w-min mx-auto mt-10">
                        <WalletButton />
                      </div>
                    ) : !isLoan ? (
                      <div>
                        <h1 className="text-3xl modalAnimatedText pb-1 navbarTitle mt-10">
                          Loan Health
                        </h1>
                        <hr className="modalAnimatedLine" />
                        <ul className="mt-6 modalAnimatedText">
                          <li className="text-lg text-xs flex items-center">
                            Health Factor
                            <span className="text-main text-lg mx-2">
                              {" "}
                              {healthFactor !== undefined &&
                              Number(healthFactor[5]) / 10 ** 18 > 20
                                ? "∞"
                                : `${(healthFactor[5] / 10 ** 18).toFixed(2)}`}
                            </span>{" "}
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="mt-10">
                        {!approveTx && (
                          <button className="bg-main text-black font-light px-[50px] py-2 rounded-xl hover:bg-secondary flex mx-auto mb-4">
                            Approve
                          </button>
                        )}

                        {approveTx ? (
                          <button className="bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex mx-auto">
                            Create Loan
                          </button>
                        ) : (
                          <button
                            className="flex flex-col rounded-xl border-main border-1 px-[34px] py-2 mx-auto opacity-50"
                            disabled
                          >
                            Create Loan
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="text-gray-400 font-extralight text-xs mt-4">
              The above price data is for informational purposes only and should
              not be used for any investment decisions. Please do your own
              research regarding NFT valuations.
            </div>
          </Dialog.Panel>
          <Dialog.Panel
            id="imageContainer"
            className={`imageModal  ${
              isClosing ? "closing" : ""
            } text-left overflow-auto flex w-full h-2/3 flex-col items-center justify-center relative`}
          >
            <div
              className={`relative h-full w-full image-transition flex flex-col items-center justify-center`}
              onClick={() => closeModal()}
            >
              <div className="contenedor-imagen">
                <Image
                  src={image}
                  alt={`${nftsCopy[currentNftIndex].name} image`}
                  width={300}
                  height={300}
                  className={`h-[400px] w-[400px] rounded-xl z-10 ${
                    !isAnimating && buttonClicked === "previous"
                      ? "animate-transition-initial-next"
                      : ""
                  } ${
                    !isAnimating && buttonClicked === "next"
                      ? "animate-transition-initial-prev"
                      : ""
                  } ${
                    isAnimating && buttonClicked === "previous"
                      ? "animate-transition-next"
                      : ""
                  } ${
                    isAnimating && buttonClicked === "next"
                      ? "animate-transition-prev"
                      : ""
                  } ${
                    !isAnimating &&
                    buttonClicked === "Initial" &&
                    "modalNftImage"
                  }`}
                />
              </div>
            </div>
            {nftsCopy.length > 1 && (
              <div className="absolute bottom-2 text-white flex  justify-between z-50 grid grid-cols-2 gap-x-[24px]">
                <div className="p-0.5 rounded-full ">
                  <button
                    className="shadow mainBackground p-2 rounded-full rotate-180"
                    onClick={handlePrevNft}
                    disabled={isAnimating}
                  >
                    <Image
                      src={Arrow.src}
                      alt={`Prev`}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
                <div className="p-0.5 rounded-full">
                  <button
                    className="shadow mainBackground p-2 rounded-full "
                    onClick={handleNextNft}
                    disabled={isAnimating}
                  >
                    <Image
                      src={Arrow.src}
                      alt={`Prev`}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
