import { env } from "@/lib/env";
import { Tx, TxSchema } from "@/types/txs";
import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { z } from "zod";

export const useTxs = (operationName?: string, tags?: Map<string, string>) => {
  const tagsObj = tags ? Object.fromEntries(tags.entries()) : undefined;

  return useInfiniteQuery<Readonly<Array<Tx>>>({
    queryKey: ["txs", { operationName, tags: tagsObj }],
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextPageParam = Math.min(
        ...lastPage.map((trace) => trace.startTime),
      );

      return Number.isSafeInteger(nextPageParam) ? nextPageParam : undefined;
    },
    queryFn: async ({ pageParam }) => {
      const queryUrl = new URL(`${env.NEXT_PUBLIC_API_URL}/txs`);

      if (pageParam && Number.isSafeInteger(pageParam)) {
        queryUrl.searchParams.append("searchAfter", String(pageParam));
      }
      if (operationName) {
        queryUrl.searchParams.append("operationName", operationName);
      }
      if (tagsObj) {
        queryUrl.searchParams.append("tags", JSON.stringify(tagsObj));
      }

      return fetch(queryUrl)
        .then((res) => res.json())
        .then(({ txs }) => z.array(TxSchema).parse(txs));
    },
    placeholderData: keepPreviousData,
  });
};

export const useTx = (id: string) => {
  const queryClient = useQueryClient();

  return useQuery<Readonly<Tx | undefined>>({
    queryKey: ["tx", id],
    queryFn: () =>
      fetch(`${env.NEXT_PUBLIC_API_URL}/txs?traceID=${id}`)
        .then((res) => res.json())
        .then(({ txs }) => z.array(TxSchema).parse(txs).at(0)),
    placeholderData: () => {
      const cachedTxs =
        queryClient.getQueryData<Readonly<Array<Tx>>>(["txs"]) ?? [];

      const foundTx = cachedTxs.find((tx) => tx.traceId === id);
      return foundTx;
    },
  });
};
