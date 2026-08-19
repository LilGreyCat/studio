export const priceKeys = [
  "recording", "mixing", "mastering", "live_setup",
  "live_performance", "single", "ep", "album",
] as const;

export type PriceKey = (typeof priceKeys)[number];
export type Price = { key: PriceKey; amount_cents: number; updated_at: string };
export type PriceMap = Record<PriceKey, number>;

export const defaultPrices: PriceMap = {
  recording: 3000,
  mixing: 4000,
  mastering: 2000,
  live_setup: 1000,
  live_performance: 10000,
  single: 10000,
  ep: 8000,
  album: 6000,
};

export function toPriceMap(prices: Price[]): PriceMap {
  return prices.reduce(
    (result, price) => ({ ...result, [price.key]: price.amount_cents }),
    { ...defaultPrices }
  );
}

export function formatPrice(amountCents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: "EUR", minimumFractionDigits: amountCents % 100 ? 2 : 0,
  }).format(amountCents / 100);
}
