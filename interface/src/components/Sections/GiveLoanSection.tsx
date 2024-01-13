import React, { useEffect, useState } from "react";
import NftCard from "@/components/Cards/NftCard";
import SearchBar from "../Filters/SearchBar";
import { nfts } from "../../../constants/constants";

export default function GiveLoanSection() {
  const [search, setSearch] = useState<string>("");
  const [nftsCopy, setNftsCopy] = useState<any[]>([...nfts]);
  const [scrolled, setScrolled] = useState(false);

  const getInfo = (query: string) => {
    setSearch(query);
  };

  useEffect(() => {
    let copy = [...nfts];

    if (search.length !== 0) {
      copy = copy.filter(
        (nfts: any) =>
          nfts.name.toLowerCase().includes(search.toLowerCase()) ||
          nfts.symbol.toLowerCase() === search.toLowerCase()
      );
    }

    setNftsCopy(copy);
  }, [search]);

  useEffect(() => {
    const marketplace = document.getElementById("marketplace");
    if (marketplace) {
      const handleScroll = () => {
        if (marketplace.scrollTop > 30) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      };

      marketplace.addEventListener("scroll", handleScroll);

      return () => {
        marketplace.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  return (
    <main className="grid grid-cols-4 pb-10">
      <div className="border-r-1 border-main my-4"></div>
      <div className="col-span-3 mx-4">
        <SearchBar
          placeholder="Search"
          classMain={`${
            scrolled ? "border-b-1 border-main" : ""
          } col-span-full sticky top-0 bg-black pt-10 pb-4 z-50 scroll-border px-[16px]`}
          getInfo={getInfo}
          query={search}
        />
        <div
          className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-[36px] overflow-auto h-screen px-[16px] pt-10"
          id="marketplace"
        >
          {nftsCopy.length > 0 ? (
            <>
              {nftsCopy.map((nft: any, index: number) => (
                <NftCard nftInfo={nft} index={index} nftsCopy={nftsCopy} />
              ))}
            </>
          ) : (
            <div className="max-h-[300px] col-span-full -mt-[300px] text-5xl navbarTitle max-w-[600px] text-center mx-auto">
              Looks like NFTs are playing ghost.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
