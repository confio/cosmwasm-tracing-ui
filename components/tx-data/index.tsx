"use client";

import { useTx } from "@/hooks/api";
import { sequenceDiagramFromSpans } from "@/lib/mermaid";
import { useState } from "react";
import Mermaid from "../mermaid";
import { Badge } from "../ui/badge";

type TxDataProps = {
  txId: string;
  spanId: string | undefined;
};

export default function TxData({ txId, spanId }: TxDataProps) {
  const { isPending, isFetching, error, data: tx } = useTx(txId);
  const [spanIdToFind, setSpanIdToFind] = useState(spanId);

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  if (!tx) return "Couldn't find a Tx with id: " + txId;

  const mermaidChart = sequenceDiagramFromSpans(tx.spans);
  const span = tx.spans.find((span) => span.spanId === spanIdToFind);

  return (
    <div className="flex flex-col gap-10">
      <a href={`/${txId}`}>
        <Badge className="text-lg hover:underline hover:bg-primary">
          Transaction {txId}
        </Badge>
      </a>
      {!isFetching ? (
        <Mermaid chart={mermaidChart} setSpanId={setSpanIdToFind} />
      ) : null}
      {span ? (
        <pre>
          {JSON.stringify(
            Object.fromEntries(Array.from(span.tags).sort()),
            null,
            2,
          )}
        </pre>
      ) : null}
    </div>
  );
}
