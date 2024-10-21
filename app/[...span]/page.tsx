import TxData from "@/components/tx-data";

export default function Tx({
  params,
}: {
  params: { span: [string, string | undefined] };
}) {
  const [txId, spanId] = params.span;

  return (
    <div>
      <div>Transaction {txId}</div>
      <TxData txId={txId} spanId={spanId} />
    </div>
  );
}
