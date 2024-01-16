import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import FilterCard from "../Cards/FilterCard";

type SortByProps = {
  symbols: string[];
  getFilters: (filters: string[]) => void;
  clearFilters: boolean;
};

export default function SortBy({
  symbols,
  getFilters,
  clearFilters,
}: SortByProps) {
  const [search, setSearch] = useState<string>("");
  const [symbolsCopy, setSymbolsCopy] = useState<any[]>([...symbols]);

  const getInfo = (query: string) => {
    setSearch(query);
  };

  const getSymbolFilters = (selectedSymbols: string[]) => {
    getFilters(selectedSymbols);
  };

  useEffect(() => {
    if (symbols) {
      let copy = [...symbols];

      if (search.length !== 0) {
        copy = copy.filter((symbol: string) =>
          symbol.toLowerCase().includes(search.toLowerCase())
        );
      }

      setSymbolsCopy(copy);
    }
  }, [search]);

  return (
    <main className="w-full sticky top-10 mt-6 pb-4 z-50 mx-[16px] mainBackground p-6 rounded-xl">
      <h1 className="text-xl navbarTitle font-semibold">Filters</h1>
      <SearchBar
        placeholder="Search"
        classMain="pt-4 pb-4 z-50"
        getInfo={getInfo}
        query={search}
        classInput="rounded-xl outline-none placeholder:text-gray-400 py-[10px] px-[20px] w-full text-white mainBackground border-main border-1"
      />
      <div className="px-2">
        <FilterCard
          filters={symbolsCopy}
          title="Collections"
          getFilters={getSymbolFilters}
          clearFilters={clearFilters}
        />
        {/* {symbolsCopy.map((symbol: string) => (
          <div>{symbol}</div>
        ))} */}
      </div>
    </main>
  );
}
