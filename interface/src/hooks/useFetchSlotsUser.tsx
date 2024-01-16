// React
import { useEffect, useState } from "react";
// Graph
import { client, Graph } from "../pages/api/Graph";

export const useFetchSlotsUser = (filter: string) => {
  const [slots, setSlots] = useState<any[]>([]);

  async function fetchPools() {
    const queryBody = `query MyQuery {
      slotUsers${filter} {
        id
        user {
          id
        }
        loan {
          id
        }
      }
    }`;

    try {
      let response = await client.query({ query: Graph(queryBody) });
      setSlots(response.data.slotUsers);
    } catch (err) {
      console.log({ err });
    }
  }

  useEffect(() => {
    fetchPools();
  }, []);

  return slots;
};
