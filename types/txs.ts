import { z } from "zod";

const SpanSchema = z
  .object({
    traceId: z.string(),
    spanId: z.string(),
    parentSpanId: z.string().nullable(),
    operationName: z.string(),
    tags: z.array(z.tuple([z.string(), z.string()])),
    startTime: z.number(),
    duration: z.number(),
  })
  .transform((v) => ({ ...v, tags: new Map(v.tags) }));

export const TxSchema = z.object({
  traceId: z.string(),
  startTime: z.number(),
  spans: z.array(SpanSchema).readonly(),
});

export type Span = Readonly<z.infer<typeof SpanSchema>>;
export type Tx = Readonly<z.infer<typeof TxSchema>>;
