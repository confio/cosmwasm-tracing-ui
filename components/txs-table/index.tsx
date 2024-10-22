"use client";

import { useTxs } from "@/hooks/api";
import { useDebounce } from "@/hooks/use-debounce";
import { getFiltersFromParams, setParamsFromFilters } from "@/lib/params";
import { Span, Tx } from "@/types/txs";
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
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DataTable } from "../data-table";
import { DataTableColumnHeader } from "../data-table/data-table-column-header";
import { DataTablePagination } from "../data-table/data-table-pagination";
import { Button } from "../ui/button";
import { txsColumns } from "./txs-columns";
import { DataTableToolbar } from "./txs-table-toolbar";

export function TxsTable() {
  const params = useSearchParams();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    tags: false,
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    getFiltersFromParams(params),
  );
  const [sorting, setSorting] = useState<SortingState>([]);

  const operationNameValue = columnFilters.find(
    (filter) => filter.id === "operationName",
  )?.value;
  const operationName = useDebounce(
    typeof operationNameValue === "string" && operationNameValue.length
      ? operationNameValue
      : "",
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
        <div className="max-w-[400px] truncate font-medium">
          {Array.from(
            new Set(
              (row.getValue("spans") as readonly Span[])
                .map((span) => span.tags.get(tagKey))
                .filter((span) => !!span),
            ),
          ).join(" | ")}
        </div>
      ),
      //NOTE - Don't UI filter, query API
      filterFn: () => true,
      enableSorting: false,
    }),
  );

  const columns = [...txsColumns, ...tagsColumns];

  const {
    isPending,
    error,
    data: queriedData,
    fetchNextPage,
  } = useTxs(operationName, tags);

  const data = useMemo(
    () => (queriedData?.pages.flatMap((v) => v) ?? []) as Tx[],
    [queriedData?.pages],
  );

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

  useEffect(() => {
    table.setPageSize(15);
  }, [table]);

  useEffect(() => {
    setParamsFromFilters(columnFilters);
  }, [columnFilters]);

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
      <div className="flex items-center justify-between flex-wrap">
        {/* NOTE - this is a hack to center the "Load more" Button below */}
        <div className="invisible">
          <DataTablePagination table={table} />
        </div>
        <Button variant="outline" onClick={() => fetchNextPage()}>
          Load more
        </Button>
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
