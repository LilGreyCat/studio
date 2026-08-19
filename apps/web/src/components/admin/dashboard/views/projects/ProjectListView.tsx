import { CircularProgress, Stack, Typography } from "@mui/material";

import type { Project } from "@/hooks/server/projects/types";

import ProjectListItem from "./ProjectListItem";

type ProjectListViewProps = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  isBusy: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => Promise<void>;
  onToggleVisibility: (project: Project) => Promise<void>;
  onMove: (index: number, direction: -1 | 1) => Promise<void>;
};

export default function ProjectListView({
  projects,
  isLoading,
  error,
  isBusy,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMove,
}: ProjectListViewProps) {
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (projects.length === 0) {
    return <Typography>Aucun projet trouvé.</Typography>;
  }

  return (
    <Stack spacing={2}>
      {projects.map((project, index) => (
        <ProjectListItem
          key={project.id}
          project={project}
          index={index}
          itemCount={projects.length}
          isBusy={isBusy}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleVisibility={onToggleVisibility}
          onMove={onMove}
        />
      ))}
    </Stack>
  );
}
