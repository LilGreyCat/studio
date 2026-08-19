import { Box } from "@mui/material";
import SocialIcons from "./SocialIcons";
import { containerSx, logoSx } from "./styles";

export default function SocialLinks() {
  return (
    <Box sx={containerSx}>
      <Box component="img" src="/logo-complet.svg" alt="Logo" sx={logoSx} />
      <SocialIcons />
    </Box>
  );
}
