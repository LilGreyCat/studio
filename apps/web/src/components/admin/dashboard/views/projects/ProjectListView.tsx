import { CircularProgress, Stack, Typography } from "@mui/material";

import type { Project } from "@/hooks/server/projects/types";

import ProjectListItem from "./ProjectListItem";

type ProjectListViewProps = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  onEdit: (project: Project) => void;
  onDelete: (projectId: number) => Promise<void>;
};

export default function ProjectListView({
  projects,
  isLoading,
  error,
  isDeleting,
  onEdit,
  onDelete,
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
      {projects.map((project) => (
        <ProjectListItem
          key={project.id}
          project={project}
          isDeleting={isDeleting}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </Stack>
  );
}
