import JsonTreeViewer from "@/lib/json-tree";
import { getParsedSpanMap } from "@/lib/parse-span";
import { cn } from "@/lib/utils";
import { Span } from "@/types/txs";
import { Table, TableBody, TableCell, TableRow } from "../ui/table";

type SpanDetailsProps = {
  span: Span;
};

export default function SpanDetails({ span }: SpanDetailsProps) {
  const parsedSpan = getParsedSpanMap(span);

  return (
    <div className="flex flex-col gap-10 w-full max-w-[900px] mx-auto">
      <div className="flex flex-col gap-4">
        <h2>Relevant operation info:</h2>
        <Table>
          <TableBody>
            {Array.from(parsedSpan.entries()).map(([key, value], i) => (
              <TableRow
                key={i}
                className={cn(i % 2 === 0 && "bg-card hover:bg-card")}
              >
                <TableCell>{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4">
        <h2>Full operation info:</h2>
        <JsonTreeViewer data={span} />
      </div>
    </div>
  );
}
