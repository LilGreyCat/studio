"use client";

import { GlassySurface } from "@/components/ui";
import { Box, Typography } from "@mui/material";
import {
  contactLinkSx,
  descSx,
  prixSx,
  surfaceSx,
  tarifSx,
  titreSx,
  unitSx,
} from "./styles";

import { formatPrice } from "@/hooks/server/prices";
import Link from "next/link";
import { usePricing } from "./PricingProvider";

export default function Live() {
  const prices = usePricing();
  return (
    <Box sx={liveGridSx}>
      <GlassySurface sx={surfaceSx}>
        <Box>
          <Box
            component="img"
            src="/icons/setup.svg"
            alt="Setup"
            sx={{ width: "35px", height: "35px" }}
          />

          <Typography sx={titreSx} gutterBottom>
            SETUP LIVE
          </Typography>
        </Box>

        <Box sx={tarifSx}>
          <Typography variant="body1" sx={prixSx}>
            {formatPrice(prices.live_setup)}
          </Typography>

          <Typography variant="body1" sx={unitSx}>
            / heure
          </Typography>
        </Box>

        <Typography variant="body1" sx={descSx}>
          Répétition + Préparation de set
        </Typography>
        <Box component={Link} href="/contact?services=live" sx={contactLinkSx}>
          Choisir
        </Box>
      </GlassySurface>

      <GlassySurface sx={surfaceSx}>
        <Box>
          <Box
            component="img"
            src="/icons/live.svg"
            alt="Live"
            sx={{ width: "35px", height: "35px" }}
          />

          <Typography sx={titreSx} gutterBottom>
            LIVE
          </Typography>
        </Box>

        <Box sx={tarifSx}>
          <Typography variant="body1" sx={prixSx}>
            {formatPrice(prices.live_performance)}
          </Typography>

          <Typography variant="body1" sx={unitSx}>
            / prestation
          </Typography>
        </Box>

        <Typography variant="body1" sx={descSx}>
          Concert
        </Typography>
        <Box component={Link} href="/contact?services=live" sx={contactLinkSx}>
          Choisir
        </Box>
      </GlassySurface>
    </Box>
  );
}

const liveGridSx = {
  display: "grid",
  width: "100%",
  height: "fit-content",
  mt: { xs: "30px", md: "50px" },
  gap: 3,
  justifyItems: "stretch",
  alignItems: "center",
  gridTemplateColumns: {
    sm: "repeat(2, 1fr)",
  },
};
