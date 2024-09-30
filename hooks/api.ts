"use client";

import { Tx, TxSchema } from "@/types/txs";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

//TODO - use an envfile
const API_URL = "http://localhost:4000/api/v1";

export const useTxs = (operationName?: string, tags?: Map<string, string>) => {
  const tagsObj = tags ? Object.fromEntries(tags.entries()) : undefined;

  const params = new URLSearchParams();
  if (operationName) {
    params.append("operationName", operationName);
  }
  if (tagsObj) {
    params.append("tags", JSON.stringify(tagsObj));
  }

  return useQuery<Readonly<Array<Tx>>>({
    queryKey: ["txs", { operationName, tags: tagsObj }],
    queryFn: () =>
      fetch(`${API_URL}/txs${params.size ? `?${params.toString()}` : ""}`)
        .then((res) => res.json())
        .then(({ txs }) => z.array(TxSchema).parse(txs)),
    placeholderData: keepPreviousData,
  });
};

export const useTx = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery<Readonly<Array<Tx>>>({
    queryKey: ["tx", id],
    queryFn: () =>
      fetch(`${API_URL}/txs?traceID=${id}`)
        .then((res) => res.json())
        .then(({ txs }) => z.array(TxSchema).parse(txs)),
    placeholderData: () => {
      const cachedTxs =
        queryClient.getQueryData<Readonly<Array<Tx>>>(["txs"]) ?? [];

      const foundTx = cachedTxs.filter((tx) => tx.traceId === id);
      return foundTx;
    },
  });
};
