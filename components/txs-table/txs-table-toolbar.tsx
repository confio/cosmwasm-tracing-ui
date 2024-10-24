import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { DataTableKvFilter } from "../data-table/data-table-kv-filter";
import { DataTableViewOptions } from "../data-table/data-table-view-options";

const getSelectedValue = <TData,>(table: Table<TData>) => {
  const operationName = table.getColumn("operationName")?.getFilterValue() as
    | string
    | undefined;
  const tags = table.getColumn("tags")?.getFilterValue() as
    | Map<string, string>
    | undefined;

  if (!operationName && !tags) {
    return "empty";
  }

  if (
    operationName === "query" &&
    tags?.size === 1 &&
    tags?.get("request") === "*Bank(Send*"
  ) {
    return "simulations";
  }

  if (
    operationName === "execute_tx" &&
    tags?.size === 1 &&
    tags?.get("tx") === "*Wasm(*"
  ) {
    return "broadcasted";
  }

  return "custom";
};

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={getSelectedValue(table)}
          onValueChange={(value) => {
            switch (value) {
              case "simulations": {
                table.getColumn("operationName")?.setFilterValue("query");
                table
                  .getColumn("tags")
                  ?.setFilterValue(new Map([["request", "*Bank(Send*"]]));
                break;
              }
              case "broadcasted": {
                table.getColumn("operationName")?.setFilterValue("execute_tx");
                table
                  .getColumn("tags")
                  ?.setFilterValue(new Map([["tx", "*Wasm(*"]]));
                break;
              }
              default: {
                table.resetColumnFilters();
              }
            }
          }}
        >
          <SelectTrigger className="w-[220px] h-[32px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filters</SelectLabel>
              <SelectItem
                value="empty"
                className="hidden"
                disabled
                aria-disabled
              >
                Empty filter
              </SelectItem>
              <SelectItem
                value="custom"
                className="hidden"
                disabled
                aria-disabled
              >
                Custom filter
              </SelectItem>
              <SelectItem value="simulations">Sim. Bank Send</SelectItem>
              <SelectItem value="broadcasted">Execute WASM tx</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder="Filter operation…"
          value={
            (table.getColumn("operationName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("operationName")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("tags") && (
          <DataTableKvFilter column={table.getColumn("tags")} title="Tag" />
        )}
        {table.getState().columnFilters.length > 0 && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
