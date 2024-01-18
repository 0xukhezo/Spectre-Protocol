import React, { ReactElement, useEffect, useState } from "react";

import { useAccount, useChainId } from "wagmi";

import WalletButton from "../Buttons/WalletButton";
import SlotCard from "../Cards/SlotCard";
import InfoSteps from "../Steps/InfoSteps";
import { getLoanInfoSteps } from "../../../constants/constants";
import TxButton from "../Buttons/TxButton";
import Error from "../../../public/Error.svg";
import Success from "../../../public/Success.svg";
import { abiUserSlotFactory } from "../../../abis/abis.json";
import { UserSlotFactoryAddress } from "../../../abis/contractAddress.json";
import { useFetchSlotsUser } from "@/hooks/useFetchSlotsUser";
import NotificationsCard from "../Cards/NotificationsCard";
import Image from "next/image";
import SadSpectre from "../../../public/SadSpectre.svg";
import Loader from "../Loader/Loader";
import router from "next/router";
import { arbitrumSepolia, sepolia } from "viem/chains";
import { useSwitchNetwork } from "wagmi";

export default function GetLoanSection() {
  const [connected, setConnected] = useState(false);
  const { isConnected, address } = useAccount();
  const chain = useChainId();
  const { switchNetwork } = useSwitchNetwork();

  const [status, setStatus] = useState<string[]>([]);
  const [title, setTitle] = useState<string | null>(null);
  const [image, setImage] = useState<string | ReactElement | null>(null);
  const [txDescription, setTxDescription] = useState<string | null>(null);

  const { slots, loading } = useFetchSlotsUser(
    `(where: {user_: {id: "${address?.toLowerCase()}"}})`
  );

  const getStatus = (status: string, statusFuction: string) => {
    setStatus([status, statusFuction]);
  };

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (status[0] === "loading") {
      setTitle("Processing");
      setTxDescription("The transaction is being processed.");
      setImage(Loader);
    } else if (status[0] === "error") {
      setTitle("Error");
      setTxDescription("Failed transaction.");
      setImage(Error.src);
    } else if (status[0] === "success") {
      setTitle("Success");
      setTxDescription(
        "The transaction was executed correctly. Reload the page."
      );
      setImage(Success.src);
    }

    if (status[0] === "success" && status[1] === "createSlotFuction") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setImage(null);
      }, 2000);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [status]);

  return (
    <main className="pb-10 navbarTextOpacity">
      <div className="mx-4">
        {!connected ? (
          <div className="h-[700px] flex justify-center items-center flex-col">
            <h1 className="font-extralight mb-10 text-3xl">
              You need to be connected to get a loan
            </h1>
            <WalletButton />
          </div>
        ) : (
          <div className="mx-4 py-10">
            <div className="mainBackground p-6 rounded-xl flex justify-between text-lg w-full">
              <div className="w-8/12 xl:w-10/12">
                <span className="text-2xl navbarTitle">
                  You need to create a slot in order to can have a loan in one
                  of your NFTs.
                </span>
                <InfoSteps steps={getLoanInfoSteps} />
              </div>{" "}
              {chain === arbitrumSepolia.id ? (
                <button
                  className="bg-main text-black font-light px-4 py-2 rounded-xl max-h-[44px] hover:bg-secondary"
                  onClick={() => switchNetwork?.(sepolia.id)}
                >
                  Switch to Sepolia
                </button>
              ) : (
                <TxButton
                  address={UserSlotFactoryAddress as `0x${string}`}
                  abi={abiUserSlotFactory}
                  functionName="createSlot"
                  args={[]}
                  getTxStatus={getStatus}
                  className="bg-main text-black font-light px-4 py-2 rounded-xl max-h-[44px] hover:bg-secondary"
                  id="createSlotFuction"
                >
                  <span> + Create Slot</span>
                </TxButton>
              )}
            </div>
            <div className="mt-10">
              <h1 className="text-3xl navbarTitle pb-2">Slots created</h1>{" "}
              <hr className="modalAnimatedLine" />
            </div>
            {loading ? (
              <div className="flex h-[400px] justify-center items-center">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto p-10">
                {slots.length !== 0 ? (
                  <>
                    {slots.map((slot: any, index: number) => (
                      <SlotCard slot={slot} key={index} />
                    ))}
                  </>
                ) : (
                  <div className="col-span-full text-5xl navbarTitle max-w-[600px] text-center mx-auto pt-40 flex items-center flex-col font-extralight">
                    <h1>Looks like you haven't got slots created.</h1>
                    <span className="my-5">Create one!</span>
                    <TxButton
                      address={UserSlotFactoryAddress as `0x${string}`}
                      abi={abiUserSlotFactory}
                      functionName="createSlot"
                      args={[]}
                      getTxStatus={getStatus}
                      className="bg-main text-black font-light px-10 py-3 rounded-xl hover:bg-secondary text-base"
                      id="createSlotFuction"
                    >
                      <span> + Create Slot</span>
                    </TxButton>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>{" "}
      {title && image && txDescription && (
        <NotificationsCard
          title={title}
          image={image}
          txDescription={txDescription}
        />
      )}
    </main>
  );
}
