import { GlassySurface } from "@/components/ui";
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
        }}
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

        <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
          <ButtonBase
            sx={optionTileButtonSx}
            onClick={() => onSelectView("prices")}
          >
            <GlassySurface sx={adminOptionTileSx}>Tarifs</GlassySurface>
          </ButtonBase>
        </Box>
      </Box>
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
