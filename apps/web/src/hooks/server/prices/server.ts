import "server-only";

import type { Price } from "./types";

const internalAPIURL =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080";

export async function getServerPrices(): Promise<Price[]> {
  const response = await fetch(new URL("/prices", internalAPIURL), {
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    throw new Error(`Price API returned ${response.status}`);
  }
  return response.json() as Promise<Price[]>;
}
