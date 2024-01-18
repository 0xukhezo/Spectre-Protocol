import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

import WalletButton from "../Buttons/WalletButton";
import NftCard from "../Cards/NftCard";
import Image from "next/image";
import SadSpectre from "../../../public/SadSpectre.svg";
import { useFetchLoans } from "@/hooks/useFetchLoans";
import Loader from "../Loader/Loader";

export default function ProfileLoans() {
  const { isConnected, address } = useAccount();

  const { loans, loading } = useFetchLoans(
    `(where: {activeLoan: true, user_: {id: "${address?.toLowerCase()}"}})`
  );

  const { loans: supplies, loading: loadingSupplies } = useFetchLoans(
    `(where: {activeLoan: true, supplier: "${address?.toLowerCase()}"})`
  );

  const [connected, setConnected] = useState(false);
  const [loansCopy, setLonsCopy] = useState<any[]>([...loans]);
  const [suppliesCopy, setSuppliesCopy] = useState<any[]>([...supplies]);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    setLonsCopy([...loans]);
  }, [loans]);

  useEffect(() => {
    setSuppliesCopy([...supplies]);
  }, [supplies]);

  return (
    <main className="pb-10 navbarTextOpacity">
      <div className="mx-4">
        {!connected ? (
          <div className="h-[700px] flex justify-center items-center flex-col">
            <h1 className="font-extralight mb-10 text-5xl text-center">
              You need to be connected to see <br />
              your loans or supplies
            </h1>
            <WalletButton />
          </div>
        ) : (
          <div className="mx-4 py-10">
            <div>
              <h1 className="text-3xl navbarTitle pb-2">Active Loans</h1>{" "}
              <hr className="modalAnimatedLine" />
              {loading ? (
                <div className="flex items-center justify-center w-full pt-32">
                  <Loader />{" "}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto p-10">
                  {loansCopy.length > 0 ? (
                    <>
                      {loansCopy.map((nft: any, index: number) => (
                        <NftCard
                          nftInfo={nft}
                          index={index}
                          nftsCopy={loansCopy}
                          key={index}
                          isPortfolio={false}
                          isLoan={true}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="col-span-full text-5xl navbarTitle max-w-[600px] text-center mx-auto pt-40 flex items-center flex-col font-extralight">
                      <h1>It looks like you don't have any loans yet.</h1>
                      <Image
                        src={SadSpectre.src}
                        alt="SadSpectre Image"
                        width={200}
                        height={200}
                        className="min-h-[150px] mb-5 "
                      />
                    </div>
                  )}{" "}
                </div>
              )}
            </div>
            <div className="mt-10">
              <h1 className="text-3xl navbarTitle pb-2">Active Supplies</h1>{" "}
              <hr className="modalAnimatedLine" />{" "}
              {loadingSupplies ? (
                <div className="flex items-center justify-center w-full pt-32">
                  <Loader />{" "}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto p-10">
                  {suppliesCopy.length > 0 ? (
                    <>
                      {suppliesCopy.map((nft: any, index: number) => (
                        <NftCard
                          nftInfo={nft}
                          index={index}
                          nftsCopy={suppliesCopy}
                          key={index}
                          isPortfolio={false}
                          isLoan={false}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="col-span-full text-5xl navbarTitle max-w-[600px] text-center mx-auto pt-40 flex items-center flex-col font-extralight">
                      <h1>
                        It appears that you have not yet provided any loans.
                      </h1>
                      <Image
                        src={SadSpectre.src}
                        alt="SadSpectre Image"
                        width={200}
                        height={200}
                        className="min-h-[150px] mb-5 "
                      />
                    </div>
                  )}{" "}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
