import React from "react";
import { ConnectKitButton } from "connectkit";

export default function WalletButton() {
  return (
    <main className="max-w-fit flex space-x-9 text-neutral6 items-center bg-main rounded-xl p-[3px]">
      <ConnectKitButton />
    </main>
  );
}
