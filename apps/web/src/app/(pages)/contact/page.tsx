import { Box } from "@mui/material";
import { Metadata } from "next";
import { Suspense } from "react";

import ContactContent from "@/components/contact/Content";
import { MainLogo } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez Nhadès Records pour toute information ou demande de collaboration.",
};

export default function Contact() {
  return (
    <Box sx={containerSx}>
      <MainLogo marginBottom={5} />
      <Suspense fallback={null}>
        <ContactContent />
      </Suspense>
    </Box>
  );
}

const containerSx = {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
