import { GlassySurface, MainLogo } from "@/components/ui";
import { Box, Typography } from "@mui/material";
import { Metadata } from "next";

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
          width: "100%",
          maxWidth: 680,
          px: { xs: 3, sm: 6 },
          py: { xs: 5, sm: 7 },
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography
          component="p"
          sx={{
            mb: 1.5,
            color: "text.secondary",
            fontSize: ".75rem",
            fontWeight: 700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
          }}
        >
          Nhadès Records
        </Typography>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "2rem", sm: "2.75rem" },
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        >
          Le Shop arrive bientôt
        </Typography>

        <Typography
          sx={{
            maxWidth: 480,
            mx: "auto",
            mt: 2.5,
            color: "text.secondary",
            fontSize: { xs: ".9rem", sm: "1rem" },
            lineHeight: 1.7,
          }}
        >
          Une sélection pensée par le studio est en préparation.
        </Typography>
      </GlassySurface>
    </Box>
  );
}
