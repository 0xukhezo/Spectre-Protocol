import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

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

export default function GetLoanSection() {
  const [connected, setConnected] = useState(false);
  const { isConnected, address } = useAccount();

  const slots = useFetchSlotsUser(
    `(where: {user_: {id: "${address?.toLowerCase()}"}})`
  );

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  const getTxStatus = (status: string, name: string) => {
    console.log(status, name);
  };

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
              <TxButton
                address={UserSlotFactoryAddress as `0x${string}`}
                abi={abiUserSlotFactory}
                functionName="createSlot"
                args={[]}
                getTxStatus={getTxStatus}
                children={<span> + Create Slot</span>}
                className="bg-main text-black font-light px-4 py-2 rounded-xl max-h-[44px] hover:bg-secondary"
                id="createSlotFuction"
              />
            </div>
            <div className="mt-10">
              <h1 className="text-3xl navbarTitle pb-2">Slots created</h1>{" "}
              <hr className="modalAnimatedLine" />
            </div>
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
                    getTxStatus={getTxStatus}
                    children={<span> + Create Slot</span>}
                    className="bg-main text-black font-light px-10 py-3 rounded-xl hover:bg-secondary text-base"
                    id="createSlotFuction"
                  />
                </div>
              )}
            </div>{" "}
          </div>
        )}
      </div>
    </main>
  );
}
