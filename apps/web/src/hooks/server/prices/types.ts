export const priceKeys = [
  "recording", "mixing", "mastering", "live_setup",
  "live_performance", "single", "ep", "album",
] as const;

export type PriceKey = (typeof priceKeys)[number];
export type Price = { key: PriceKey; amount_cents: number; updated_at: string };
export type PriceMap = Record<PriceKey, number>;

export function toPriceMap(prices: Price[]): PriceMap {
  const expected = new Set<string>(priceKeys);
  const result = new Map<PriceKey, number>();
  for (const price of prices) {
    if (!expected.has(price.key) || result.has(price.key)) {
      throw new Error("Invalid price response");
    }
    if (!Number.isSafeInteger(price.amount_cents) || price.amount_cents < 0) {
      throw new Error("Invalid price amount");
    }
    result.set(price.key, price.amount_cents);
  }
  if (result.size !== priceKeys.length) {
    throw new Error("Incomplete price response");
  }
  return Object.fromEntries(result) as PriceMap;
}

export function formatPrice(amountCents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", minimumFractionDigits: amountCents % 100 ? 2 : 0,
  }).format(amountCents / 100);
}
