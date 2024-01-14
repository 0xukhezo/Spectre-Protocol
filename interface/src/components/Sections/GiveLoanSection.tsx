import React, { useEffect, useState } from "react";
import NftCard from "@/components/Cards/NftCard";
import SearchBar from "../Filters/SearchBar";
import { nfts } from "../../../constants/constants";
import Image from "next/image";
import SadSpectre from "../../../public/SadSpectre.svg";
import SortBy from "../Filters/SortBy";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

export default function GiveLoanSection() {
  const [search, setSearch] = useState<string>("");
  const [nftsCopy, setNftsCopy] = useState<any[]>([...nfts]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [clearFilters, setClearFilters] = useState<boolean>(false);
  const [showFilterPage, setShowFilterPage] = useState<boolean>(true);
  const [selectedSymbols, setSelectedFilters] = useState<string[]>([]);

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const getFilters = (selectedSymbols: string[]) => {
    setSelectedFilters(selectedSymbols);
  };

  useEffect(() => {
    let copy = [...nfts];

    if (selectedSymbols.length !== 0) {
      copy = copy.filter((nft: any) =>
        selectedSymbols.includes(nft.collection)
      );
    }
    if (search.length !== 0) {
      copy = copy.filter(
        (nfts: any) =>
          nfts.name.toLowerCase().includes(search.toLowerCase()) ||
          nfts.collection.toLowerCase() === search.toLowerCase()
      );
    }

    setNftsCopy(copy);
  }, [search, selectedSymbols]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 370) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const uniqueSymbols = Array.from(
      new Set(nfts.map((nft: any) => nft.collection))
    );

    setSymbols(uniqueSymbols);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClearFilters = () => {
    setClearFilters(true);
    setTimeout(() => {
      setClearFilters(false);
    }, 200);
  };

  return (
    <main
      className={`grid  ${
        showFilterPage ? "grid-cols-4" : "grid-cols-16"
      } pb-10 navbarTextOpacity`}
    >
      {showFilterPage ? (
        <div className="border-r-1 border-main my-4 flex flex-col items-end">
          <button
            className="mr-[20px]"
            onClick={() => setShowFilterPage(false)}
          >
            <ChevronDoubleLeftIcon
              height={20}
              width={20}
              className="mr-1.5 hover:text-main"
            />
          </button>
          {symbols.length > 0 && (
            <SortBy
              symbols={symbols}
              getFilters={getFilters}
              clearFilters={clearFilters}
            />
          )}
        </div>
      ) : (
        <div className="border-r-1 border-main my-4 flex flex-col items-end">
          <button className="mr-[20px]" onClick={() => setShowFilterPage(true)}>
            <ChevronDoubleRightIcon
              height={20}
              width={20}
              className="mr-1.5 hover:text-main"
            />
          </button>
        </div>
      )}
      <div className={`${showFilterPage ? "col-span-3" : "col-span-15"} mx-4`}>
        {selectedSymbols.length !== 0 && (
          <div className="mt-10 mb-2 col-span-full mx-[16px] mainBackground p-4 rounded-xl">
            <h1 className="text-2xl mb-4">Applied Filters</h1>
            <div className="flex justify-between">
              <div>
                {selectedSymbols.map((symbol: string, index: number) => (
                  <span
                    className={`bg-main rounded-full px-3 py-2 text-xs text-black font-medium ${
                      index !== 0 && "ml-3"
                    }`}
                  >
                    {symbol}
                  </span>
                ))}
              </div>
              <button
                className="bg-main rounded-full px-3 py-2 text-xs text-black font-medium"
                onClick={handleClearFilters}
              >
                Clean Filters
              </button>
            </div>
          </div>
        )}

        <SearchBar
          placeholder="Search"
          classMain={`${
            scrolled ? "border-b-1 border-main" : ""
          } col-span-full sticky top-0 bg-black ${
            selectedSymbols.length === 0 ? "pt-10" : ""
          } pb-4 z-50 px-[16px]`}
          getInfo={getInfo}
          query={search}
        />
        <div
          className={`relative min-h-[500px] ${
            nftsCopy.length > 0
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[36px] overflow-auto"
              : ""
          }  px-[24px] pb-10`}
        >
          {nftsCopy.length > 0 ? (
            <>
              {nftsCopy.map((nft: any, index: number) => (
                <NftCard nftInfo={nft} index={index} nftsCopy={nftsCopy} />
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
          )}
        </div>
      </div>
    </main>
  );
}
