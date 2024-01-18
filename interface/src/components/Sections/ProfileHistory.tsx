import { useFetchHistoryUser } from "@/hooks/useFetchHistoryUser";
import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";
import Loader from "../Loader/Loader";
import HistoryCard from "../Cards/HistoryCard";
import WalletButton from "../Buttons/WalletButton";
import Image from "next/image";
import SadSpectre from "../../../public/SadSpectre.svg";

export default function ProfileHistory() {
  const { isConnected, address } = useAccount();
  const { history, loading } = useFetchHistoryUser(
    `(id: "${address?.toLowerCase()}")`
  );

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  return (
    <main className="navbarTextOpacity h-[900px]">
      <div className="mx-4">
        {!connected ? (
          <div className="h-[700px] flex justify-center items-center flex-col">
            <h1 className="font-extralight mb-10 text-5xl text-center">
              You need to be connected to see <br />
              your history
            </h1>
            <WalletButton />
          </div>
        ) : (
          <div className="mx-4 py-10">
            <div>
              <h1 className="text-3xl navbarTitle pb-2">History</h1>{" "}
              <hr className="modalAnimatedLine mb-12" />
              {loading ? (
                <div className="flex items-center justify-center h-[700px]">
                  <Loader />
                </div>
              ) : (
                <div>
                  {history.length !== 0 ? (
                    <div>
                      <div className="grid grid-cols-10 py-6 px-10 border-1 border-main rounded-xl my-4 text-lg flex items-center text-center">
                        <span></span> <span>Status</span>{" "}
                        <span className="mr-16">Supply</span>{" "}
                        <span className="col-span-2 text-start ml-16">
                          Rewards
                        </span>{" "}
                        <span className="col-span-2 text-start ml-16">
                          Duration
                        </span>{" "}
                        <span className="col-span-2 text-start ml-24">
                          Deadline
                        </span>{" "}
                        <span>Supplier</span>
                      </div>
                      {history.map((historyPoint: any, index: number) => (
                        <HistoryCard history={historyPoint} key={index} />
                      ))}{" "}
                    </div>
                  ) : (
                    <div className="col-span-full text-5xl navbarTitle max-w-[600px] text-center mx-auto pt-40 flex items-center flex-col font-extralight">
                      <h1>Create a loan and start your adventure!</h1>
                      <Image
                        src={SadSpectre.src}
                        alt="SadSpectre Image"
                        width={200}
                        height={200}
                        className="min-h-[150px] mb-5 "
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
