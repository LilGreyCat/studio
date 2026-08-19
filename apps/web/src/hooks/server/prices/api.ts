import { fetchJson } from "@/utils/fetchJson";
import type { Price } from "./types";

export function getPrices(): Promise<Price[]> {
  return fetchJson<Price[]>("/prices");
}
