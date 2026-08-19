import { GlassySurface, MainLogo } from "@/components/ui";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Shop",
  description: "Découvrez le shop de Nhadès Records.",
};

export default function Shop() {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "55vh", md: "65vh" },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        pb: 5,
      }}
    >
      <MainLogo marginBottom={4} />

      <GlassySurface
        animatedBorder
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 960,
          minHeight: { xs: 480, sm: 560 },
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          textAlign: "center",
        }}
      >
        <Image
          src="/MOOD_BOARD_1.png"
          alt="Aperçu de la future collection Nhadès Records"
          fill
          sizes="(max-width: 960px) 100vw, 960px"
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />

        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,.02) 35%, rgba(0,0,0,.9) 100%)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            px: { xs: 3, sm: 6 },
            pt: 10,
            pb: { xs: 4, sm: 5 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography
            component="p"
            sx={{
              mb: 1.5,
              color: "rgba(255,255,255,.72)",
              fontSize: ".75rem",
              fontWeight: 700,
              letterSpacing: ".2em",
              textTransform: "uppercase",
            }}
          >
            Nhadès Records — Première collection
          </Typography>

          <Typography
            component="h1"
            sx={{
              color: "common.white",
              fontSize: { xs: "2rem", sm: "2.75rem" },
              fontWeight: 700,
              lineHeight: 1.15,
              textShadow: "0 2px 18px rgba(0,0,0,.8)",
            }}
          >
            Le Shop arrive bientôt
          </Typography>

          <Typography
            sx={{
              maxWidth: 480,
              mx: "auto",
              mt: 2,
              color: "rgba(255,255,255,.76)",
              fontSize: { xs: ".9rem", sm: "1rem" },
              lineHeight: 1.7,
            }}
          >
            Une sélection pensée par le studio est en préparation.
          </Typography>
        </Box>
      </GlassySurface>
    </Box>
  );
}
