// React
import React, { useState } from "react";
// Components
import ProfileNfts from "./ProfileNfts";
import ProfileLoans from "./ProfileLoans";
import ProfileHistory from "./ProfileHistory";

export default function ProfileSection() {
  const [sectionSelected, setSectionSelected] = useState("nfts");

  return (
    <main className="navbarTextOpacity relative">
      <div className="col-span-full absolute -top-8 grid grid-cols-3 w-1/4 font-semibold">
        <button
          className={`${
            sectionSelected === "nfts" && "border-b-[4px] border-main"
          } pb-2`}
          onClick={() => setSectionSelected("nfts")}
        >
          Nfts
        </button>{" "}
        <button
          className={`${
            sectionSelected === "loans" && "border-b-[4px] border-main"
          } pb-2`}
          onClick={() => setSectionSelected("loans")}
        >
          Loans
        </button>
        <button
          className={`${
            sectionSelected === "history" && "border-b-[4px] border-main"
          } pb-2`}
          onClick={() => setSectionSelected("history")}
        >
          History
        </button>
      </div>
      {sectionSelected === "nfts" ? (
        <ProfileNfts />
      ) : sectionSelected === "history" ? (
        <ProfileHistory />
      ) : (
        <ProfileLoans />
      )}
    </main>
  );
}
