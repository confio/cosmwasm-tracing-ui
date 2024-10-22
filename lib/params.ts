import { ColumnFiltersState } from "@tanstack/react-table";
import { ReadonlyURLSearchParams } from "next/navigation";

export const getFiltersFromParams = (params: ReadonlyURLSearchParams) => {
  let filters: ColumnFiltersState = [];

  const operationName = params.get("operationName");
  operationName && filters.push({ id: "operationName", value: operationName });

  const tags = params.get("tags");
  if (tags) {
    try {
      const tagsMap: Map<string, string> = new Map(JSON.parse(tags));
      filters.push({ id: "tags", value: tagsMap });
    } catch {}
  }

  return filters;
};

export const setParamsFromFilters = (filters: ColumnFiltersState) => {
  const params = new URLSearchParams();

  const operationName =
    (filters.find((filter) => filter.id === "operationName")?.value as
      | string
      | undefined) ?? undefined;

  const tags =
    (filters.find((filter) => filter.id === "tags")?.value as
      | Map<string, string>
      | undefined) ?? undefined;

  operationName
    ? params.set("operationName", operationName)
    : params.delete("operationName");
  tags
    ? params.set("tags", JSON.stringify(Array.from(tags)))
    : params.delete("tags");

  window.history.replaceState(null, "", `?${params.toString()}`);
};
