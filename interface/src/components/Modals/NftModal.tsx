import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Arrow from "../../../public/Arrow.svg";
import WalletButton from "../Buttons/WalletButton";
import { useAccount, useEnsName } from "wagmi";
import { formatAddress } from "../../../utils/utils";
type NftModalProps = {
  getShowMenu: (open: boolean) => void;
  nftIndex: any;
  nftsCopy: any;
};

export default function NftModal({
  getShowMenu,
  nftIndex,
  nftsCopy,
}: NftModalProps) {
  const [open, setOpen] = useState(true);
  const [image, setImage] = useState(nftsCopy[nftIndex].image);
  const [isClosing, setIsClosing] = useState(false);
  const [currentNftIndex, setCurrentNftIndex] = useState(nftIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<string>("Initial");

  const { isConnected } = useAccount();
  const { data: ensName } = useEnsName({
    address: nftsCopy[currentNftIndex].owner,
  });

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
            } rounded-lg bg-white px-4 pb-4 py-10 text-left sm:p-10 overflow-auto absolute`}
          >
            <h1 className="text-3xl modalAnimatedText pb-1 navbarTitle">
              Nft Information
            </h1>
            <hr className="modalAnimatedLine" />
            <ul className="mt-6">
              <li className="text-lg">{`${nftsCopy[currentNftIndex].name}`}</li>
              <li className="text-lg text-xs">
                Created by{" "}
                <span className="text-main text-lg">{`${nftsCopy[currentNftIndex].symbol}`}</span>
              </li>
              <li className="text-lg mb-3 text-xs">
                Owner{" "}
                <span className="text-main text-lg">
                  {ensName
                    ? ensName
                    : `${formatAddress(nftsCopy[currentNftIndex].owner)}`}
                </span>
              </li>
              <li className="mb-2  flex">
                <span className="bg-main rounded-full px-6">ERC 721</span>
                <span className="bg-main rounded-full px-6 ml-8">Listed</span>
              </li>
            </ul>

            {!isConnected && (
              <div className="w-min mx-auto">
                <WalletButton />
              </div>
            )}
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
                  className={`h-[600px] w-[600px] z-10 ${
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
