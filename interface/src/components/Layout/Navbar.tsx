// Next
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
// Icons
import { Disclosure } from "@headlessui/react";
// Images
import Specter from "../../../public/Specter.svg";
import Burger from "../../../public/Burger.svg";
import Cross from "../../../public/Cross.svg";
// Components
import WalletButton from "../Buttons/WalletButton";
import { navigatioHeader, navigation } from "../../../constants/constants";

export default function Navbar() {
  const router = useRouter();

  return (
    <Disclosure as="nav" id="navbar" className="primary-navigation">
      {({ open }) => (
        <>
          <div className="mx-auto md:pt-[20px] pt-[30px] text-white">
            <div className="navbar flex items-center justify-between p-[20px] ">
              <div className="navbar-opacity"></div>
              <div className="flex-shrink-0">
                <Link href="/">
                  <Image
                    src={Specter.src}
                    alt="Your Company"
                    width={50}
                    height={50}
                    className="logo hidden lg:block"
                  />

                  <Image
                    src={Specter.src}
                    alt="Your Company"
                    width={20}
                    height={20}
                    className="logo lg:hidden block"
                  />
                </Link>
              </div>
              <div className="flex items-center">
                <div className="hidden sm:ml-6 md:block">
                  <div className="flex xl:space-x-[88px] lg:space-x-[54px] space-x-[40px] font-bold text-xl">
                    {navigation.map((link: any) => (
                      <Link href={link.href}>
                        <span
                          className={`${
                            link.href !== router.asPath ? "underline-hover" : ""
                          }`}
                        >
                          {link.name}{" "}
                        </span>
                        {link.href === router.asPath && (
                          <hr className="underlined"></hr>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 md:block">
                <WalletButton />
              </div>{" "}
              <div className="-mr-2 flex md:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <Image
                      src={Cross.src}
                      alt="Your Company"
                      width={26}
                      height={18}
                      className="block"
                    />
                  ) : (
                    <Image
                      src={Burger.src}
                      alt="Your Company"
                      width={28}
                      height={20}
                      className="block"
                    />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden bg-purple-100 flex flex-col justify-between">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Disclosure.Button
                as="a"
                href={"/"}
                className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white"
              >
                Get Loan
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href={"/give/loan"}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Give Loan
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href={"/profile"}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                Profile
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>

          <div className="py-10 relative overflow-hidden border-b-main border-b-1">
            <div>
              <h1 className="text-6xl navbarTitle">
                {navigatioHeader[router.asPath].title}
              </h1>
              <h2 className="text-xl md:w-2/3 sm:w-1/2 lg:h-[50px] sm:h-[80px] my-5">
                {navigatioHeader[router.asPath].text}
              </h2>
            </div>
            <Image
              src={navigatioHeader[router.asPath].image}
              alt="Navigation Image"
              width={350}
              height={350}
              className="hidden lg:block absolute -bottom-2/3 right-0"
            />
            <Image
              src={navigatioHeader[router.asPath].image}
              alt="Navigation Image"
              width={250}
              height={250}
              className="hidden sm:block lg:hidden absolute -bottom-[120px] right-0"
            />
          </div>
        </>
      )}
    </Disclosure>
  );
}
