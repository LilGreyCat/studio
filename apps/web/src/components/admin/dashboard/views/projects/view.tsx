"use client";

import { Button, Stack, Typography } from "@mui/material";

import { useDeleteProject } from "@/hooks/server/admin/projects";
import { useProjects } from "@/hooks/server/projects";

import { useAdminProjectsView } from "@/hooks/server/admin/projects/useAdminProjectsView";
import ProjectFormView from "./FormView";
import ProjectListView from "./ProjectListView";

type AdminProjectsViewProps = {
  onBack: () => void;
};

export default function AdminProjectsView({ onBack }: AdminProjectsViewProps) {
  const { projects, isLoading, error, refreshProjects } = useProjects();

  const {
    mode,
    selectedProject,
    openEditMode,
    openCreateMode,
    closeForm,
    handleFormSuccess,
  } = useAdminProjectsView({ refreshProjects });

  const { handleDelete, isDeleting, deleteError } = useDeleteProject({
    onSuccess: refreshProjects,
  });

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
          <Button variant="contained" onClick={openCreateMode}>
            Ajouter un projet
          </Button>

          <Button variant="outlined" onClick={onBack}>
            Retour
          </Button>
        </Stack>
      </Stack>

      {deleteError && <Typography color="error">{deleteError}</Typography>}

      <ProjectListView
        projects={projects}
        isLoading={isLoading}
        error={error}
        isDeleting={isDeleting}
        onDelete={handleDelete}
        onEdit={openEditMode}
      />
    </Stack>
  );
}
