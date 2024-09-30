"use client";

import { useTx } from "@/hooks/api";
import { sequenceDiagramFromSpans } from "@/lib/mermaid";
import { Tx } from "@/types/txs";
import Mermaid from "./mermaid";

type TxDataProps = {
  txId: string;
  spanId: string;
};

export default function TxData({ txId, spanId }: TxDataProps) {
  const { isPending, isFetching, error, data: spans } = useTx(txId);

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  const mermaidChart = sequenceDiagramFromSpans(spans);

  const span = spans.find((span: Tx) => span.spanId === spanId);

  return (
    <div>
      {!isFetching ? <Mermaid chart={mermaidChart} /> : null}
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
