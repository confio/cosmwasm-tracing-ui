import { Span } from "@/types/txs";

type Operation = {
  label: string;
  isQuery: boolean;
  sender: string;
  recipient: string;
  traceId: string;
  spanId: string;
};

export const getActorsFromOperations = (
  operations: readonly Operation[],
): readonly string[] =>
  Array.from(
    new Set(
      operations.flatMap((operation) => [
        operation.sender,
        operation.recipient,
      ]),
    ),
  );

export const getOperationsFromSpans = (
  spans: Readonly<Array<Span>>,
): readonly Operation[] =>
  spans
    .map((span) => {
      const txRon =
        span.tags.get("request") || span.tags.get("msg") || span.tags.get("tx");
      if (!txRon) {
        return null;
      }

      switch (true) {
        case txRon.includes("Bank(Send"): {
          return parseActorFromBankSendRon(txRon, span);
        }
        //NOTE - Avoids showing both execute_tx and sm.process_msg for wasm queries
        case txRon.includes("Wasm(") &&
          span.operationName === "sm.process_msg": {
          return null;
        }
        case txRon.includes("Wasm(StoreCode"): {
          return parseActorFromWasmStoreCodeRon(txRon, span);
        }
        case txRon.includes("Wasm(Instantiate"): {
          return parseActorFromWasmInstantiateRon(txRon, span);
        }
        case txRon.includes("Wasm(Migrate"): {
          return parseActorFromWasmMigrateRon(txRon, span);
        }
        case txRon.includes("Wasm(Execute"): {
          return parseActorFromWasmExecuteRon(txRon, span);
        }
        case txRon.includes("Wasm(UpdateAdmin"): {
          return parseActorFromWasmUpdateAdminRon(txRon, span);
        }
        default: {
          return null;
        }
      }
    })
    .filter((operation): operation is Operation => !!operation);

const parseActorFromBankSendRon = (
  bankSendRon: string,
  { traceId, spanId }: Span,
): Operation | null => {
  const sender = bankSendRon.match(/sender: (\w+)/)?.[1];
  const recipient = bankSendRon.match(/recipient: (\w+)/)?.[1];

  if (!sender || !recipient) {
    return null;
  }

  const isSimulation = bankSendRon.includes("Simulate(");

  return {
    label: isSimulation ? "💻🏦 Send" : "🏦 Send",
    isQuery: isSimulation,
    sender,
    recipient,
    traceId,
    spanId,
  };
};

const parseActorFromWasmStoreCodeRon = (
  wasmStoreCodeRon: string,
  { traceId, spanId }: Span,
): Operation | null => {
  const sender = wasmStoreCodeRon.match(/sender: (\w+)/)?.[1];

  if (!sender) {
    return null;
  }

  const isSimulation = wasmStoreCodeRon.includes("Simulate(");

  return {
    label: isSimulation ? "💻🕸 Store code" : "🕸 Store code",
    isQuery: isSimulation,
    sender,
    recipient: sender,
    traceId,
    spanId,
  };
};

const parseActorFromWasmInstantiateRon = (
  wasmInstantiateRon: string,
  { traceId, spanId }: Span,
): Operation | null => {
  const sender = wasmInstantiateRon.match(/sender: (\w+)/)?.[1];

  if (!sender) {
    return null;
  }

  const isSimulation = wasmInstantiateRon.includes("Simulate(");

  return {
    label: isSimulation ? "💻🕸 Instantiate" : "🕸 Instantiate",
    isQuery: isSimulation,
    sender,
    recipient: sender,
    traceId,
    spanId,
  };
};

const parseActorFromWasmMigrateRon = (
  wasmMigrateRon: string,
  { traceId, spanId }: Span,
): Operation | null => {
  const sender = wasmMigrateRon.match(/sender: (\w+)/)?.[1];

  if (!sender) {
    return null;
  }

  const isSimulation = wasmMigrateRon.includes("Simulate(");

  return {
    label: isSimulation ? "💻🕸 Migrate" : "🕸 Migrate",
    isQuery: isSimulation,
    sender,
    recipient: sender,
    traceId,
    spanId,
  };
};

const parseActorFromWasmExecuteRon = (
  wasmExecuteRon: string,
  { traceId, spanId }: Span,
): Operation | null => {
  const sender = wasmExecuteRon.match(/sender: (\w+)/)?.[1];
  const contractAddr = wasmExecuteRon.match(/contract_addr: (\w+)/)?.[1];

  if (!sender || !contractAddr) {
    return null;
  }

  const isSimulation = wasmExecuteRon.includes("Simulate(");

  return {
    label: isSimulation ? "💻🕸 Execute" : "🕸 Execute",
    isQuery: isSimulation,
    sender,
    recipient: contractAddr,
    traceId,
    spanId,
  };
};

const parseActorFromWasmUpdateAdminRon = (
  wasmUpdateAdminRon: string,
  { traceId, spanId }: Span,
): Operation | null => {
  const sender = wasmUpdateAdminRon.match(/sender: (\w+)/)?.[1];
  const contractAddr = wasmUpdateAdminRon.match(/contract_addr: (\w+)/)?.[1];

  if (!sender || !contractAddr) {
    return null;
  }

  const isSimulation = wasmUpdateAdminRon.includes("Simulate(");

  return {
    label: isSimulation ? "💻🕸 Update admin" : "🕸 Update admin",
    isQuery: isSimulation,
    sender,
    recipient: contractAddr,
    traceId,
    spanId,
  };
};
