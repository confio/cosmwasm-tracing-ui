import TxData from "@/components/tx-data";

export default function Tx({ params }: { params: { span: any[] } }) {
  const [txId, spanId] = params.span;

  return (
    <div>
      <div>Transaction {txId}</div>
      <TxData txId={txId} spanId={spanId} />
    </div>
  );
}
