// React
import { useEffect, useState } from "react";
// Graph
import { client, Graph } from "../pages/api/Graph";

export const useFetchHistoryUser = (filter: string) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchHistory() {
    const queryBody = `query MyQuery {
        user${filter} {
            historial {
                activeLoan
                amountRequest
                completedSuccessfully
                loanDuration
                rewards
                deadline
                tokenRequest
                supplier
                nft {
                    uri
                }
            }
        }
    }`;

    try {
      let response = await client.query({ query: Graph(queryBody) });

      setLoading(false);
      setHistory(response.data.user.historial);
    } catch (err) {
      setLoading(false);
      console.log({ err });
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return { history, loading };
};
