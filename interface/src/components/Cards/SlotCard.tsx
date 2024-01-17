import Image from "next/image";
import React, { useState } from "react";
import Specter from "../../../public/Specter.svg";
import Link from "next/link";
import SadSpectre from "../../../public/SadSpectre.svg";

type SlotCardProps = {
  slot: any;
};

export default function SlotCard({ slot }: SlotCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleUnhover = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`${
        slot.loan.activeLoan ? "" : "shadow2"
      } flex items-center rounded-xl border-2 border-main hover:border-gray-100 xl:min-h-[300px] min-h-[350px]`}
      onClick={() => {
        handleUnhover();
      }}
      disabled={slot.loan.activeLoan ? true : false}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
    >
      {slot.loan ? (
        <div className="w-full h-full flex flex-col items-center rounded-xl pt-10">
          <Image
            src={slot.loan.nft.image}
            alt={`${slot.loan.nft.name} image`}
            width={150}
            height={150}
            className={`min-h-[150px] mb-5 rounded-xl ${
              isHovered ? "float" : ""
            }`}
          />
          <div className="mainBackground w-full h-full rounded-b-xl text-white border-t-1 border-t-main relative flex flex-col items-center align-center justify-center">
            <div className="w-6 h-6 absolute rotate-45 bg-main -top-3 right-[46%]"></div>
            <h1 className="pb-2 pt-8 text-sm text-main font-medium px-4">
              {slot.loan.nft.collection.name}
            </h1>
            <h1 className="pb-12 text-xl font-semibold px-4">
              {slot.loan.nft.name}
            </h1>
          </div>{" "}
        </div>
      ) : (
        <Link
          className="w-full h-full flex flex-col justify-center items-center rounded-xl text-3xl"
          href={`/slot/${slot.id}`}
        >
          <h1>Nft missing...</h1>{" "}
          <Image
            src={SadSpectre.src}
            alt="SadSpectre Image"
            width={200}
            height={200}
            className="min-h-[150px] mb-5 "
          />
        </Link>
      )}
    </button>
  );
}
