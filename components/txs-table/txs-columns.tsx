import { Tx } from "@/types/txs";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";

export const txsColumns: ColumnDef<Tx>[] = [
  {
    accessorKey: "traceId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trace" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] font-medium">{row.getValue("traceId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "spanId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Span" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] font-medium">{row.getValue("spanId")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "operationName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Operation" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] font-medium">
        {row.getValue("operationName")}
      </div>
    ),
    //NOTE - Don't UI filter, query API
    filterFn: () => true,
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium">
        {Array.from((row.getValue("tags") as Map<string, string>).keys()).join(
          ", ",
        )}
      </div>
    ),
    //NOTE - Don't UI filter, query API
    filterFn: () => true,
    enableHiding: false,
  },
];
