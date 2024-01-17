import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Arrow from "../../../public/Arrow.svg";
import WalletButton from "../Buttons/WalletButton";
import { erc20ABI, useAccount } from "wagmi";
import {
  calculateTimeComponents,
  fetchUri,
  formatAddress,
  formatDate,
  transformUrl,
} from "../../../utils/utils";
import GHO from "../../../public/GHO.svg";
import { abiUserSlot } from "../../../abis/abis.json";
import Error from "../../../public/Error.svg";
import Success from "../../../public/Success.svg";
// Wagmi
import { useContractRead } from "wagmi";
import { abiAAVEPool } from "../../../abis/abis.json";
import { AAVEPoolAddress } from "../../../abis/contractAddress.json";
import { tokens } from "../../../constants/constants";
import TxButton from "../Buttons/TxButton";
import NotificationsCard from "../Cards/NotificationsCard";
import Loader from "../Loader/Loader";
import { useFetchUriInfo } from "@/hooks/useFetchUriInfo";
import { zeroAddress } from "viem";

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

  const [isClosing, setIsClosing] = useState(false);
  const [currentNftIndex, setCurrentNftIndex] = useState(nftIndex);
  const [isAnimating, setIsAnimating] = useState(false);

  const [openBorrowModal, setOpenBorrowModal] = useState(false);
  const [openRepayModal, setOpenRepayModal] = useState(false);

  const [buttonClicked, setButtonClicked] = useState<string>("Initial");
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());
  const [requestToken, setRequestToken] = useState<any>();

  const [title, setTitle] = useState<string | null>(null);
  const [notificationImage, setNotificationImage] = useState<
    string | ReactElement | null
  >(null);
  const [txDescription, setTxDescription] = useState<string | null>(null);
  const [status, setStatus] = useState<string[]>([]);

  const { isConnected } = useAccount();

  const { info, loading } = useFetchUriInfo(
    nftsCopy[currentNftIndex].uri
      ? `${nftsCopy[currentNftIndex].uri}`
      : `${nftsCopy[currentNftIndex].nft.uri}`
  );

  useEffect(() => {
    if (info) {
      setImage(info.image);
      setName(info.name);
    }
  }, [info]);

  const [image, setImage] = useState(info.image);
  const [name, setName] = useState<string>("");

  const { data: accountInfo } = useContractRead({
    address: AAVEPoolAddress as `0x${string}`,
    abi: abiAAVEPool,
    functionName: "getUserAccountData",
    args: ["0xb3204E7bD17273790f5ffb0Bb1e591Ab0011dC55"],
  });

  const { data: decimalsTokenRequest } = useContractRead({
    address: nftsCopy[currentNftIndex].tokenRequest as `0x${string}`,
    abi: erc20ABI,
    functionName: "decimals",
  });

  const healthFactor = accountInfo as any;

  const handleNextNft = async () => {
    setButtonClicked("next");
    setIsAnimating(true);
    const imageContainer = document.getElementById("imageContainer");
    if (imageContainer) {
      imageContainer.classList.add("imagenModalMove");
    }

    const nextImage = await fetchUri(
      nftsCopy[currentNftIndex].uri
        ? nftsCopy[(currentNftIndex + 1) % nftsCopy.length].uri
        : nftsCopy[(currentNftIndex + 1) % nftsCopy.length].nft.uri
    );

    setTimeout(() => {
      setName(nextImage.name);
      setImage(nextImage.image);
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

  const handlePrevNft = async () => {
    setButtonClicked("previous");
    setIsAnimating(true);
    const imageContainer = document.getElementById("imageContainer");

    if (imageContainer) {
      imageContainer.classList.add("imagenModalMove");
    }

    const prevImage = await fetchUri(
      nftsCopy[currentNftIndex].uri
        ? nftsCopy[(currentNftIndex - 1 + nftsCopy.length) % nftsCopy.length]
            .uri
        : nftsCopy[(currentNftIndex - 1 + nftsCopy.length) % nftsCopy.length]
            .nft.uri
    );

    setTimeout(() => {
      setName(prevImage.name);
      setImage(prevImage.image);
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

  const getStatus = (status: string, statusFuction: string) => {
    setStatus([status, statusFuction]);
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
    const requestToken = tokens.filter(
      (token) =>
        nftsCopy[currentNftIndex].tokenRequest === token.contract.toLowerCase()
    );

    setRequestToken(requestToken[0]);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (status[0] === "loading") {
      setTitle("Processing");
      setTxDescription("The transaction is being processed.");
      setNotificationImage(Loader);
    } else if (status[0] === "error") {
      setTitle("Error");
      setTxDescription("Failed transaction.");
      setNotificationImage(Error.src);
    } else if (status[0] === "success") {
      setTitle("Success");
      setTxDescription("The transaction was executed correctly");
      setNotificationImage(Success.src);
    }
    if (status[0] === "success" && status[1] === "approveToken") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setNotificationImage(null);
      }, 2000);
    }

    if (status[0] === "success" && status[1] === "supplyRequest") {
      setTimeout(() => {
        setNotificationImage(null);
        setTxDescription(null);
        setNotificationImage(null);
      }, 2000);
    }
  }, [status]);

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
                <li className="text-2xl mb-3">{`${name}`}</li>
                <li className="text-lg text-xs">
                  Created by{" "}
                  <span className="text-main text-lg">
                    {isPortfolio
                      ? `${nftsCopy[currentNftIndex].collection}`
                      : `${nftsCopy[currentNftIndex].nft.collection.name}`}
                  </span>
                </li>
                <li className="text-lg text-xs">
                  Owner{" "}
                  <span className="text-main text-lg">
                    {isPortfolio
                      ? `${formatAddress(nftsCopy[currentNftIndex].owner)}`
                      : `${formatAddress(nftsCopy[currentNftIndex].user.id)}`}
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
                        {decimalsTokenRequest !== undefined && (
                          <li className="text-lg text-xs flex items-center">
                            Token request
                            <span className="text-main text-lg mx-2">
                              {nftsCopy[currentNftIndex].amountRequest /
                                10 ** decimalsTokenRequest}
                            </span>{" "}
                            {requestToken && (
                              <Image
                                src={requestToken.image}
                                alt={`Token image`}
                                width={24}
                                height={24}
                                className="rounded-lg h-[24px] min-w-[24px]"
                              />
                            )}
                          </li>
                        )}
                        <li className="text-lg text-xs flex items-center">
                          Rewards
                          <span className="text-main text-lg mx-2">{`${
                            nftsCopy[currentNftIndex].rewards / 10 ** 18
                          }`}</span>{" "}
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
                        nftsCopy[currentNftIndex].loanDuration
                      )}`}</span>{" "}
                    </li>
                    {nftsCopy[currentNftIndex].supplier === zeroAddress ? (
                      <li className="text-lg text-xs flex items-center">
                        If supply finish
                        <span className="text-main text-lg mx-2">{`${formatDate(
                          nftsCopy[currentNftIndex].loanDuration +
                            currentTimestamp
                        )}`}</span>{" "}
                      </li>
                    ) : (
                      <li className="text-lg text-xs flex items-center">
                        Finish
                        <span className="text-main text-lg mx-2">{`${formatDate(
                          Number(nftsCopy[currentNftIndex].deadline)
                        )}`}</span>{" "}
                      </li>
                    )}
                  </ul>
                  <div className="modalAnimatedText">
                    {!isConnected ? (
                      <div className="w-min mx-auto mt-10">
                        <WalletButton />
                      </div>
                    ) : isLoan ? (
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
                        <div className="grid grid-cols-2 mt-10">
                          <button
                            className="bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex mx-auto"
                            onClick={() => setOpenBorrowModal(true)}
                          >
                            Borrow GHO
                          </button>
                          {openBorrowModal && <div>Pepe</div>}
                          <button
                            className="bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex mx-auto"
                            onClick={() => setOpenRepayModal(true)}
                          >
                            Repay GHO
                          </button>{" "}
                          {openRepayModal && <div>Pepe</div>}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-10">
                        {(status.length === 0 ||
                          (status[0] === "loading" &&
                            status[1] === "approveToken")) &&
                          requestToken && (
                            <TxButton
                              address={requestToken.contract as `0x${string}`}
                              abi={erc20ABI}
                              functionName="approve"
                              args={[
                                nftsCopy[currentNftIndex].slot.id,
                                nftsCopy[currentNftIndex].amountRequest,
                              ]}
                              getTxStatus={getStatus}
                              children={
                                <span> Approve {requestToken.symbol}</span>
                              }
                              className="bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex mx-auto min-w-[200px] items-center"
                              id="approveToken"
                            />
                          )}
                        {(status[1] === "approveToken" &&
                          status[0] !== "loading") ||
                        (status[1] === "supplyRequest" &&
                          status[0] === "loading") ? (
                          <TxButton
                            address={
                              nftsCopy[currentNftIndex].slot.id as `0x${string}`
                            }
                            abi={abiUserSlot}
                            functionName="supplyRequest"
                            args={[]}
                            getTxStatus={getStatus}
                            children={<span>Supply {requestToken.symbol}</span>}
                            className="bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex mx-auto min-w-[200px] items-center mx-auto text-center mt-4"
                            id="supplyRequest"
                          />
                        ) : (
                          requestToken && (
                            <button
                              className="flex flex-col rounded-xl border-main border-1 px-[34px] py-2 mx-auto opacity-50 min-w-[200px] items-center mt-4"
                              disabled
                            >
                              Supply {requestToken.symbol}
                            </button>
                          )
                        )}
                      </div>
                    )}{" "}
                  </div>
                </>
              )}
            </div>
            <div className="text-gray-400 font-extralight text-xs mt-4">
              The above price data is for informational purposes only and should
              not be used for any investment decisions. Please do your own
              research regarding NFT valuations.
            </div>{" "}
          </Dialog.Panel>{" "}
          {title && notificationImage && txDescription && (
            <NotificationsCard
              title={title}
              image={notificationImage}
              txDescription={txDescription}
              className="absolute top-0 left-0 z-10"
            />
          )}
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
                {image === undefined ? (
                  <Loader />
                ) : (
                  <Image
                    src={transformUrl(image)}
                    alt={`${info.name} image`}
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
                )}
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
