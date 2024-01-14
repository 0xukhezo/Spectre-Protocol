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
  const [isHovered, setIsHovered] = useState(false);

  const getShowMenu = (state: boolean) => {
    setOpenModal(state);
  };

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleUnhover = () => {
    setIsHovered(false);
  };

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
      <div className="w-full h-full flex flex-col items-center rounded-xl pt-10">
        <Image
          src={nftInfo.image}
          alt={`${nftInfo.name} image`}
          width={150}
          height={150}
          id="nftCardImage"
          className={`min-h-[150px] mb-5 rounded-xl ${
            isHovered ? "float" : ""
          }`}
        />
        <div className="mainBackground w-full h-full rounded-b-xl text-white border-t-1 border-t-main relative flex flex-col items-center align-center justify-center">
          <div className="w-6 h-6 absolute rotate-45 bg-main -top-3 right-[46%]"></div>
          <h1 className="pb-2 pt-8 text-sm text-main font-medium px-4">
            {nftInfo.collection}
          </h1>
          <h1 className="pb-12 text-xl font-semibold px-4">{nftInfo.name}</h1>
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
