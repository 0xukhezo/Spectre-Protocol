import Image from "next/image";
import React, { useState } from "react";
import NftModal from "../Modals/NftModal";

type NftCardProps = {
  nftInfo: any;
  index: number;
  nftsCopy: any;
};

export default function NftCard({ nftInfo, index, nftsCopy }: NftCardProps) {
  const [openModal, setOpenModal] = useState(false);

  const getShowMenu = (state: boolean) => {
    setOpenModal(state);
  };

  return (
    <button
      className="shadow2 flex items-center rounded-xl border-2 border-main hover:border-gray-100 max-h-[350px]"
      onClick={() => setOpenModal(true)}
    >
      <div className="w-full h-full flex flex-col items-center rounded-xl pt-10">
        <Image
          src={nftInfo.image}
          alt={`${nftInfo.name} image`}
          width={150}
          height={150}
          className="min-h-[150px] mb-5 float"
        />
        <div className="mainBackground w-full h-full rounded-b-xl text-white">
          <h1 className="pb-2 pt-8 text-sm text-main font-medium">
            {nftInfo.symbol}
          </h1>
          <h1 className="pb-12 text-xl font-semibold">{nftInfo.name}</h1>
        </div>
      </div>
      {openModal && (
        <NftModal
          getShowMenu={getShowMenu}
          nftIndex={index}
          nftsCopy={nftsCopy}
        />
      )}
    </button>
  );
}
