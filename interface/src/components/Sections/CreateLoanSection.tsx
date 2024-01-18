import useNFTData from "@/hooks/useNFTData";
import React, { ReactElement, useEffect, useState } from "react";
import { erc20ABI, erc721ABI, useAccount } from "wagmi";
import SelectNftModal from "../Modals/SelectNftModal";
import Image from "next/image";
import SelectTokenModal from "../Modals/SelectTokenModal";
import {
  initialSteps,
  tokens,
  ghoToken,
  creatSlotSteps,
} from "../../../constants/constants";
import GHO from "../../../public/GHO.svg";
import Error from "../../../public/Error.svg";
import Success from "../../../public/Success.svg";
import WalletButton from "../Buttons/WalletButton";
import Steps from "../Steps/Steps";
import { useRouter } from "next/router";
import TxButton from "../Buttons/TxButton";
import { abiUserSlot } from "../../../abis/abis.json";
import Loader from "../Loader/Loader";
import NotificationsCard from "../Cards/NotificationsCard";
import InfoSteps from "../Steps/InfoSteps";

export default function CreateLoanSection() {
  const { address, isConnected } = useAccount();
  const { nftData: data } = useNFTData(address as `0x${string}`);

  const router = useRouter();

  const slotAddress = router.query.id;

  const [connected, setConnected] = useState(false);
  const [steps, setSteps] = useState(initialSteps);
  const [createSlotSteps, setCreateSlotSteps] = useState(creatSlotSteps);

  const [openNFTModal, setOpenNFTModal] = useState(false);
  const [openTokenModal, setOpenTokenModal] = useState(false);

  const [nft, setNft] = useState<any | null>(null);
  const [token, setToken] = useState<any | null>(null);

  const [amountSupply, setAmountSupply] = useState<number | undefined>(
    undefined
  );
  const [rewards, setRewards] = useState<number | undefined>(undefined);
  const [loanDuration, setLoanDuration] = useState<number | undefined>(
    undefined
  );
  const [loanDurationToContrat, setLoanDurationToContrat] = useState<
    number | undefined
  >(undefined);
  const [status, setStatus] = useState<string[]>([]);

  const [title, setTitle] = useState<string | null>(null);
  const [image, setImage] = useState<string | ReactElement | null>(null);
  const [txDescription, setTxDescription] = useState<string | null>(null);

  const getShowMenuNft = (state: boolean) => {
    setOpenNFTModal(state);
  };

  const getShowMenuToken = (state: boolean) => {
    setOpenTokenModal(state);
  };

  const handleLoanDuration = (duration: number) => {
    if (duration >= 0) {
      setLoanDuration(duration);
      setLoanDurationToContrat(duration * 3600 * 24);
    } else {
      setLoanDuration(0);
      setLoanDurationToContrat(0);
    }
  };

  const getNft = (nft: any) => {
    setNft(nft);
  };

  const getToken = (token: any) => {
    setToken(token);
  };

  const getStatus = (status: string, statusFuction: string) => {
    setStatus([status, statusFuction]);
  };

  useEffect(() => {
    if (status[0] === "loading") {
      setTitle("Processing");
      setTxDescription("The transaction is being processed.");
      setImage(Loader);
    } else if (status[0] === "error") {
      setTitle("Error");
      setTxDescription("Failed transaction.");
      setImage(Error.src);
    } else if (status[0] === "success") {
      setTitle("Success");
      setTxDescription("The transaction was executed correctly");
      setImage(Success.src);
    }
    if (status[0] === "success" && status[1] === "approveNft") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setImage(null);
      }, 2000);
    }
    if (status[0] === "success" && status[1] === "approveGho") {
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setImage(null);
      }, 2000);
    }
    if (status[0] === "success" && status[1] === "openRequest") {
      setLoanDuration(undefined);
      setRewards(undefined);
      setAmountSupply(undefined);
      setToken(null);
      setNft(null);
      setTimeout(() => {
        setTitle(null);
        setTxDescription(null);
        setImage(null);
      }, 2000);
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  }, [status]);

  useEffect(() => {
    setConnected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    if (nft && token === null)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "current",
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
      ]);
  }, [nft]);

  useEffect(() => {
    if (token && amountSupply === undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "current",
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
      ]);
  }, [token]);

  useEffect(() => {
    if (rewards === undefined && amountSupply !== undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "current",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "upcoming",
        },
      ]);
  }, [amountSupply]);

  useEffect(() => {
    if (rewards !== undefined && loanDuration === undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "complete",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "current",
        },
      ]);
  }, [rewards]);

  useEffect(() => {
    if (rewards !== undefined && loanDuration !== undefined)
      setSteps([
        {
          name: "Select NFT",
          description:
            "Pick the MVP from your NFT squad for the loan spotlight!",
          status: "complete",
        },
        {
          name: "Select Token",
          description:
            "Your sponsor supply you this token and then you can have GHO!",
          status: "complete",
        },
        {
          name: "Supply amount",
          description:
            "This is the amount of the selected tokens your sponsor gonna supply you.",
          status: "complete",
        },
        {
          name: "Rewards amount",
          description:
            "Your sponsor receive at the end of the loan this amount of GHO.",
          status: "complete",
        },
        {
          name: "Loan Duration",
          description: "Final Step! The time in days the loan will be active.",
          status: "complete",
        },
      ]);
  }, [loanDuration]);

  useEffect(() => {
    if (nft && token && amountSupply && rewards && loanDuration) {
      setCreateSlotSteps([
        { id: "Step 1", name: "Fill the slot form", status: "complete" },
        {
          id: "Step 2",
          name: "Approve the slot to access your NFT",
          status: "current",
        },
        {
          id: "Step 3",
          name: "Approve GHO to pay your rewards.",
          status: "upcoming",
        },
        { id: "Step 4", name: "Create loan", status: "upcoming" },
      ]);
    }
  }, [nft, token, amountSupply, rewards, loanDuration]);

  useEffect(() => {
    if (status[0] === "success" && status[1] === "approveNft") {
      setCreateSlotSteps([
        { id: "Step 1", name: "Fill the slot form", status: "complete" },
        {
          id: "Step 2",
          name: "Approve the slot to access your NFT",
          status: "complete",
        },
        {
          id: "Step 3",
          name: "Approve GHO to pay your rewards.",
          status: "current",
        },
        { id: "Step 4", name: "Create loan", status: "upcoming" },
      ]);
    }
    if (status[0] === "success" && status[1] === "approveGho") {
      setCreateSlotSteps([
        { id: "Step 1", name: "Fill the slot form", status: "complete" },
        {
          id: "Step 2",
          name: "Approve the slot to access your NFT",
          status: "complete",
        },
        {
          id: "Step 3",
          name: "Approve GHO to pay your rewards.",
          status: "complete",
        },
        { id: "Step 4", name: "Create loan", status: "current" },
      ]);
    }
    if (status[0] === "success" && status[1] === "openRequest") {
      setCreateSlotSteps([
        { id: "Step 1", name: "Fill the slot form", status: "complete" },
        {
          id: "Step 2",
          name: "Approve the slot to access your NFT",
          status: "complete",
        },
        {
          id: "Step 3",
          name: "Approve GHO to pay your rewards.",
          status: "complete",
        },
        { id: "Step 4", name: "Create loan", status: "complete" },
      ]);
    }
  }, [status]);

  return (
    <main className="pb-10 pt-8 navbarTextOpacity min-h-[1000px]">
      <div className="mainBackground p-6 rounded-xl flex flex-col text-lg max-w-[1000px] mx-auto mb-4">
        <span className="text-2xl navbarTitle">
          In order to create your slot, follow this steps
        </span>
        <InfoSteps steps={createSlotSteps} />
        <div className="grid grid-cols-4 mt-3">
          <div></div>
          {(status.length === 0 ||
            (status[0] === "loading" && status[1] === "approveNft")) &&
          nft &&
          token &&
          amountSupply &&
          rewards &&
          loanDuration ? (
            <TxButton
              address={nft.contractAddress as `0x${string}`}
              abi={erc721ABI}
              functionName="approve"
              args={[slotAddress, nft.tokenId]}
              getTxStatus={getStatus}
              children={<span>Approve {nft.name}</span>}
              className="bg-main text-black font-light px-4 py-6 rounded-xl hover:bg-secondary flex h-1/2 my-auto items-center justify-center mx-4"
              id="approveNft"
            />
          ) : (
            <button
              className={`h-1/2 my-auto items-center justify-center border-1 border-main mx-4 flex flex-col px-4 rounded-xl mainBackground opacity-50 py-6 ${
                ((status[1] === "approveNft" && status[0] !== "loading") ||
                  status[1] === "approveGho" ||
                  (status[1] === "openRequest" && status[0] === "loading")) &&
                "opacity-0"
              }`}
              disabled
            >
              Approve NFT
            </button>
          )}
          {((status[1] === "approveNft" && status[0] !== "loading") ||
            (status[1] === "approveGho" && status[0] === "loading")) &&
          nft &&
          token &&
          amountSupply &&
          rewards &&
          loanDuration ? (
            <TxButton
              address={ghoToken.contract as `0x${string}`}
              abi={erc20ABI}
              functionName="approve"
              args={[slotAddress, rewards * 10 ** ghoToken.decimals]}
              getTxStatus={getStatus}
              children={<span> Approve GHO</span>}
              className="bg-main text-black font-light px-4 py-6 rounded-xl hover:bg-secondary flex h-1/2 my-auto items-center justify-center mx-4"
              id="approveGho"
            />
          ) : (
            <button
              className={`h-1/2 my-auto items-center justify-center border-1 border-main mx-4 flex flex-col px-4 rounded-xl mainBackground opacity-50  py-6 ${
                ((status[1] === "approveGho" && status[0] !== "loading") ||
                  (status[1] === "openRequest" && status[0] === "loading")) &&
                "opacity-0"
              }`}
              disabled
            >
              Approve GHO
            </button>
          )}
          {((status[1] === "approveGho" && status[0] !== "loading") ||
            (status[1] === "openRequest" && status[0] === "loading")) &&
          token &&
          nft &&
          amountSupply &&
          rewards ? (
            <TxButton
              address={slotAddress as `0x${string}`}
              abi={abiUserSlot}
              functionName="openRequest"
              args={[
                nft.contractAddress,
                nft.tokenId,
                token.contract,
                amountSupply * 10 ** token.decimals,
                ghoToken.contract,
                rewards * 10 ** ghoToken.decimals,
                loanDurationToContrat,
              ]}
              getTxStatus={getStatus}
              children={<span>Create Loan</span>}
              className="bg-main text-black font-light px-4 py-6 rounded-xl hover:bg-secondary flex h-1/2 my-auto items-center justify-center mx-4"
              id="openRequest"
            />
          ) : (
            <button
              className="h-1/2 my-auto items-center justify-center border-1 border-main mx-4 flex flex-col px-4 rounded-xl mainBackground opacity-50 py-6"
              disabled
            >
              Create Loan
            </button>
          )}
        </div>
      </div>{" "}
      {!connected ? (
        <div className="h-[700px] flex justify-center items-center flex-col">
          <h1 className="font-extralight mb-10 text-3xl">
            You need to be connected to get a loan
          </h1>
          <WalletButton />
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col px-24 rounded-xl mainBackground py-6 mx-auto max-w-[1000px] mb-10">
            <div className="mb-6">
              <h1 className="text-3xl navbarTitle pb-2">Fill your Slot</h1>{" "}
              <hr className="modalAnimatedLine" />
            </div>

            <div className="p-10 grid grid-cols-2">
              <Steps steps={steps} />
              <div className="flex flex-col items-end">
                {" "}
                <button
                  onClick={() => {
                    setOpenNFTModal(true);
                  }}
                  className="bg-main text-black font-light px-4 py-2 rounded-xl hover:bg-secondary w-[300px] mb-4 h-[54px]"
                >
                  {nft && nft.contractAddress ? (
                    <div className="flex items-center justify-between">
                      <span>{nft.name}</span>
                      {nft.image && (
                        <Image
                          src={nft.image}
                          alt={`${nft.name} image`}
                          width={40}
                          height={40}
                          className="rounded-lg h-[40px] min-w-[40px]"
                        />
                      )}
                    </div>
                  ) : (
                    "Select NFT"
                  )}
                </button>{" "}
                <button
                  onClick={() => {
                    setOpenTokenModal(true);
                  }}
                  disabled={nft === null}
                  className={`bg-main text-black font-light px-4 py-2 rounded-xl hover:bg-secondary my-4 w-[300px] items-center flex justify-between h-[54px] ${
                    nft === null && "opacity-50"
                  }`}
                >
                  {token ? (
                    <>
                      <span>{token.symbol}</span>
                      {token.image && (
                        <Image
                          src={token.image}
                          alt={`${token.symbol} image`}
                          width={40}
                          height={40}
                          className="rounded-lg h-[40px] min-w-[40px] ml-[24px]"
                        />
                      )}
                    </>
                  ) : (
                    <span className="mx-auto">Select Token</span>
                  )}
                </button>
                <div
                  className={`rounded-xl text-black bg-main font-light h-[54px] flex items-center my-4 px-4 w-[300px] ${
                    token === null && "opacity-50"
                  }`}
                >
                  <input
                    type="number"
                    value={amountSupply}
                    min={0}
                    step={1 / 10 ** 18}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        setAmountSupply(Number(e.target.value));
                      } else {
                        setAmountSupply(0);
                      }
                    }}
                    placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="bg-main pr-8 py-1 text-black bg-main font-light h-[46px] ring-0 focus:ring-0 outline-0  "
                    disabled={token === null}
                  />{" "}
                  {token && (
                    <Image
                      src={token.image}
                      alt={`${token.symbol} image`}
                      width={40}
                      height={40}
                      className="rounded-lg h-[40px] min-w-[40px] ml-[24px] ml-3"
                    />
                  )}
                </div>{" "}
                <div
                  className={`rounded-xl text-black bg-main font-light h-[54px] flex items-center my-4 px-4 w-[300px] ${
                    amountSupply === undefined && "opacity-50"
                  }`}
                >
                  <input
                    type="number"
                    value={rewards}
                    min={0}
                    step={1 / 10 ** 18}
                    onChange={(e) => {
                      if (Number(e.target.value) >= 0) {
                        setRewards(Number(e.target.value));
                      } else {
                        setRewards(0);
                      }
                    }}
                    placeholder="0"
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    className="rounded-lg pr-8 py-1 text-black bg-main font-light h-[46px] ring-0 focus:ring-0 outline-0"
                    disabled={amountSupply === undefined}
                  />

                  <Image
                    src={GHO.src}
                    alt={`GHO image`}
                    width={40}
                    height={40}
                    className="rounded-lg h-[40px] min-w-[40px] ml-[24px] ml-3"
                  />
                </div>{" "}
                <div
                  className={`rounded-xl text-black bg-main font-light h-[54px] flex items-center my-4 px-4 w-[300px] ${
                    rewards === undefined && "opacity-50"
                  }`}
                >
                  <input
                    type="number"
                    value={loanDuration}
                    min={0}
                    onChange={(e) => handleLoanDuration(Number(e.target.value))}
                    onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    placeholder="0"
                    className="rounded-lg pr-8 py-1 text-black bg-main font-light h-[46px] ring-0 focus:ring-0 outline-0"
                    disabled={rewards === undefined}
                  />
                  <span className="rounded-lg  min-w-[40px] ml-[24px] ml-3 text-center ">
                    days
                  </span>
                </div>{" "}
              </div>
            </div>

            {openNFTModal && data && (
              <SelectNftModal
                getShowMenu={getShowMenuNft}
                title="Select Nft"
                assetsArray={data}
                getAsset={getNft}
              />
            )}
            {openTokenModal && (
              <SelectTokenModal
                getShowMenu={getShowMenuToken}
                title="Select Nft"
                assetsArray={tokens}
                getAsset={getToken}
              />
            )}
          </div>
          {title && image && txDescription && (
            <NotificationsCard
              title={title}
              image={image}
              txDescription={txDescription}
            />
          )}
        </>
      )}
    </main>
  );
}
