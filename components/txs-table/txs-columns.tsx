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
        <div className="max-w-[500px] font-mono text-xs">
          {startDate.toLocaleTimeString() +
            " - " +
            startDate.toLocaleDateString()}
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
    cell: ({ row }) => (
      <div className="max-w-[500px] font-mono font-bold">
        {row.getValue("traceId")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "spans",
    header: () => null,
    cell: () => null,
    //NOTE - Don't UI filter, query API
    filterFn: () => true,
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
];
