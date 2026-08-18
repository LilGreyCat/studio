import { optionTileButtonSx, optionTileSx } from "@/components/ui/optionTileStyles";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";
import { AdminView } from "../types";

type AdminHomeViewProps = {
  onSelectView: (view: AdminView) => void;
};

export default function AdminHomeView({ onSelectView }: AdminHomeViewProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">Que veux-tu gérer ?</Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("projects")}
        >
          <Box sx={adminOptionTileSx}>Projets</Box>
        </ButtonBase>

        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("artists")}
        >
          <Box sx={adminOptionTileSx}>Artistes</Box>
        </ButtonBase>

        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("hardware")}
        >
          <Box sx={adminOptionTileSx}>Matériel</Box>
        </ButtonBase>
      </Stack>
    </Stack>
  );
}

const adminOptionTileSx = {
  ...optionTileSx(false),
  borderWidth: "2px",
  fontSize: "1.5rem",
  fontWeight: 700,
  "&:hover": {
    border: { md: "2px solid white" },
    color: { md: "text.primary" },
  },
};
