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
import { erc20ABI, useContractRead } from "wagmi";

type RepayModalProps = {
  getShowMenu: (open: boolean) => void;
  loan: any;
  healthFactor: string;
};

export default function RepayModal({
  getShowMenu,
  loan,
  healthFactor,
}: RepayModalProps) {
  const [open, setOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [amountRepay, setAmountRepay] = useState<number | undefined>(undefined);

  const [status, setStatus] = useState<string[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [notificationImage, setNotificationImage] = useState<
    string | ReactElement | null
  >(null);
  const [txDescription, setTxDescription] = useState<string | null>(null);

  const { data: debtGho } = useContractRead({
    address: "0x67ae46EF043F7A4508BD1d6B94DB6c33F0915844",
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [loan.slot.id],
  });

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
    if (status[0] === "success" && status[1] === "approvetOKEN") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setNotificationImage(null);
      }, 2000);
    }
    if (status[0] === "success" && status[1] === "repay") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setNotificationImage(null);
      }, 2000);
      setTimeout(() => {
        closeModal();
      }, 500);
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
                      Repay GHO
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
                        value={amountRepay}
                        min={0}
                        max={Number(debtGho) / 10 ** 18 + 0.001}
                        step={1 / 10 ** 18}
                        onChange={(e) => {
                          if (Number(e.target.value) >= 0) {
                            if (
                              Number(e.target.value) >
                              Number(debtGho) / 10 ** 18
                            ) {
                              setAmountRepay(Number(debtGho) / 10 ** 18);
                            } else {
                              setAmountRepay(Number(e.target.value));
                            }
                          } else {
                            setAmountRepay(0);
                          }
                        }}
                        placeholder="0"
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        className="mainBackground pr-8 py-1 text-black font-light h-[46px] ring-0 focus:ring-0 outline-0 w-full text-white placeholder:text-white"
                      />{" "}
                      <span className="flex text-xs text-gray-400">
                        {amountRepay !== undefined
                          ? (amountRepay * 0.98).toFixed(2)
                          : 0}{" "}
                        $
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center align-center">
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

                      <button
                        onClick={() =>
                          setAmountRepay(Number(debtGho) / 10 ** 18 + 0.001)
                        }
                        className="text-main text-sm ml-20 hover:text-secondary"
                      >
                        Max
                      </button>
                    </div>
                  </div>{" "}
                  <span className="text-start flex mt-4 mb-2">
                    Transaction overview
                  </span>
                  <div className="rounded-xl text-black border-main border-1 font-light h-fit flex items-center mb-4 p-4 w-full flex justify-between text-white grid grid-cols-2">
                    <div className="w-full text-start text-lg mb-4">
                      Remaining debt
                    </div>{" "}
                    <div className="w-full text-end flex flex-col text-lg mb-4">
                      {amountRepay === undefined || amountRepay === 0 ? (
                        <div className="flex items-center text-end justify-end">
                          <span className="">
                            {(Number(debtGho) / 10 ** 18).toFixed(2)} GHO
                          </span>
                          <ArrowLongRightIcon className="h-6 w-6 mx-1 mt-1" />{" "}
                          <span>
                            {(Number(debtGho) / 10 ** 18).toFixed(2)} GHO
                          </span>
                        </div>
                      ) : (
                        <div className=" flex items-center text-end justify-end">
                          <span>
                            {(Number(debtGho) / 10 ** 18).toFixed(2)} GHO
                          </span>
                          <ArrowLongRightIcon className="h-6 w-6 mx-1 mt-1" />{" "}
                          <span>
                            {(Number(debtGho) / 10 ** 18 - amountRepay).toFixed(
                              2
                            )}{" "}
                            GHO
                          </span>
                        </div>
                      )}
                      <span className="text-xs">Liquidation at {"<"}1.0</span>
                    </div>
                    <div className="w-full text-start text-lg">
                      Health Factor
                    </div>{" "}
                    <div className="w-full text-end flex flex-col text-2xl">
                      {amountRepay === undefined || amountRepay === 0 ? (
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
                    <div className="">
                      {(status.length === 0 ||
                        (status[0] === "loading" &&
                          status[1] === "approveToken")) &&
                      amountRepay ? (
                        <TxButton
                          address={ghoToken.contract as `0x${string}`}
                          abi={erc20ABI}
                          functionName="approve"
                          args={[
                            AAVEPoolAddress,
                            amountRepay * 10 ** 18 + 0.001,
                          ]}
                          getTxStatus={getStatus}
                          children={<span>Approve GHO</span>}
                          className={`bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex items-center justify-center mx-auto min-w-[200px] items-center`}
                          id="approveToken"
                        />
                      ) : (
                        <button
                          className={`flex flex-col rounded-xl border-main border-1 px-[34px] py-2 mx-auto opacity-50 min-w-[200px] items-center mt-4 ${
                            ((status[1] === "approveToken" &&
                              status[0] !== "loading") ||
                              (status[1] === "repay" &&
                                status[0] === "loading")) &&
                            "hidden"
                          }`}
                          disabled
                        >
                          Approve GHO
                        </button>
                      )}
                      {((status[1] === "approveToken" &&
                        status[0] !== "loading") ||
                        (status[1] === "repay" && status[0] === "loading")) &&
                      amountRepay ? (
                        <TxButton
                          address={AAVEPoolAddress as `0x${string}`}
                          abi={abiAAVEPool}
                          functionName="repay"
                          args={[
                            ghoToken.contract,
                            amountRepay * 10 ** 18 + 0.001,
                            2,
                            loan.slot.id,
                          ]}
                          getTxStatus={getStatus}
                          children={<span>Repay GHO</span>}
                          className="bg-main text-black font-light px-[34px] py-2 rounded-xl hover:bg-secondary flex mx-auto min-w-[200px] items-center mx-auto text-center flex items-center justify-center mt-4"
                          id="repay"
                        />
                      ) : (
                        <button
                          className="flex flex-col rounded-xl border-main border-1 px-[34px] py-2 mx-auto opacity-50 min-w-[200px] items-center mt-4"
                          disabled
                        >
                          Repay GHO
                        </button>
                      )}
                    </div>
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
