import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  ArrowLongRightIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import SearchBar from "../Filters/SearchBar";
import DisplayerCard from "../Cards/DisplayerCard";
import Image from "next/image";
import SadSpectre from "../../../public/SadSpectre.svg";
import GHO from "../../../public/GHO.svg";
import { abiAAVEPool } from "../../../abis/abis.json";
import { AAVEPoolAddress } from "../../../abis/contractAddress.json";
import TxButton from "../Buttons/TxButton";
import Error from "../../../public/Error.svg";
import Success from "../../../public/Success.svg";
import Loader from "../Loader/Loader";
import NotificationsCard from "../Cards/NotificationsCard";
import { ghoToken } from "../../../constants/constants";

type BorrowModalProps = {
  getShowMenu: (open: boolean) => void;
  loan: any;
  healthFactor: string;
};

export default function BorrowModal({
  getShowMenu,
  loan,
  healthFactor,
}: BorrowModalProps) {
  const [open, setOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [amountBorrow, setAmountBorrow] = useState<number | undefined>(
    undefined
  );
  const [status, setStatus] = useState<string[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [notificationImage, setNotificationImage] = useState<
    string | ReactElement | null
  >(null);
  const [txDescription, setTxDescription] = useState<string | null>(null);

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

    if (status[0] === "success" && status[1] === "borrow") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setNotificationImage(null);
      }, 2000);
      setTimeout(() => {
        closeModal();
      }, 2000);
    }
  }, [status]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative" onClose={closeModal}>
        <div
          className={`loanOverlay ${open ? "open" : ""}`}
          onClick={() => closeModal()}
        >
          <Dialog.Panel
            className={`loanModal ${
              isClosing ? "closing" : ""
            } rounded-lg mainBackground text-white px-4 pb-4 pt-5 text-start shadow-xl sm:my-8 w-1/3 sm:p-6 overflow-auto h-[700px]`}
          >
            <div className="absolute right-0 top-0 pr-4 pt-4 block">
              <button
                type="button"
                className="rounded-md text-main"
                onClick={() => closeModal()}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="text-center mt-[12px]">
              {" "}
              <div className="sm:flex flex-col sm:items-start mt-6">
                <div className="w-full">
                  <div className=" text-start sm:mt-0 sm:text-left w-full">
                    <h1 className="text-3xl modalAnimatedText pb-1 navbarTitle">
                      Borrow GHO
                    </h1>
                    <hr className="modalAnimatedLine" />
                  </div>
                </div>
                <div className="px-10 w-full">
                  <span className="text-start flex mt-4 mb-2">Amount</span>
                  <div className="rounded-xl text-black border-main border-1 font-light h-[54px] flex items-center mb-8 px-4 py-10 w-full">
                    <div className="w-full">
                      <input
                        type="number"
                        value={amountBorrow}
                        min={0}
                        step={1 / 10 ** 18}
                        onChange={(e) => {
                          if (Number(e.target.value) >= 0) {
                            setAmountBorrow(Number(e.target.value));
                          } else {
                            setAmountBorrow(0);
                          }
                        }}
                        placeholder="0"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="mainBackground pr-8 py-1 text-black font-light h-[46px] ring-0 focus:ring-0 outline-0 w-full text-white placeholder:text-white"
                      />{" "}
                      <span className="flex text-xs text-gray-400">
                        {amountBorrow !== undefined
                          ? (amountBorrow * 0.98).toFixed(2)
                          : 0}{" "}
                        $
                      </span>
                    </div>

                    <div className="flex items-center">
                      <Image
                        src={GHO.src}
                        alt={`GHO image`}
                        width={40}
                        height={40}
                        className="rounded-lg h-[40px] min-w-[40px] ml-[24px] ml-3"
                      />
                      <span className="ml-2 text-white text-xl">GHO</span>
                    </div>
                  </div>{" "}
                  <span className="text-start flex mt-4 mb-2">
                    Transaction overview
                  </span>
                  <div className="rounded-xl text-black border-main border-1 font-light h-[54px] flex items-center mb-4 px-4 py-10 w-full flex justify-between text-white">
                    <div className="w-full text-start">Health Factor</div>{" "}
                    <div className="w-full text-end flex flex-col text-2xl">
                      {amountBorrow === undefined || amountBorrow === 0 ? (
                        <div
                          className={
                            Number(healthFactor) < 1.2
                              ? "text-red-300"
                              : Number(healthFactor) < 3
                              ? "text-yellow-300"
                              : "text-green-500"
                          }
                        >
                          {healthFactor}
                        </div>
                      ) : (
                        <div className="text-2xl flex items-center text-end justify-end">
                          <span
                            className={
                              Number(healthFactor) < 1.2
                                ? "text-red-300"
                                : Number(healthFactor) < 3
                                ? "text-yellow-300"
                                : "text-green-500"
                            }
                          >
                            {healthFactor}
                          </span>
                          <ArrowLongRightIcon className="h-6 w-6 mx-1 mt-1" />{" "}
                          <span
                            className={
                              Number(healthFactor) < 1.2
                                ? "text-red-300"
                                : Number(healthFactor) < 3
                                ? "text-yellow-300"
                                : "text-green-500"
                            }
                          >
                            {healthFactor}
                          </span>
                        </div>
                      )}
                      <span className="text-xs">Liquidation at {"<"}1.0</span>
                    </div>
                  </div>{" "}
                  <div className="rounded-xl text-black border-main border-1 font-light h-[54px] flex items-center mb-4 px-4 py-10 w-full bg-main">
                    <ExclamationCircleIcon className="h-16 w-16 ml-4" />{" "}
                    <div className="text-start ml-4 text-sm">
                      <span className="font-semibold">Attention:</span>{" "}
                      Parameter changes via governance can alter your account
                      health factor and risk of liquidation. Follow the{" "}
                      <a
                        className="font-semibold"
                        href="https://governance.aave.com/"
                        target="_black"
                      >
                        Aave governance forum
                      </a>{" "}
                      for updates.
                    </div>
                  </div>
                  <div
                    className={`${!title && "opacity-0"} ${
                      status[0] === "loading" && "bg-secondary"
                    } ${status[0] === "error" && "bg-red-400"}  ${
                      status[0] === "success" && "bg-green-200"
                    } mb-8 flex flex-col text-start px-8 rounded-lg py-2 text-black`}
                  >
                    <div>{title}</div> <div>{txDescription}</div>
                  </div>
                  <div className="justify-center flex">
                    {amountBorrow ? (
                      <TxButton
                        address={AAVEPoolAddress as `0x${string}`}
                        abi={abiAAVEPool}
                        functionName="borrow"
                        args={[
                          ghoToken.contract,
                          amountBorrow * 10 ** 18,
                          2,
                          0,
                          loan.slot.id,
                        ]}
                        getTxStatus={getStatus}
                        children={<span>Borrow GHO</span>}
                        className="bg-main text-black font-light px-10 py-2 rounded-xl hover:bg-secondary flex my-auto items-center justify-center mx-4"
                        id="borrow"
                      />
                    ) : (
                      <button
                        className="my-auto items-center justify-center border-1 border-main mx-4 flex flex-col px-10 rounded-xl mainBackground opacity-50 py-2"
                        disabled
                      >
                        Borrow GHO
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
