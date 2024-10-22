import TxData from "@/components/tx-data";

export default function Tx({
  params,
}: {
  params: { span: [string, string | undefined] };
}) {
  const [txId, spanId] = params.span;

  return <TxData txId={txId} spanId={spanId} />;
}
