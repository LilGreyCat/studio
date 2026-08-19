"use client";

import type { PriceMap } from "@/hooks/server/prices";
import { createContext, useContext, type ReactNode } from "react";

const PricingContext = createContext<PriceMap | null>(null);

export function PricingProvider({ prices, children }: { prices: PriceMap; children: ReactNode }) {
  return <PricingContext.Provider value={prices}>{children}</PricingContext.Provider>;
}

export function usePricing(): PriceMap {
  const prices = useContext(PricingContext);
  if (!prices) throw new Error("usePricing must be used within PricingProvider");
  return prices;
}
