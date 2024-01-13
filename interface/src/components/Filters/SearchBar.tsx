// React
import React from "react";

type SearchBar = {
  getInfo: (query: string) => void;
  query: string;
  classMain: string;
  placeholder: string;
};

export default function SearchBar({
  getInfo,
  query,
  classMain,
  placeholder,
}: SearchBar) {
  const handleSearchChange = (e: any) => {
    let search = e.currentTarget.value;
    getInfo(search.toLowerCase());
  };

  return (
    <div className={classMain}>
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        className="rounded-xl outline-none placeholder:text-gray-400 py-[10px] px-[20px] w-full text-white mainBackground"
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
}
