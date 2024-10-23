import TxData from "@/components/tx-data";
import TxSheet from "@/components/tx-data/tx-sheet";

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
    <TxSheet>
      <TxData txId={txId} spanId={spanId} />
    </TxSheet>
  );
}
