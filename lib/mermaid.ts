type TreeNode = {
  id: string;
  parentId: string | null;
  children: Set<TreeNode>;
  span: any;
};

export function flowchartFromSpans(spans: any) {
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

  console.log({ chart, spans });

  return chart;
}

export function sequenceDiagramFromSpans(spans: any) {
  let chart = "sequenceDiagram";

  const msgSendSpan = spans.find((span: any) =>
    span._source.tags.find(
      (tag: any) => tag.key === "tx" && tag.value.includes("Bank(Send"),
    ),
  );

  if (msgSendSpan) {
    const tx = msgSendSpan._source.tags.find(
      (tag: any) => tag.key === "tx",
    ).value;

    const sender = tx.match(/sender: (\w+)/)[1];
    const recipient = tx.match(/recipient: (\w+)/)[1];

    console.log({ tx, sender, recipient });

    chart += `\n${sender}->>+${recipient}: Send`;
  }

  return chart;
}
