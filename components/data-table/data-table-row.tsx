import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Row, flexRender } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export type RowLink = {
  url: string;
  field: string;
};

interface DataTableRowProps<TData> {
  row: Row<TData>;
  rowLink?: RowLink;
}

export function DataTableRow<TData>({
  row,
  rowLink,
}: DataTableRowProps<TData>) {
  const router = useRouter();

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      className={cn(rowLink && "hover:cursor-pointer")}
      onClick={
        rowLink
          ? () => router.push(`${rowLink.url}${row.getValue(rowLink.field)}`)
          : undefined
      }
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}
