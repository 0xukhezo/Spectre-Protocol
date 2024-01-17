// React
import { useEffect, useState } from "react";
// Graph
import { client, Graph } from "../pages/api/Graph";

export const useFetchLoans = (filter: string) => {
  const [loans, setLoans] = useState<any[]>([]);

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
        }
    }`;

    try {
      let response = await client.query({ query: Graph(queryBody) });

      setLoans(response.data.loans);
    } catch (err) {
      console.log({ err });
    }
  }

  useEffect(() => {
    fetchLoans();
  }, []);

  return loans;
};
