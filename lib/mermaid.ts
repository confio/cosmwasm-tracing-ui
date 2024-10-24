import { Span } from "@/types/txs";
import { getAddressType } from "./chain";
import { getActorsFromOperations, getOperationsFromSpans } from "./parse-ron";

type TreeNode = {
  id: string;
  parentId: string | null;
  children: Set<TreeNode>;
  span: Span;
};

export function flowchartFromSpans(spans: Readonly<Array<Span>>) {
  const spanParentMap = new Map<string, string | null>();

  for (const span of spans) {
    spanParentMap.set(span.spanId, span.parentSpanId);
  }

  const spanNodes: Array<TreeNode> = Array.from(spanParentMap).map(
    ([id, parentId]) => ({
      id,
      parentId,
      children: new Set(),
      span: spans.find((span) => span.spanId === id)!,
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
      chart += `\n${node.id}[${node.span.operationName}] --> ${child.id}[${child.span.operationName}]`;
    }
  }

  for (const node of sortedSpanNodes) {
    chart += `\nclick ${node.id} "/${node.span.traceId}/${node.id}"`;
  }

  return chart;
}

export function sequenceDiagramFromSpans(spans: Readonly<Array<Span>>) {
  let chart = "sequenceDiagram";

  const operations = getOperationsFromSpans(spans);
  const actors = getActorsFromOperations(operations);

  for (const actor of actors) {
    chart += `\n${getActorBox(actor)}`;
  }

  for (const operation of operations) {
    const { label, isQuery, sender, recipient, traceId, spanId } = operation;
    chart += `\n${sender}${isQuery ? "-" : ""}->>+${recipient}: <a href="/${traceId}/${spanId}">${label}</a>`;
  }

  return chart;
}

const getActorBox = (address: string) => {
  switch (getAddressType(address)) {
    case "account": {
      return `actor ${address}`;
    }
    case "contract": {
      return `participant ${address} as 📜 ${address}`;
    }
    case "validator": {
      return `participant ${address} as 📋 ${address}`;
    }
    default:
      return "";
  }
};
