"use client";

import { Box } from "@mui/material";
import { formules } from "./constants";
import Formule from "./Formule";
import { gridSx } from "./styles";
import { formatPrice, type PriceKey } from "@/hooks/server/prices";
import { usePricing } from "./PricingProvider";

export default function Formules() {
  const prices = usePricing();
  return (
    <Box sx={{ ...gridSx, mt: { xs: "30px", md: "50px" } }}>
      {formules.map((formule) => (
        <Formule
          key={formule.id}
          formule={{ ...formule, tarif: { ...formule.tarif, prix: formatPrice(prices[formule.id as PriceKey]) } }}
        />
      ))}
    </Box>
  );
}
