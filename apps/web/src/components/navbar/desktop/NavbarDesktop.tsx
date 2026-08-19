"use client";

import { Box, Stack } from "@mui/material";

import { homePage, navbarLinks } from "../constants";
import StudioName from "../studioName/StudioName";
import { logoSx, navSx } from "../styles";
import NavbarButton from "./NavbarButton";
import { stackSx } from "./styles";

export default function NavbarDesktop() {
  return (
    <Box sx={navSx}>
      <StudioName />

      <Stack direction="row" sx={stackSx}>
        {[homePage].concat(navbarLinks).map((link) => (
          <NavbarButton key={link.key} link={link} />
        ))}
      </Stack>

      <Box component="img" src="/logo-sans-texte.webp" alt="Logo du studio" sx={logoSx} />
    </Box>
  );
}
