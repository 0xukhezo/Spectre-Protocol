import React from "react";
import Image from "next/image";

type DisplayerCardProps = {
  asset: any;
  selectAsset: (asset: any) => void;
  closeModal: () => void;
  roundedImage: string;
};

export default function DisplayerCard({
  asset,
  selectAsset,
  closeModal,
  roundedImage,
}: DisplayerCardProps) {
  return (
    <button
      className="flex justify-between my-2 text-start items-center hover:bg-black rounded-xl px-4 py-2"
      onClick={() => {
        selectAsset(asset);
        closeModal();
      }}
    >
      <span>{asset.name}</span>{" "}
      <Image
        src={asset.image}
        alt={`${asset.name} image`}
        width={50}
        height={50}
        id="nftCardImage"
        className={`${roundedImage} h-[50px] min-w-[50px]`}
      />
    </button>
  );
}
