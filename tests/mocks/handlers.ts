import { env } from "@/lib/env";
import { http, HttpResponse } from "msw";
import txsJson from "./data/txs.json";

export const mockHandlers = [
  http.get(`${env.NEXT_PUBLIC_API_URL}/txs`, () => HttpResponse.json(txsJson)),
];
