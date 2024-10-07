"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DataTableKvButton } from "./data-table-kv-button";

interface DataTableKvFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableKvFilter<TData, TValue>({
  column,
  title,
}: DataTableKvFilterProps<TData, TValue>) {
  const [open, setOpen] = useState(false);
  const [kvKey, setKvKey] = useState("");
  const [kvValue, setKvValue] = useState("");

  const filteredKeys = Array.from(
    (column?.getFilterValue() as Map<string, string>)?.keys() ?? new Map(),
  ).sort();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex flex-wrap gap-2">
        {filteredKeys.map((filteredKey) => (
          <DataTableKvButton
            key={filteredKey}
            column={column}
            filteredKey={filteredKey}
          />
        ))}
        <Separator orientation="vertical" className="mx-2 h-8" />
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            {title}
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              New {column?.id} filter
            </h4>
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
                  value={kvKey}
                  onChange={({ target }) => {
                    setKvKey(target.value);
                  }}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth">Value</Label>
                <Input
                  id="value"
                  className="col-span-2 h-8"
                  value={kvValue}
                  onChange={({ target }) => {
                    setKvValue(target.value);
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <PopoverClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="col-start-2"
                >
                  Cancel
                </Button>
              </PopoverClose>
              <Button
                type="submit"
                disabled={!kvKey || !kvValue}
                onClick={() => {
                  column?.setFilterValue(
                    (kvs: Map<string, string> | undefined) => {
                      if (kvs) {
                        return kvs.set(kvKey, kvValue);
                      } else {
                        return new Map([[kvKey, kvValue]]);
                      }
                    },
                  );
                  setOpen(false);
                  setKvKey("");
                  setKvValue("");
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
