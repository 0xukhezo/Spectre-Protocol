import Link from "next/link";
import React from "react";

export default function Page404() {
  return (
    <div className="font-extralight h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl mb-2">404</h1>
      <h1 className="text-6xl mb-8">Page noy found.</h1>
      <Link href="/" className="hover:underline hover:text-main">
        Back to Spectre Protocol
      </Link>
    </div>
  );
}
