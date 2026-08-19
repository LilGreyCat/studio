import ThemeRegistry from "@/theme/ThemeRegistry";
import type { Metadata } from "next";
import React from "react";

import Starfield from "@/components/background/Starfield";
import Footer from "@/components/footer/Footer";
import { Navbar } from "@/components/navbar";
import { NotificationBand } from "@/components/notification";
import { NAVBAR_HEIGHT } from "@/components/ui/constants";
import { ibmPlexSans } from "@/theme/fonts";
import { Box } from "@mui/material";

export const metadata: Metadata = {
  title: {
    default: "Nhadès Records",
    template: "%s | Nhadès Records",
  },
  description:
    "Nhadès Records, studio de musique indépendant situé à 5 minutes de Rouen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={ibmPlexSans.variable}>
      <body>
        <Starfield />
        <ThemeRegistry>
          <Navbar />
          <NotificationBand />

          <Box
            sx={{
              pt: `calc(${NAVBAR_HEIGHT + 20}px + var(--notification-band-height, 0px))`,
              transition: "padding-top 250ms ease",
              width: "100%",
              overflowX: "hidden",
              px: { xs: "20px", lg: "0px" },
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Box sx={containerSx}>{children}</Box>
          </Box>
          <Footer />
        </ThemeRegistry>
      </body>
    </html>
  );
}

const containerSx = {
  width: "100%",
  maxWidth: "1150px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  overflowX: "hidden",
};
