"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface DataTableKvButtonProps<TData, TValue> {
  column?: Column<TData, TValue>;
  filteredKey: string;
}

export function DataTableKvButton<TData, TValue>({
  column,
  filteredKey,
}: DataTableKvButtonProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [filteredValue, setFilteredValue] = useState(
    (column?.getFilterValue() as Map<string, string>).get(filteredKey) || "",
  );

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        setFilteredValue(
          (column?.getFilterValue() as Map<string, string>).get(filteredKey) ||
            "",
        );
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          {filteredKey}
          <Pencil2Icon className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" forceMount>
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter {filteredKey}</h4>
          </div>
          <form
            className="space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Key</Label>
                <Input
                  id="key"
                  className="col-span-2 h-8"
                  defaultValue={filteredKey}
                  disabled
                  aria-disabled
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Value</Label>
                <Input
                  id="value"
                  className="col-span-2 h-8"
                  value={filteredValue}
                  onChange={({ target }) => {
                    setFilteredValue(target.value);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  column?.setFilterValue(
                    (kvs: Map<string, string> | undefined) => {
                      if (kvs) {
                        const newKvs = kvs;
                        newKvs.delete(filteredKey);
                        return newKvs.size > 0 ? newKvs : undefined;
                      }
                    },
                  );
                  setOpen(false);
                }}
              >
                Remove
              </Button>
              <PopoverClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </PopoverClose>
              <Button
                type="submit"
                disabled={!filteredValue}
                onClick={() => {
                  column?.setFilterValue(
                    (kvs: Map<string, string> | undefined) => {
                      if (kvs) {
                        return kvs.set(filteredKey, filteredValue);
                      } else {
                        return new Map([[filteredKey, filteredValue]]);
                      }
                    },
                  );
                  setOpen(false);
                }}
              >
                Filter
              </Button>
            </div>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
