"use client";

import { useTxs } from "@/hooks/api";
import { useDebounce } from "@/hooks/use-debounce";
import { Tx } from "@/types/txs";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { txsColumns } from "./txs-columns";
import { DataTableToolbar } from "./txs-table-toolbar";

export function TxsTable() {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    tags: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const operationNameValue = columnFilters.find(
    (filter) => filter.id === "operationName",
  )?.value;
  const operationName = useDebounce(
    typeof operationNameValue === "string" && operationNameValue.length
      ? operationNameValue
      : "execute_tx",
  );

  const tags =
    (columnFilters.find((filter) => filter.id === "tags")?.value as
      | Map<string, string>
      | undefined) ?? undefined;

  const tagsColumns: ColumnDef<Tx>[] = Array.from(tags?.keys() ?? []).map(
    (tagKey) => ({
      accessorKey: tagKey,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={tagKey} />
      ),
      cell: ({ row }) => (
        <div className="max-w-[500px] truncate font-medium">
          {(row.getValue("tags") as Map<string, string>).get(tagKey)}
        </div>
      ),
      //NOTE - Don't UI filter, query API
      filterFn: () => true,
    }),
  );

  const columns = [...txsColumns, ...tagsColumns];

  const { isPending, error, data: txs } = useTxs(operationName, tags);
  const data = (txs ?? []) as Tx[];

  const table = useReactTable({
    columns,
    data,
    state: { columnVisibility, columnFilters, sorting },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <DataTable
          status={{ isPending, error }}
          table={table}
          rowLink={{ url: "/", field: "traceId" }}
        />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
