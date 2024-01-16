import React, { useEffect, useState } from "react";

import { useAccount } from "wagmi";

import WalletButton from "../Buttons/WalletButton";
import { nfts } from "../../../constants/constants";
import NftCard from "../Cards/NftCard";
import Image from "next/image";
import SadSpectre from "../../../public/SadSpectre.svg";

export default function ProfileLoans() {
  const [connected, setConnected] = useState(false);
  const [nftsCopy, setNftsCopy] = useState<any[]>([...nfts]);

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
            <div>
              <h1 className="text-3xl navbarTitle pb-2">Active Loans</h1>{" "}
              <hr className="modalAnimatedLine" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto p-10">
                {nftsCopy.length > 0 ? (
                  <>
                    {nftsCopy.map((nft: any, index: number) => (
                      <NftCard
                        nftInfo={nft}
                        index={index}
                        nftsCopy={nftsCopy}
                        key={index}
                        isPortfolio={false}
                        isLoan={true}
                      />
                    ))}
                  </>
                ) : (
                  <div className="col-span-full text-5xl navbarTitle max-w-[600px] text-center mx-auto pt-40 flex items-center flex-col font-extralight">
                    <h1>Looks like NFTs are playing ghost.</h1>
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
            </div>
            <div className="mt-10">
              <h1 className="text-3xl navbarTitle pb-2">Active Supplies</h1>{" "}
              <hr className="modalAnimatedLine" />{" "}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto p-10">
                {nftsCopy.length > 0 ? (
                  <>
                    {nftsCopy.map((nft: any, index: number) => (
                      <NftCard
                        nftInfo={nft}
                        index={index}
                        nftsCopy={nftsCopy}
                        key={index}
                        isPortfolio={false}
                        isLoan={true}
                      />
                    ))}
                  </>
                ) : (
                  <div className="col-span-full text-5xl navbarTitle max-w-[600px] text-center mx-auto pt-40 flex items-center flex-col font-extralight">
                    <h1>Looks like NFTs are playing ghost.</h1>
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
