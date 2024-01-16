// React
import React, { ReactElement, useEffect } from "react";
// Wagmi
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

type TxButtonProps = {
  address: `0x${string}`;
  abi: any;
  functionName: string;
  args: any[];
  children: ReactElement;
  getTxStatus: (status: string, name: string) => void;
  className: string;
  id: string;
};

export default function TxButton({
  address,
  abi,
  functionName,
  args,
  getTxStatus,
  children,
  className,
  id,
}: TxButtonProps) {
  const { config: txContractConfig } = usePrepareContractWrite({
    address: address,
    abi: abi,
    functionName: functionName,
    args: args,
  });

  const { writeAsync: contractTx, data: dataTx } =
    useContractWrite(txContractConfig);

  const {
    isSuccess: txSuccessWagmi,
    isLoading: txLoadingWagmi,
    isError: txErrorWagmi,
  } = useWaitForTransaction({
    confirmations: 2,
    hash: dataTx?.hash,
  });

  const onWagmiClick = async () => {
    try {
      await contractTx?.();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (txLoadingWagmi) {
      getTxStatus("loading", id);
    } else if (txErrorWagmi) {
      getTxStatus("error", id);
    } else if (txSuccessWagmi) {
      getTxStatus("success", id);
    }
  }, [txSuccessWagmi, txLoadingWagmi, txErrorWagmi]);

  return (
    <>
      <button className={className} onClick={() => onWagmiClick()}>
        {children}
      </button>
    </>
  );
}
