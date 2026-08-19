import { GlassySurface } from "@/components/ui";
import { optionTileButtonSx, optionTileSx } from "@/components/ui/optionTileStyles";
import { ButtonBase, Stack, Typography } from "@mui/material";
import { AdminView } from "../types";

type AdminHomeViewProps = {
  onSelectView: (view: AdminView) => void;
};

export default function AdminHomeView({ onSelectView }: AdminHomeViewProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">Que veux-tu gérer ?</Typography>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        useFlexGap
        flexWrap="wrap"
      >
        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("projects")}
        >
          <GlassySurface sx={adminOptionTileSx}>Projets</GlassySurface>
        </ButtonBase>

        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("artists")}
        >
          <GlassySurface sx={adminOptionTileSx}>Artistes</GlassySurface>
        </ButtonBase>

        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("hardware")}
        >
          <GlassySurface sx={adminOptionTileSx}>Matériel</GlassySurface>
        </ButtonBase>

        <ButtonBase
          sx={optionTileButtonSx}
          onClick={() => onSelectView("notifications")}
        >
          <GlassySurface sx={adminOptionTileSx}>Notifications</GlassySurface>
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
