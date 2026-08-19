import { Box, SxProps, Theme } from "@mui/material";

export default function MainLogo({ marginBottom }: { marginBottom?: number }) {
  return (
    <Box
      component="img"
      src="/logo-complet.svg"
      alt="Logo"
      sx={logoSx(marginBottom)}
    />
  );
}

const logoSx = (marginBottom?: number): SxProps<Theme> => ({
  width: "auto",
  minHeight: { xs: "220px", lg: "340px" },
  maxHeight: { xs: "220px", lg: "340px" },
  mb: marginBottom ?? "0px",
  userSelect: "none",
});
