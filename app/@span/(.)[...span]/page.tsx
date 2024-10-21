import TxData from "@/components/tx-data";
const traceIdLength = 32;

export default function Tx({ params }: { params: { span: [string] } }) {
  //NOTE - the params are parsed because this catch-all route merges both traceId and spanId
  const [txId, spanId] =
    params.span[0].length > traceIdLength
      ? [
          params.span[0].slice(0, traceIdLength),
          params.span[0].slice(traceIdLength),
        ]
      : [params.span[0]];

  return (
    <Sheet defaultOpen>
      <SheetContent className="min-w-[80%]">
        <div>
          <div>Transaction {txId}</div>
          <TxData txId={txId} spanId={spanId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
