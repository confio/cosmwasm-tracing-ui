import { TxsTable } from "@/components/txs-table";

export default async function Txs() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <h2 className="text-2xl font-bold tracking-tight">CosmWasm Tracing UI</h2>
      <TxsTable />
    </div>
  );
}
