// React
import { useEffect, useState } from "react";
import axios from "axios";

export const useFetchUriInfo = (url: string) => {
  const [info, setInfo] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchUri() {
    try {
      let correctUrl = url;
      if (correctUrl.startsWith("ipfs://")) {
        correctUrl =
          "https://ipfs.io/ipfs/" + correctUrl.slice("ipfs://".length);
      }
      const response = await axios.get(correctUrl);
      let jsonString = response.data;
      if (typeof response.data === "string") {
        jsonString = jsonString.replace(/"name":\s*("[^"]*")/, '"name": $1,');
        setInfo(JSON.parse(jsonString));
      } else {
        setInfo(jsonString);
      }
    } catch (error) {
      setError("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUri();
  }, []);

  return { info, loading, error };
};
