// React
import React, { useEffect, useState } from "react";
// Next
import Image from "next/image";
// Hooks
import { useFetchUriInfo } from "@/hooks/useFetchUriInfo";
// Components
import NftModal from "../Modals/NftModal";
import Loader from "../Loader/Loader";
// Utils
import { transformUrl } from "../../../utils/utils";
// Images
import GHO from "../../../public/GHO.svg";
// Wagmi
import { erc20ABI, sepolia, useContractRead } from "wagmi";
// Constants
import { tokens } from "../../../constants/constants";

type NftCardProps = {
  nftInfo: any;
  index: number;
  nftsCopy: any;
  isLoan: boolean;
  isPortfolio: boolean;
};

interface MiObjeto {
  name: string;
  description: string;
  image: string;
}

export default function NftCard({
  nftInfo,
  index,
  nftsCopy,
  isLoan,
  isPortfolio,
}: NftCardProps) {
  const { info, loading } = useFetchUriInfo(
    nftInfo.uri ? `${nftInfo.uri}` : `${nftInfo.nft.uri}`
  );
  const [openModal, setOpenModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [requestToken, setRequestToken] = useState<any>();

  const { data: decimalsTokenRequest } = useContractRead({
    address: nftInfo.tokenRequest as `0x${string}`,
    abi: erc20ABI,
    functionName: "decimals",
    chainId: sepolia.id,
  });

  const getShowMenu = (state: boolean) => {
    setOpenModal(state);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleUnhover = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const requestToken = tokens.filter(
      (token) => nftInfo.tokenRequest === token.contract.toLowerCase()
    );

    setRequestToken(requestToken[0]);
  }, []);

  return (
    <button
      className="shadow2 flex items-center rounded-xl border-2 border-main hover:border-gray-100 xl:max-h-[500px] max-h-[450px] navbarTextOpacity"
      onClick={() => {
        setOpenModal(true);
        handleUnhover();
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      disabled={loading}
    >
      {loading ? (
        <div className="flex items-center justify-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center rounded-xl pt-10">
          <Image
            src={transformUrl(info.image)}
            alt={`${info.name} image`}
            width={150}
            height={150}
            id="nftCardImage"
            className={`min-h-[150px] mb-8 rounded-xl ${
              isHovered ? "float" : ""
            }`}
          />
          <div className="mainBackground w-full rounded-b-xl text-white border-t-1 border-t-main relative flex flex-col items-start align-center justify-center h-full py-4">
            <div className="w-6 h-6 absolute rotate-45 bg-main -top-3 right-[47.5%]"></div>
            <h1 className="pt-2 text-sm text-main font-medium px-4">
              {isPortfolio ? nftInfo.collection : nftInfo.nft.collection.name}
            </h1>
            <h1 className="py-3 text-xl font-semibold px-4">{info.name}</h1>
            {decimalsTokenRequest !== undefined && (
              <ul
                className={`grid ${
                  isLoan ? "grid-cols-2" : "grid-rows-2"
                } w-full px-4 gap-[12px] pb-2`}
              >
                <>
                  <li className="text-lg flex items-center">
                    Supply
                    <span className="text-main text-lg mx-2">
                      {nftInfo.amountRequest / 10 ** decimalsTokenRequest}
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
                  </li>
                  <li className="text-lg flex items-center mt-2">
                    Rewards
                    <span className="text-main text-lg mx-2">{`${
                      nftInfo.rewards / 10 ** 18
                    }`}</span>{" "}
                    <Image
                      src={GHO.src}
                      alt={`Token image`}
                      width={24}
                      height={24}
                      className="rounded-lg h-[24px] min-w-[24px]"
                    />{" "}
                  </li>
                </>
              </ul>
            )}
          </div>
        </div>
      )}

      {openModal && (
        <NftModal
          getShowMenu={getShowMenu}
          nftIndex={index}
          nftsCopy={nftsCopy}
          isLoan={isLoan}
          isPortfolio={isPortfolio}
        />
      )}
    </button>
  );
}
