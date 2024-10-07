import TxData from "@/components/tx-data";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export default function Tx({ params }: { params: { span: string[] } }) {
  const [txId, spanId] = params.span;

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
