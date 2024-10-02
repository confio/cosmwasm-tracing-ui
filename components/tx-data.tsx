"use client";

import { sequenceDiagramFromSpans } from "@/lib/mermaid";
import { Tx, TxSchema } from "@/types/txs";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import Mermaid from "./mermaid";

type TxDataProps = {
  txId: string;
  spanId: string;
};

export default function TxData({ txId, spanId }: TxDataProps) {
  const { isPending, error, data } = useQuery({
    queryKey: [`tx-${txId}`],
    queryFn: () =>
      fetch(`http://localhost:4000/api/v1/txs?traceID=${txId}`)
        .then((res) => res.json())
        .then((json) => json.txs),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const spans: Readonly<Array<Tx>> = z.array(TxSchema).parse(data);

  const mermaidChart = sequenceDiagramFromSpans(spans);

  const span = spans.find((span: Tx) => span.spanId === spanId);

  return (
    <div>
      <Mermaid chart={mermaidChart} />
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
