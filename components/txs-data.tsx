"use client";

import { useTxs } from "@/hooks/api";
import { Tx } from "@/types/txs";
import Link from "next/link";

export default function TxsData() {
  const {
    isPending,
    error,
    data: txs,
  } = useTxs("execute_tx", new Map([["tx", "*Bank(Send*"]]));

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

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
