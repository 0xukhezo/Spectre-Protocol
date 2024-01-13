import { formatAddress } from "../../utils/utils";

export default function HomePage() {
  return (
    <main>
      Get Loan
      <div>{formatAddress("0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0")}</div>
    </main>
  );
}
