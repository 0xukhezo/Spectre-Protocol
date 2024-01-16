import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

import WalletButton from "../Buttons/WalletButton";
import SlotCard from "../Cards/SlotCard";
import InfoSteps from "../Steps/InfoSteps";
import { getLoanInfoSteps } from "../../../constants/constants";

export default function GetLoanSection() {
  const [connected, setConnected] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

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
              <button className="bg-main text-black font-light px-4 py-2 rounded-xl max-h-[44px] hover:bg-secondary">
                + Create a Slot
              </button>
            </div>
            <div className="mt-10">
              <h1 className="text-3xl navbarTitle pb-2">Slots created</h1>{" "}
              <hr className="modalAnimatedLine" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto p-10">
              <SlotCard />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
