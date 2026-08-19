import { fetchJson } from "@/utils/fetchJson";
import type { Price, PriceMap } from "../../prices";

export function getAdminPrices(): Promise<Price[]> {
  return fetchJson<Price[]>("/prices", { credentials: "include" });
}

export function updateAllPrices(prices: PriceMap): Promise<Price[]> {
  return fetchJson<Price[]>("/admin/prices", {
    method: "PUT",
    credentials: "include",
    body: JSON.stringify({
      prices: Object.entries(prices).map(([key, amount_cents]) => ({ key, amount_cents })),
    }),
  });
}
