// React
import React from "react";

type SearchBar = {
  getInfo: (query: string) => void;
  query: string;
  classMain: string;
  placeholder: string;
  classInput: string;
};

export default function SearchBar({
  getInfo,
  query,
  classMain,
  placeholder,
  classInput,
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
        className={classInput}
        onChange={(e) => handleSearchChange(e)}
      />
    </div>
  );
}
