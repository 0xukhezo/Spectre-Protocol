import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

import WalletButton from "../Buttons/WalletButton";
import SlotCard from "../Cards/SlotCard";

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
            <div className="mainBackground p-6 rounded-xl flex justify-between text-lg">
              <div>
                <span>
                  You need to create a slot in order to can have a loan in one
                  of your NFTs.
                </span>
                <div className="ml-4 my-4">
                  <ul>1. Create a slot.</ul>
                  <ul className="my-1">2. Fill the loan form.</ul>
                  <ul>3. Approve NFT.</ul>
                  <ul className="mt-1">4. Create a Loan</ul>{" "}
                </div>{" "}
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
