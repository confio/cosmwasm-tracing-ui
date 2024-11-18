import { Span } from "@/types/txs";
import SpanDetails from "./span-details";

type SpansDetailsProps = {
  spans: readonly Span[];
};

export default function SpansDetails({ spans }: SpansDetailsProps) {
  return spans.map((span) => (
    <>
      {spans.length > 1 ? (
        <h2>
          Operation <span className="font-bold">{span.operationName}</span>{" "}
          <span className="font-mono">{span.spanId}</span>
        </h2>
      ) : null}
      <SpanDetails key={span.spanId} span={span} />
    </>
  ));
}
