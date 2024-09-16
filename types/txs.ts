export type Tx = {
  _id: string;
  _source: {
    traceID: string;
    spanID: string;
    operationName: string;
    references: Array<{ refType: string; traceID: string; spanID: string }>;
    tags: Array<{ key: string; type: string; value: string }>;
  };
};
