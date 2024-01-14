import React from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";

export default function WalletButton() {
  const { isConnected } = useAccount();

  return (
    <main
      className={`max-w-fit flex space-x-9 text-neutral6 items-center ${
        !isConnected && "bg-main rounded-xl p-0.5"
      } `}
    >
      <ConnectKitButton />
    </main>
  );
}
