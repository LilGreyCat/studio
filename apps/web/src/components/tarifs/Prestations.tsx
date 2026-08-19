"use client";

import Prestation from "@/components/tarifs/Prestation";
import { Box } from "@mui/material";
import { prestations } from "./constants";
import { gridSx } from "./styles";
import { formatPrice, type PriceKey } from "@/hooks/server/prices";
import { usePricing } from "./PricingProvider";

export default function Prestations() {
  const prices = usePricing();
  return (
    <Box sx={{ ...gridSx, my: { xs: "30px", md: "50px" } }}>
      {prestations.map((prestation) => (
        <Prestation
          key={prestation.key}
          prestation={{ ...prestation, tarif: { ...prestation.tarif, prix: formatPrice(prices[prestation.id as PriceKey]) } }}
        />
      ))}
    </Box>
  );
}
