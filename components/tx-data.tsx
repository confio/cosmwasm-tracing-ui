"use client";

import { Tx } from "@/types/txs";
import { useQuery } from "@tanstack/react-query";
import Mermaid from "./mermaid";

type TreeNode = {
  id: string;
  parentId: string | null;
  children: Set<TreeNode>;
  span: any;
};

function mermaidFromSpans(spans: any) {
  const spanParentMap = new Map<string, string | null>();

  for (const span of spans) {
    const parentRef = span._source.references.find(
      (ref: any) => ref.refType === "CHILD_OF",
    );

    if (parentRef) {
      spanParentMap.set(span._source.spanID, parentRef.spanID);
    } else {
      spanParentMap.set(span._source.spanID, null);
    }
  }

  const spanNodes: Array<TreeNode> = Array.from(spanParentMap).map(
    ([id, parentId]) => ({
      id,
      parentId,
      children: new Set(),
      span: spans.find((span: any) => span._source.spanID === id),
    }),
  );

  for (const [spanId, parentId] of Array.from(spanParentMap)) {
    const spanNode = spanNodes.find((node) => node.id === spanId);
    const parentNode = spanNodes.find((node) => node.id === parentId);

    if (!spanNode || !parentNode) {
      continue;
    }

    parentNode.children.add(spanNode);
  }

  const sortedSpanNodes = spanNodes.toSorted((a, b) => {
    if (a.parentId === null || a.children.has(b)) {
      return -1;
    }

    if (a.parentId === b.parentId) {
      return 0;
    }

    return 1;
  });

  let chart = "flowchart TD";

  for (const node of sortedSpanNodes) {
    for (const child of Array.from(node.children)) {
      chart += `\n${node.id}[${node.span._source.operationName}] --> ${child.id}[${child.span._source.operationName}]`;
    }
  }

  for (const node of sortedSpanNodes) {
    chart += `\nclick ${node.id} "/txs/${node.span._source.traceID}/${node.id}"`;
  }

  return chart;
}

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

  const mermaidChart = mermaidFromSpans(spans);

  const span = spans.find((span: any) => span._source.spanID === spanId);

  return (
    <div>
      <Mermaid chart={mermaidChart} />
      {span ? <pre>{JSON.stringify(span._source.tags, null, 2)}</pre> : null}
    </div>
  );
}
