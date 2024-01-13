import Specter from "../public/Specter.svg";
import { navigatioHeaderType } from "../types/types";

export const navigation = [
  {
    href: "/",
    name: "Get Loan",
  },
  {
    href: "/give/loan",
    name: "Loans",
  },
  {
    href: "/profile",
    name: "Profile",
  },
];

export const navigatioHeader: navigatioHeaderType = {
  "/": {
    title: "Get Loan",
    image: Specter.src,
    text: "Choose the NFT you would like to get a loan on. the rest of the community can see your loan, if someone accept your loan you will be able to get GHO using your NFT as collateral.",
  },
  "/give/loan": {
    title: "Give Loan",
    image: Specter.src,
    text: "Offer loans to other users on their non-fungible tokens.",
  },
  "/profile": {
    title: "Profile",
    image: Specter.src,
    text: "Your Profile. Your NFTs. Your Loans. Your Space.",
  },
};
