import { GlassySurface } from "@/components/ui";
import { Box } from "@mui/material";

import Infos from "./Infos";
import StudioLocation from "./StudioLocation";
import { logoSx, surfaceSx } from "./styles";

export default function StudioInfos() {
  return (
    <GlassySurface sx={surfaceSx}>
      <Box component="img" src="/logo-complet.webp" alt="Logo du studio" sx={logoSx} />
      <Infos />
      <StudioLocation />
    </GlassySurface>
  );
}
