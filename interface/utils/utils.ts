import axios from "axios";

export function formatAddress(address: string) {
  return (
    address.substring(0, 7) + "..." + address.substring(address.length - 5)
  );
}

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export function calculateTimeComponents(totalSeconds: number) {
  const days = Math.floor(totalSeconds / (24 * 60 * 60));
  const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return `${days} d ${hours} h ${minutes} min ${seconds.toFixed(0)} s`;
}

export async function fetchUri(url: string) {
  try {
    let correctUrl = url;
    if (correctUrl.startsWith("ipfs://")) {
      correctUrl = "https://ipfs.io/ipfs/" + correctUrl.slice("ipfs://".length);
    }
    const response = await axios.get(correctUrl);
    let jsonString = response.data;
    if (typeof response.data === "string") {
      jsonString = jsonString.replace(/"name":\s*("[^"]*")/, '"name": $1,');
      return JSON.parse(jsonString);
    } else {
      return jsonString;
    }
  } catch (error) {
    console.log("Error");
  }
}

export function transformUrl(url: string): string {
  if (url.startsWith("ipfs://")) {
    return "https://ipfs.io/ipfs/" + url.slice("ipfs://".length);
  } else {
    return url;
  }
}
