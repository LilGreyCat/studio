import Formules from "@/components/tarifs/Formules";
import Live from "@/components/tarifs/Live";
import Prestations from "@/components/tarifs/Prestations";
import { PricingProvider } from "@/components/tarifs/PricingProvider";
import { Divider, MainLogo } from "@/components/ui";
import { Box, Link, Typography } from "@mui/material";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs",
  description: "Découvrez les tarifs pratiqués par Nhadès Records.",
};

export default function Tarifs() {
  return (
    <PricingProvider>
      <MainLogo />
      <Prestations />
      <Divider />
      <Live />
      <Typography
        variant="h6"
        sx={{
          color: "text.secondary",
          fontSize: { xs: ".8rem", md: "1rem" },
          px: 2,
          mt: 3,
          mb: "30px",
        }}
        gutterBottom
      >
        Les tarifs indiqués sont donnés à titre indicatif et peuvent évoluer en
        fonction des spécificités du projet (configuration technique, quantité
        de matériel, durée de prestation, déplacement, etc.).
      </Typography>
      <Divider />
      <Formules />
      <Typography
        variant="h6"
        sx={{
          width: "100%",
          textAlign: "left",
          color: "text.secondary",
          fontSize: { xs: ".8rem", md: "1rem" },
          px: 2,
          mt: 3,
          mb: "30px",
        }}
        gutterBottom
      >
        Pour toute autre prestation ou demande particulière, faites-le savoir
        dans votre
        <Box component={Link} href="/contact" sx={contactLinkSx}>
          message de contact
        </Box>
      </Typography>
    </PricingProvider>
  );
}

const contactLinkSx = {
  textDecoration: "underline",
  color: "text.secondary",
  pl: "5px",
  "&:hover": {
    color: "text.primary",
  },
};
