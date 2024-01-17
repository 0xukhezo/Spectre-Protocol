// React
import { useEffect, useState } from "react";
// Graph
import { client, Graph } from "../pages/api/Graph";

export const useFetchLoans = (filter: string) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchLoans() {
    const queryBody = `query MyQuery {
        loans${filter} {
            activeLoan
            amountRequest
            amountWithdraw
            deadline
            id
            loanDuration
            nft {
                collection {
                    id
                    name
                    symbol
                }
                id
                uri
            }
            rewards
            tokenRequest
            tokenToBorrow
            supplier
            chainSelector
            user {
                id
            }  
            slot {
                id
            }
        }
    }`;

    try {
      let response = await client.query({ query: Graph(queryBody) });
      setLoading(false);
      setLoans(response.data.loans);
    } catch (err) {
      setLoading(false);
      console.log({ err });
    }
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  return { loans, loading };
};
