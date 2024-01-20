// React
import React, { useEffect, useState } from "react";
// Heroicons
import { XMarkIcon } from "@heroicons/react/24/outline";

type FilterCardProps = {
  title: string;
  filters: string[];
  getFilters: (filters: string[]) => void;
  clearFilters: boolean;
};

export default function FilterCard({
  title,
  filters,
  getFilters,
  clearFilters,
}: FilterCardProps) {
  const [active, setActive] = useState<boolean>(false);

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleCheckboxChange = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters((prevFilters) =>
        prevFilters.filter((prevFilter) => prevFilter !== filter)
      );
    } else {
      setSelectedFilters((prevFilters) => [...prevFilters, filter]);
    }
  };

  useEffect(() => {
    if (clearFilters) {
      setSelectedFilters([]);
      getFilters([]);
    }
  }, [clearFilters]);

  useEffect(() => {
    getFilters(selectedFilters);
  }, [selectedFilters]);

  return (
    <main>
      <button
        onClick={() => setActive(active ? false : true)}
        className="pb-1 border-b-1 border-main flex justify-between w-full pt-4"
      >
        <h1 className="flex flex-row items-center z-10 text-main justify-between w-full">
          <span className="text-base text-start text-base md:text-xl">
            {title}
          </span>
          <XMarkIcon
            height={20}
            width={20}
            className={
              active
                ? "mr-1.5 transform rotate-90 transition duration-500 "
                : "mr-1.5 transform rotate-45 transition duration-500 "
            }
          />
        </h1>
      </button>
      {active && (
        <div className="mt-4" id="text-container">
          {filters.length !== 0 ? (
            filters.map((filter: string, index: number) => (
              <div key={index} className="mb-4" id="fade-in-text">
                <label className="flex items-center justify-between flex">
                  <span className="mr-2">{filter}</span>{" "}
                  <input
                    type="checkbox"
                    id="miCheckbox"
                    className="h-5 w-5 bg-red-400 "
                    checked={selectedFilters.includes(filter)}
                    onChange={() => handleCheckboxChange(filter)}
                  />
                </label>
              </div>
            ))
          ) : (
            <div className="font-extralight">
              No {title.toLowerCase()} found.
            </div>
          )}
        </div>
      )}
    </main>
  );
}
