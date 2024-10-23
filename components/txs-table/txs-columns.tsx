import { Tx } from "@/types/txs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";

export const txsColumns: ColumnDef<Tx>[] = [
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Start time" />
    ),
    cell: ({ row }) => {
      const startDate = new Date(Number(row.getValue("startTime")) / 1000);
      return (
        <div className="font-mono text-xs">
          {startDate.toLocaleTimeString()}
          <br />
          {startDate.toLocaleDateString()}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "traceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trace" />
    ),
    cell: ({ row }) => {
      const traceId: string = row.getValue("traceId");
      return (
        <div className="font-mono">
          <span className="font-bold">{traceId.slice(0, 4)}</span>
          <span>{traceId.slice(4, 28)}</span>
          <span className="font-bold">{traceId.slice(28)}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "operationName",
    header: () => null,
    cell: () => null,
    //NOTE - Don't UI filter, query API
    filterFn: () => true,
    enableHiding: false,
  },
  {
    accessorKey: "tags",
    header: () => null,
    cell: () => null,
    //NOTE - Don't UI filter, query API
    filterFn: () => true,
    enableHiding: false,
  },
  {
    accessorKey: "spans",
    header: () => null,
    cell: () => null,
    filterFn: () => true,
    enableHiding: false,
  },
];
