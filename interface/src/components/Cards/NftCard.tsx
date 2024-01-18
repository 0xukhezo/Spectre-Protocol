import Image from "next/image";
import React, { useEffect, useState } from "react";
import NftModal from "../Modals/NftModal";
import { useFetchUriInfo } from "@/hooks/useFetchUriInfo";
import Loader from "../Loader/Loader";
import { transformUrl } from "../../../utils/utils";
import GHO from "../../../public/GHO.svg";
import { erc20ABI, useContractRead } from "wagmi";
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
  console.log(nftInfo);
  return (
    <button
      className="shadow2 flex items-center rounded-xl border-2 border-main hover:border-gray-100 xl:max-h-[400px] max-h-[450px]"
      onClick={() => {
        setOpenModal(true);
        handleUnhover();
      }}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
    >
      {loading ? (
        <Loader />
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
            <div className="w-6 h-6 absolute rotate-45 bg-main -top-3 right-[47%]"></div>
            <h1 className="pb-2 pt-2 text-sm text-main font-medium px-4">
              {isPortfolio ? nftInfo.collection : nftInfo.nft.collection.name}
            </h1>
            <h1 className="pb-4 text-xl font-semibold px-4">{info.name}</h1>
            {decimalsTokenRequest !== undefined && (
              <ul className="grid grid-cols-2 w-full px-4 mt-4">
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
                  <li className="text-lg flex items-center">
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
                    />
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
