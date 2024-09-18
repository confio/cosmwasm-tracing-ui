"use client";

import { sequenceDiagramFromSpans } from "@/lib/mermaid";
import { useQuery } from "@tanstack/react-query";
import Mermaid from "./mermaid";

type TxDataProps = {
  txId: string;
  spanId: string;
};

export default function TxData({ txId, spanId }: TxDataProps) {
  const {
    isPending,
    error,
    data: spans,
  } = useQuery({
    queryKey: [`tx-${txId}`],
    queryFn: () =>
      fetch(`http://localhost:4000/api/v1/txs?traceID=${txId}`)
        .then((res) => res.json())
        .then((json) => json.txs),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  const mermaidChart = sequenceDiagramFromSpans(spans);

  const span = spans.find((span: any) => span._source.spanID === spanId);

  return (
    <div>
      <Mermaid chart={mermaidChart} />
      {span ? <pre>{JSON.stringify(span._source.tags, null, 2)}</pre> : null}
    </div>
  );
}
