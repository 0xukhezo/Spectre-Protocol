// React
import React, { useEffect, useState } from "react";
// Next
import Image from "next/image";
// Utils
import {
  calculateTimeComponents,
  formatAddress,
  formatDate,
  transformUrl,
} from "../../../utils/utils";
// Hooks
import { useFetchUriInfo } from "@/hooks/useFetchUriInfo";
// Wagmi
import { erc20ABI, useContractRead, sepolia } from "wagmi";
// Images
import ETH from "../../../public/ETH.svg";
import GHO from "../../../public/GHO.svg";
// Constants
import { tokens } from "../../../constants/constants";
// Viem
import { zeroAddress } from "viem";

type HistoryCardProps = {
  history: any;
};

export default function HistoryCard({ history }: HistoryCardProps) {
  const [requestToken, setRequestToken] = useState<any>();

  const { info, loading } = useFetchUriInfo(
    history.uri ? `${history.uri}` : `${history.nft.uri}`
  );

  const { data: decimalsTokenRequest } = useContractRead({
    address: history.tokenRequest as `0x${string}`,
    abi: erc20ABI,
    functionName: "decimals",
    chainId: sepolia.id,
  });

  useEffect(() => {
    const requestToken = tokens.filter(
      (token) => history.tokenRequest === token.contract.toLowerCase()
    );

    setRequestToken(requestToken[0]);
  }, []);

  return (
    <main className="grid grid-cols-10 py-6 px-10 border-1 border-main rounded-xl my-4 text-lg flex items-center text-center">
      {loading ? (
        <></>
      ) : (
        info && (
          <Image
            src={transformUrl(info.image)}
            alt={`${info.name} image`}
            width={50}
            height={50}
            id="nftCardImage"
            className="rounded-lg h-[50px] min-w-[50px]"
          />
        )
      )}
      {history.activeLoan ? (
        <span className="text-secondary font-semibold">Active</span>
      ) : (
        <span className="text-red-400 font-semibold">Closed</span>
      )}
      {decimalsTokenRequest !== undefined && (
        <>
          <span className="text-lg flex items-center">
            <span className="text-main text-lg mx-2">
              {history.amountRequest / 10 ** decimalsTokenRequest}
            </span>{" "}
            {requestToken && (
              <Image
                src={requestToken.image}
                alt={`Token image`}
                width={24}
                height={24}
                className="rounded-lg h-[24px] min-w-[24px]"
              />
            )}
          </span>
          <span className="text-lg flex items-center col-span-2">
            <span className="text-main text-lg mx-2">{`${
              history.rewards / 10 ** 18
            }`}</span>{" "}
            <Image
              src={GHO.src}
              alt={`Token image`}
              width={24}
              height={24}
              className="rounded-lg h-[24px] min-w-[24px]"
            />{" "}
            <span className="text-main text-lg mx-2"> + 0.01 % APY</span>{" "}
            <Image
              src={ETH.src}
              alt={`Token image`}
              width={24}
              height={24}
              className="rounded-lg h-[24px] min-w-[24px]"
            />
          </span>
        </>
      )}
      <span className="text-lg text-xs flex items-center col-span-2">
        <span className="text-main text-lg text-center">{`${calculateTimeComponents(
          Number(history.loanDuration)
        )}`}</span>{" "}
      </span>
      <span className="text-main text-lg col-span-2 text-center">{`${formatDate(
        Number(history.deadline * 1000)
      )}`}</span>

      {history.supplier === zeroAddress ? (
        <span className="text-lg flex items-center">Not supply yet</span>
      ) : (
        <span className="text-lg ] flex items-center">
          {formatAddress(history.supplier)}
        </span>
      )}
    </main>
  );
}
