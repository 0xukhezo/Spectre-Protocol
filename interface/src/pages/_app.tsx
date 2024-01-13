import Navbar from "@/components/Layout/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className="bg-black lg:px-[120px] md:px-[60px] sm:px-[40px] px-[20px] text-white">
      <Navbar />
      <Component {...pageProps} />
    </main>
  );
}
