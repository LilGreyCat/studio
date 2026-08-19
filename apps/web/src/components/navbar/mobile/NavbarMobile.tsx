"use client";

import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import useMobileNavbar from "@/hooks/navbar/useMobileNavbar";
import StudioName from "../studioName/StudioName";
import { logoSx, navSx } from "../styles";
import NavLink from "./NavLink";
import NavMenu from "./NavMenu";

export default function NavbarMobile() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const { anchorEl, currentLink, handleClose, handleOpen, isOpen, pathname } =
    useMobileNavbar();

  return (
    <Box sx={navSx}>
      {isSmall && <StudioName />}

      <NavLink page={currentLink.label} onClick={handleOpen} isOpen={isOpen} />

      <NavMenu
        anchorEl={anchorEl}
        isOpen={isOpen}
        pathname={pathname}
        handleClose={handleClose}
      />

      <Box component="img" src="/logo-sans-texte.svg" alt="Logo du studio" sx={logoSx} />
    </Box>
  );
}
