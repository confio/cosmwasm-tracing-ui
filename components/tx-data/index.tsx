"use client";

import { useTx } from "@/hooks/api";
import { sequenceDiagramFromSpans } from "@/lib/mermaid";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import Mermaid from "../mermaid";
import { Badge } from "../ui/badge";
import SpanDetails from "./span-details";
import SpansDetails from "./spans-details";

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
  const canRenderMermaid = mermaidChart !== "sequenceDiagram";
  const span = tx.spans.find((span) => span.spanId === spanIdToFind);

  return (
    <div className="flex flex-col gap-10">
      <a href={`/${txId}`}>
        <Badge className="text-lg hover:underline hover:bg-primary">
          Transaction {txId}
        </Badge>
      </a>
      {canRenderMermaid ? (
        <>
          {isFetching ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            <Mermaid chart={mermaidChart} setSpanId={setSpanIdToFind} />
          )}
          {span ? <SpanDetails span={span} /> : null}
        </>
      ) : (
        <SpansDetails spans={tx.spans} />
      )}
    </div>
  );
}
