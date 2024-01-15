import Specter from "../public/Specter.svg";
import Ronin from "../public/Ronin.svg";
import { navigatioHeaderType } from "../types/types";

export const navigation = [
  {
    href: "/",
    name: "Get a Loan",
  },
  {
    href: "/give/loan",
    name: "Give a Loan",
  },
  {
    href: "/profile",
    name: "Profile",
  },
];

export const navigatioHeader: navigatioHeaderType = {
  "/": {
    title: "Get a Loan",
    image: Ronin.src,
    text: "Choose the NFT you would like to get a loan on. the rest of the community can see your loan, if someone accept your loan you will be able to get GHO using your NFT as collateral.",
  },
  "/give/loan": {
    title: "Give a Loan",
    image: Ronin.src,
    text: "Offer loans to other users on their non-fungible tokens.",
  },
  "/profile": {
    title: "Profile",
    image: Ronin.src,
    text: "Your Profile. Your NFTs. Your Loans. Your Space.",
  },
};

export const nfts = [
  {
    image: Specter.src,
    name: "Bored ghost #1",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #2",
    collection: "Bored ghost",
    owner: "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
  },
  {
    image: Specter.src,
    name: "Bored ape #1",
    collection: "Bored APE",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #3",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #4",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #5",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #6",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #7",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ape #3",
    collection: "Bored APE",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #8",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #9",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ghost #10",
    collection: "Bored ghost",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },

  {
    image: Specter.src,
    name: "Bored ape #2",
    collection: "Bored APE",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },

  {
    image: Specter.src,
    name: "Bored ape #4",
    collection: "Bored APE",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
  {
    image: Specter.src,
    name: "Bored ape #5",
    collection: "Bored APE",
    owner: "0x10490b471658AF1e95571f15cAD949B0e63A4629",
  },
];
