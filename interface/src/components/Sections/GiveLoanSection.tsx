// React
import React, { useEffect, useState } from "react";
// Components
import NftCard from "@/components/Cards/NftCard";
import SortBy from "../Filters/SortBy";
import SearchBar from "../Filters/SearchBar";
import Loader from "../Loader/Loader";
// Next
import Image from "next/image";
// Images
import SadSpectre from "../../../public/SadSpectre.svg";
// Heroicons
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
// Hooks
import { useFetchLoans } from "@/hooks/useFetchLoans";
// Wagmi
import { useAccount } from "wagmi";

export default function GiveLoanSection() {
  const { address } = useAccount();
  const { loans, loading } = useFetchLoans(
    `(where: {user_: {id_not: "${address?.toLowerCase()}"}, supplier: "0x0000000000000000000000000000000000000000"})`
  );

  const [search, setSearch] = useState<string>("");
  const [nftsCopy, setNftsCopy] = useState<any[]>([...loans]);
  const [symbols, setSymbols] = useState<string[]>([]);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [clearFilters, setClearFilters] = useState<boolean>(false);
  const [loadingResearch, setLoadingResearch] = useState<boolean>(true);

  const [showFilterPage, setShowFilterPage] = useState<boolean>(true);
  const [selectedSymbols, setSelectedFilters] = useState<string[]>([]);

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const getFilters = (selectedSymbols: string[]) => {
    setSelectedFilters(selectedSymbols);
  };

  useEffect(() => {
    setNftsCopy([...loans]);
  }, [loans]);

  useEffect(() => {
    setLoadingResearch(true);

    const delaySearch = setTimeout(() => {
      let copy = [...loans];

      if (selectedSymbols.length !== 0) {
        copy = copy.filter((loan) =>
          selectedSymbols.includes(loan.nft.collection.name)
        );
      }

      if (search.length !== 0) {
        copy = copy.filter((loan) =>
          loan.nft.collection.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setNftsCopy(copy);
      setLoadingResearch(false);
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search, selectedSymbols, loans]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 370) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const uniqueSymbols = Array.from(
      new Set(loans.map((loan: any) => loan.nft.collection.name))
    );

    setSymbols(uniqueSymbols);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loans]);

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
                    key={symbol}
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
          classInput="rounded-xl outline-none placeholder:text-gray-400 py-[10px] px-[20px] w-full text-white mainBackground"
        />
        {loading ? (
          <div className="flex h-[800px] justify-center items-center">
            <Loader />
          </div>
        ) : (
          <div
            className={`relative min-h-[500px] ${
              nftsCopy.length > 0
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[36px] overflow-auto"
                : ""
            }  px-[24px] py-10`}
          >
            {nftsCopy.length !== 0 ? (
              <>
                {!loadingResearch ? (
                  <>
                    {nftsCopy.map((nft: any, index: number) => (
                      <NftCard
                        nftInfo={nft}
                        index={index}
                        nftsCopy={nftsCopy}
                        key={index}
                        isPortfolio={false}
                        isLoan={false}
                      />
                    ))}
                  </>
                ) : (
                  <div className="flex h-[700px] justify-center items-center col-span-full">
                    <Loader />
                  </div>
                )}
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
        )}
      </div>
    </main>
  );
}
