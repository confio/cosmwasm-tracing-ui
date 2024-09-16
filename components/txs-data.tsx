"use client";

import { Tx } from "@/types/txs";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function TxsData() {
  const { isPending, error, data } = useQuery({
    queryKey: ["txs"],
    queryFn: () => fetch("/txs.json").then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div>
      <h1>Transactions</h1>
      <ul>
        {data.txs
          .filter((tx: Tx) => !tx._source.references.length)
          .map((tx: Tx) => (
            <li key={tx._id}>
              <Link href={`/txs/${tx._source.traceID}`}>
                {tx._source.traceID} - {tx._source.operationName} -{" "}
                {
                  data.txs.filter(
                    (txToFilter: Tx) =>
                      txToFilter._source.traceID === tx._source.traceID,
                  ).length
                }{" "}
                spans - {tx._source.tags.length} tags
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
