"use client";

import { Tx, TxSchema } from "@/types/txs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { z } from "zod";

export default function TxsData() {
  const { isPending, error, data } = useQuery({
    queryKey: ["txs"],
    queryFn: () =>
      fetch(
        `http://localhost:4000/api/v1/txs?operationName=execute_tx&tags=${encodeURIComponent('{"tx":"*Bank(Send*"}')}`,
      )
        .then((res) => res.json())
        .then((json) => json.txs),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const txs: Readonly<Array<Tx>> = z.array(TxSchema).parse(data);

  return (
    <div>
      <h1>Transactions</h1>
      <ul>
        {txs.map((tx) => (
          <li key={tx._id}>
            <Link href={`/txs/${tx.traceId}`}>
              {tx.traceId} - {tx.operationName} -{" "}
              {
                txs.filter(
                  (txToFilter: Tx) => txToFilter.traceId === tx.traceId,
                ).length
              }{" "}
              spans - {tx.tags.size} tags
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
