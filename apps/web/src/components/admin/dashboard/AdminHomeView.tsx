import { Button, Stack, SxProps, Typography } from "@mui/material";
import { AdminView } from "../types";

type AdminHomeViewProps = {
  onSelectView: (view: AdminView) => void;
};

export default function AdminHomeView({ onSelectView }: AdminHomeViewProps) {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">Que veux-tu gérer ?</Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Button
          variant="contained"
          sx={featureButtonSx}
          onClick={() => onSelectView("projects")}
        >
          Projets
        </Button>

        <Button
          variant="contained"
          sx={featureButtonSx}
          onClick={() => onSelectView("artists")}
        >
          Artistes
        </Button>

        <Button
          variant="contained"
          sx={featureButtonSx}
          onClick={() => onSelectView("hardware")}
        >
          Matériel
        </Button>
      </Stack>
    </Stack>
  );
}

const featureButtonSx: SxProps = {
  minHeight: 120,
  flex: 1,
  fontSize: "1.2rem",
};
