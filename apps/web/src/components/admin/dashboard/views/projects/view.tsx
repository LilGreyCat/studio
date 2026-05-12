"use client";

import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useDeleteProject } from "@/hooks/server/admin/projects";
import { useProjects } from "@/hooks/server/projects";
import type { Project } from "@/hooks/server/projects/types";

import ProjectFormView from "./FormView";

type AdminProjectsViewProps = {
  onBack: () => void;
};

type ProjectAdminMode = "list" | "create" | "edit";

export default function AdminProjectsView({ onBack }: AdminProjectsViewProps) {
  const [mode, setMode] = useState<ProjectAdminMode>("list");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { projects, isLoading, error, refreshProjects } = useProjects();

  const { handleDelete, isDeleting, deleteError } = useDeleteProject({
    onSuccess: refreshProjects,
  });

  function openEditMode(project: Project): void {
    setSelectedProject(project);
    setMode("edit");
  }

  function closeForm(): void {
    setSelectedProject(null);
    setMode("list");
  }

  async function handleFormSuccess(): Promise<void> {
    await refreshProjects();
    closeForm();
  }

  if (mode === "create") {
    return (
      <ProjectFormView
        mode="create"
        onCancel={closeForm}
        onSuccess={handleFormSuccess}
      />
    );
  }

  if (mode === "edit" && selectedProject !== null) {
    return (
      <ProjectFormView
        mode="edit"
        project={selectedProject}
        onCancel={closeForm}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <Stack spacing={4}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4">Gestion des projets</Typography>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => setMode("create")}>
            Ajouter un projet
          </Button>

          <Button variant="outlined" onClick={onBack}>
            Retour
          </Button>
        </Stack>
      </Stack>

      {deleteError && <Typography color="error">{deleteError}</Typography>}

      {renderProjectList({
        projects,
        isLoading,
        error,
        isDeleting,
        onDelete: handleDelete,
        onEdit: openEditMode,
      })}
    </Stack>
  );
}

type RenderProjectListParams = {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  onDelete: (projectId: number) => Promise<void>;
  onEdit: (project: Project) => void;
};

function renderProjectList({
  projects,
  isLoading,
  error,
  isDeleting,
  onDelete,
  onEdit,
}: RenderProjectListParams) {
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
        <Box
          key={project.id}
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
        </Box>
      ))}
    </Stack>
  );
}
