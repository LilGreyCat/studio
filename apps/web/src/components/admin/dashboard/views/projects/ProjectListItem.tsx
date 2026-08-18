import { GlassySurface } from "@/components/ui";
import { Button, Stack, Typography } from "@mui/material";

import type { Project } from "@/hooks/server/projects/types";

type ProjectListItemProps = {
  project: Project;
  isDeleting: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => Promise<void>;
};

export default function ProjectListItem({
  project,
  isDeleting,
  onEdit,
  onDelete,
}: ProjectListItemProps) {
  return (
    <GlassySurface
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Typography variant="h6">{project.name}</Typography>

      <Stack direction="row" spacing={2}>
        <Button variant="outlined" onClick={() => onEdit(project)}>
          Modifier
        </Button>

        <Button
          variant="outlined"
          color="error"
          disabled={isDeleting}
          onClick={() => onDelete(project.id)}
        >
          Supprimer
        </Button>
      </Stack>
    </GlassySurface>
  );
}
