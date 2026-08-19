"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

import {
  reorderProjects,
  updateProject,
  useAdminProjects,
  useDeleteProject,
} from "@/hooks/server/admin/projects";
import type { Project } from "@/hooks/server/projects/types";

import { useAdminProjectsView } from "@/hooks/server/admin/projects/useAdminProjectsView";
import ProjectFormView from "./FormView";
import ProjectListView from "./ProjectListView";

type AdminProjectsViewProps = {
  onBack: () => void;
};

export default function AdminProjectsView({ onBack }: AdminProjectsViewProps) {
  const { projects, isLoading, error, refreshProjects } = useAdminProjects();
  const [isBusy, setIsBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

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

  async function runAction(action: () => Promise<void>): Promise<void> {
    try {
      setIsBusy(true);
      setActionError(null);
      await action();
      await refreshProjects();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "L’action a échoué");
    } finally {
      setIsBusy(false);
    }
  }

  async function handleToggleVisibility(project: Project): Promise<void> {
    await runAction(async () => {
      await updateProject(project.id, { is_visible: !project.is_visible });
    });
  }

  async function handleMove(index: number, direction: -1 | 1): Promise<void> {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const reordered = [...projects];
    [reordered[index], reordered[targetIndex]] = [
      reordered[targetIndex],
      reordered[index],
    ];
    await runAction(async () => {
      await reorderProjects(reordered.map((project) => project.id));
    });
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
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
      >
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
      {actionError && <Typography color="error">{actionError}</Typography>}

      <ProjectListView
        projects={projects}
        isLoading={isLoading}
        error={error}
        isBusy={isBusy || isDeleting}
        onDelete={handleDelete}
        onEdit={openEditMode}
        onToggleVisibility={handleToggleVisibility}
        onMove={handleMove}
      />
    </Stack>
  );
}
