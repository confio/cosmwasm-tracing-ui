"use client";

import { useQuery } from "@tanstack/react-query";

type Trace = {
  traceID: string;
};

export default function TracesData() {
  const { isPending, error, data } = useQuery({
    queryKey: ["tracesData"],
    queryFn: () => fetch("/traces.json").then((res) => res.json()),
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  console.log({ data });

  return (
    <div>
      <h1>Traces</h1>
      <ul>
        {data.data.map((trace: Trace) => (
          <li key={trace.traceID}>{trace.traceID}</li>
        ))}
      </ul>
    </div>
  );
}
