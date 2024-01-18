import Specter from "../public/Specter.svg";
import Ronin from "../public/Ronin.svg";
import { navigatioHeaderType } from "../types/types";
import AAVE from "../public/AAVE.svg";
import USDC from "../public/USDC.svg";
import ETH from "../public/ETH.svg";
import GHO from "../public/GHO.svg";
import LINK from "../public/LINK.jpeg";

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
  "/loan/create": {
    title: "Fill your Slot",
    image: Ronin.src,
    text: "Select the NFT you want to use as collateral, the token you want to have in AAVE as supply and the rewards your sponsor will receive.",
  },
};

export const tokens = [
  {
    image: ETH.src,
    name: "Wrapped Ether",
    symbol: "WETH",
    contract: "0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c",
    decimals: 18,
  },
  {
    image: LINK.src,
    name: "Link Token",
    symbol: "LINK",
    contract: "0xCD85B9a767eF2277E264A4B9A14a2deACAB82FfB",
    decimals: 18,
  },

  {
    image: AAVE.src,
    name: "Aave Token",
    symbol: "AAVE",
    contract: "0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a",
    decimals: 18,
  },
];

export const creatSlotSteps = [
  { id: "Step 1", name: "Fill the slot form", status: "current" },
  {
    id: "Step 2",
    name: "Approve the slot to access your NFT",
    status: "upcoming",
  },
  {
    id: "Step 3",
    name: "Approve GHO to pay your rewards.",
    status: "upcoming",
  },
  { id: "Step 4", name: "Create loan", status: "upcoming" },
];

export const initialSteps = [
  {
    name: "Select NFT",
    description: "Pick the MVP from your NFT squad for the loan spotlight!",
    status: "current",
  },
  {
    name: "Select Token",
    description:
      "Your sponsor supply you this token and then you can have GHO!",
    status: "upcoming",
  },
  {
    name: "Supply amount",
    description:
      "This is the amount of the selected tokens your sponsor gonna supply you.",
    status: "upcoming",
  },
  {
    name: "Rewards amount",
    description:
      "Your sponsor receive at the end of the loan this amount of GHO.",
    status: "upcoming",
  },
  {
    name: "Loan Duration",
    description: "Final Step! The time in days the loan will be active.",
    status: "upcoming",
  },
];

export const getLoanInfoSteps = [
  { id: "Step 1", name: "Create a slot.", status: "complete" },
  {
    id: "Step 2",
    name: "Fill the loan form clicking in your empty slot.",
    status: "complete",
  },
  { id: "Step 3", name: "Approve NFT", status: "complete" },
  { id: "Step 4", name: "Approve GHO", status: "complete" },
  { id: "Step 5", name: "Create the loan", status: "complete" },
];

export const ghoToken = {
  image: GHO.src,
  name: "Gho Token",
  symbol: "GHO",
  contract: "0xc4bF5CbDaBE595361438F8c6a187bDc330539c60",
  decimals: 18,
};
