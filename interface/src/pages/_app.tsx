import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/Layout/Navbar";
import { arbitrumSepolia } from "viem/chains";

const chains = [sepolia, arbitrumSepolia];

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID || "",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains,
    appName: "Spectre protocol",
    appDescription:
      "Spectre Protocol is a p2p platform for collateralised loans using NFTs. Another user can give you the supply needed to borrow GHO through AAVE 👻, if you have no debt at the end of the loan,the supplier will receive the supply plus the APY earn in AAVE and a GHO reward!🤑",
    appUrl: "https://github.com/0xukhezo/Spectre-Protocol",
    appIcon: "https://family.co/logo.png",
  })
);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider theme="midnight">
        <main className="bg-black lg:px-[120px] md:px-[60px] sm:px-[40px] px-[20px] text-white">
          <Navbar />
          <Component {...pageProps} />
        </main>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
