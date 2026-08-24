import { GlassySurface } from "@/components/ui";
import SafeImage from "@/components/ui/SafeImage";
import { getImageUrl } from "@/utils/getImageUrl";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import type { Project } from "@/hooks/server/projects/types";
import {
  destructiveActionSx,
  managementActionsSx,
} from "../managementActionStyles";

type ProjectListItemProps = {
  project: Project;
  index: number;
  itemCount: number;
  isBusy: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => Promise<void>;
  onToggleVisibility: (project: Project) => Promise<void>;
  onMove: (index: number, direction: -1 | 1) => Promise<void>;
};

export default function ProjectListItem({
  project,
  index,
  itemCount,
  isBusy,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMove,
}: ProjectListItemProps) {
  return (
    <GlassySurface
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        gap: 2,
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          width: { xs: "100%", md: 112 },
          height: 96,
          flexShrink: 0,
          borderRadius: 1.5,
        }}
      >
        <SafeImage
          src={getImageUrl(project.image_url)}
          alt={project.name}
          fill
          sizes="(max-width: 900px) 100vw, 112px"
          style={{ objectFit: "cover" }}
        />
      </Box>

      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="h6">{project.name}</Typography>
          <Chip
            size="small"
            color={project.is_visible ? "success" : "default"}
            label={project.is_visible ? "Visible" : "Masqué"}
          />
          {project.is_featured && (
            <Chip size="small" color="primary" label="Mis en avant" />
          )}
        </Stack>
      </Stack>

      <Box sx={managementActionsSx}>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy || index === 0}
          onClick={() => onMove(index, -1)}
        >
          Monter
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy || index === itemCount - 1}
          onClick={() => onMove(index, 1)}
        >
          Descendre
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy}
          onClick={() => onEdit(project)}
        >
          Modifier
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={isBusy}
          onClick={() => onToggleVisibility(project)}
        >
          {project.is_visible ? "Masquer" : "Afficher"}
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          disabled={isBusy}
          onClick={() => onDelete(project.id)}
          sx={destructiveActionSx}
        >
          Supprimer
        </Button>
      </Box>
    </GlassySurface>
  );
}
