// React
import React, { useState } from "react";
// Next
import Image from "next/image";
import Link from "next/link";
// Images
import SadSpectre from "../../../public/SadSpectre.svg";
// Hooks
import { useFetchUriInfo } from "@/hooks/useFetchUriInfo";
// Coponents
import Loader from "../Loader/Loader";
// Utils
import { transformUrl } from "../../../utils/utils";
// Wagmi
import { sepolia, useChainId } from "wagmi";

type SlotCardProps = {
  slot: any;
};

export default function SlotCard({ slot }: SlotCardProps) {
  const { info, loading } = useFetchUriInfo(
    slot.loan ? `${slot.loan.nft.uri}` : ""
  );
  const [isHovered, setIsHovered] = useState(false);
  const chain = useChainId();

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleUnhover = () => {
    setIsHovered(false);
  };

  return (
    <button
      className={`${
        (slot.loan && slot.loan.activeLoan) || slot.loan
          ? ""
          : "shadow2 hover:border-gray-100"
      } flex items-center rounded-xl border-2 border-main  xl:min-h-[300px] min-h-[350px]`}
      onClick={() => {
        handleUnhover();
      }}
      disabled={slot.loan ? true : false}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
    >
      {slot.loan && info ? (
        <div className="w-full h-full flex flex-col items-center rounded-xl pt-10">
          {loading ? (
            <Loader />
          ) : slot.loan.activeLoan ? (
            <>
              <Image
                src={transformUrl(info.image)}
                alt={`${info.name} image`}
                width={150}
                height={150}
                className={`min-h-[150px] mb-8 rounded-xl ${
                  isHovered ? "float" : ""
                }`}
              />
              <div className="mainBackground w-full h-full rounded-b-xl text-white border-t-1 border-t-main relative flex flex-col items-start ">
                <div className="w-6 h-6 absolute rotate-45 bg-main -top-3 right-[47.5%]"></div>
                <h1 className="pb-2 pt-6 text-sm text-main font-medium px-4">
                  {slot.loan.nft.collection.name}
                </h1>
                <h1 className="pb-6 text-xl font-semibold px-4">{info.name}</h1>
              </div>{" "}
            </>
          ) : chain === sepolia.id ? (
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
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center rounded-xl text-3xl">
              <h1>Nft missing...</h1>{" "}
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
      ) : chain === sepolia.id ? (
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
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center rounded-xl text-3xl">
          <h1>Nft missing...</h1>{" "}
          <Image
            src={SadSpectre.src}
            alt="SadSpectre Image"
            width={200}
            height={200}
            className="min-h-[150px] mb-5 "
          />
        </div>
      )}
    </button>
  );
}
