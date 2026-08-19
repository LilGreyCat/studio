"use client";

import { getPrices, defaultPrices, toPriceMap, type PriceMap } from "@/hooks/server/prices";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const PricingContext = createContext<PriceMap>(defaultPrices);

export function PricingProvider({ children }: { children: ReactNode }) {
  const [prices, setPrices] = useState(defaultPrices);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getPrices().then((items) => setPrices(toPriceMap(items))).catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return <PricingContext.Provider value={prices}>{children}</PricingContext.Provider>;
}

export function usePricing(): PriceMap { return useContext(PricingContext); }
