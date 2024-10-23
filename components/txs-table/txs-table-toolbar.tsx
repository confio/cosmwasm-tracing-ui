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
  if (
    !table.getColumn("operationName")?.getFilterValue() &&
    !table.getColumn("tags")?.getFilterValue()
  ) {
    return "empty";
  }

  if ((table.getColumn("operationName")?.getFilterValue() as string) ?? "") {
    return "custom";
  }

  const tags = table.getColumn("tags")?.getFilterValue() as
    | Map<string, string>
    | undefined;

  if (tags?.size === 1 && tags?.get("raw_tx") === "*") {
    return "simulations";
  }

  if (tags?.size === 1 && tags?.get("tx_hash") === "*") {
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
                table
                  .getColumn("tags")
                  ?.setFilterValue(new Map([["raw_tx", "*"]]));
                break;
              }
              case "broadcasted": {
                table
                  .getColumn("tags")
                  ?.setFilterValue(new Map([["tx_hash", "*"]]));
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
              <SelectItem value="simulations">Failed simulations</SelectItem>
              <SelectItem value="broadcasted">
                Broadcasted transactions
              </SelectItem>
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
