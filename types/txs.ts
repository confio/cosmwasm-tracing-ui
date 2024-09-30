import { z } from "zod";

export const TxSchema = z
  .object({
    _id: z.string(),
    _source: z.object({
      traceID: z.string(),
      spanID: z.string(),
      operationName: z.string(),
      references: z.array(
        z.object({
          refType: z.string(),
          traceID: z.string(),
          spanID: z.string(),
        }),
      ),
      tags: z.array(
        z.object({ key: z.string(), type: z.string(), value: z.string() }),
      ),
    }),
  })
  .transform((v) => ({
    //NOTE - Using _id for React keyprop for now since I found different spans with same spanId
    _id: v._id,
    traceId: v._source.traceID,
    spanId: v._source.spanID,
    operationName: v._source.operationName,
    parentSpanId:
      v._source.references.find(
        (ref) =>
          ref.traceID === v._source.traceID && ref.refType === "CHILD_OF",
      )?.spanID ?? null,
    tags: new Map(v._source.tags.map(({ key, value }) => [key, value])),
  }));

export type Tx = Readonly<z.infer<typeof TxSchema>>;
