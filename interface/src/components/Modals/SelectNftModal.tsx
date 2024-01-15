import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "../Filters/SearchBar";
import DisplayerCard from "../Cards/DisplayerCard";

type SelectNftModalProps = {
  getShowMenu: (open: boolean) => void;
  title: string;
  assetsArray: any[];
  getAsset: (asset: any) => void;
};

export default function SelectNftModal({
  getShowMenu,
  title,
  assetsArray,
  getAsset,
}: SelectNftModalProps) {
  const [open, setOpen] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [assetsArrayCopy, setAssetsArrayCopy] = useState<any[]>([
    ...assetsArray,
  ]);

  const closeModal = () => {
    setIsClosing(true);

    setTimeout(() => {
      setOpen(false);
      getShowMenu(false);
      setIsClosing(false);
    }, 800);
  };

  const getInfo = (query: string) => {
    setSearch(query);
  };

  useEffect(() => {
    let copy = [...assetsArray];

    if (search.length !== 0) {
      copy = copy.filter((asset: any) =>
        asset.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setAssetsArrayCopy(copy);
  }, [search]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative" onClose={closeModal}>
        <div
          className={`loanOverlay ${open ? "open" : ""}`}
          onClick={() => closeModal()}
        >
          <Dialog.Panel
            className={`loanModal ${
              isClosing ? "closing" : ""
            } rounded-lg mainBackground text-white px-4 pb-4 pt-5 text-start shadow-xl sm:my-8 w-1/3 sm:p-6 overflow-auto h-[800px]`}
          >
            <div className="absolute right-0 top-0 pr-4 pt-4 block">
              <button
                type="button"
                className="rounded-md text-main"
                onClick={() => closeModal()}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="text-center mt-[12px]">
              {" "}
              <div className="sm:flex flex-col sm:items-start mt-10">
                <div className="w-full border-b-1 border-main">
                  <div className=" text-start sm:mt-0 sm:text-left w-full">
                    <h1 className="text-3xl">{title}</h1>
                  </div>
                  <SearchBar
                    getInfo={getInfo}
                    query={search}
                    classMain="rounded-xl text-black px-[22px] items-center w-full outline-none placeholder:text-black flex my-[16px] border-1 border-main"
                    placeholder="Search token or paste address"
                    classInput="rounded-xl outline-none placeholder:text-gray-400 py-[10px] px-[20px] w-full text-black mainBackground"
                  />
                </div>

                <div className="px-[18px] w-full mt-4 overflow-y-auto flex flex-col">
                  {assetsArrayCopy.map((asset: any, index: number) => {
                    return (
                      <DisplayerCard
                        asset={asset}
                        selectAsset={getAsset}
                        closeModal={() => closeModal()}
                        roundedImage="rounded-lg"
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
