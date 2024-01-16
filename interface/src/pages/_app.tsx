import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { WagmiConfig, createConfig, mainnet, sepolia } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import Navbar from "@/components/Layout/Navbar";

const chains = [mainnet, sepolia];

const config = createConfig(
  getDefaultConfig({
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID || "",
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    chains,
    appName: "GHO Minted",
    appDescription: "NFT vault to mint GHO",
    appUrl: "https://family.co",
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
