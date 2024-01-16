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
