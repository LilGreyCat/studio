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

import ProjectFormView from "./FormView";

type AdminProjectsViewProps = {
  onBack: () => void;
};

type ProjectAdminMode = "list" | "create";

export default function AdminProjectsView({ onBack }: AdminProjectsViewProps) {
  const [mode, setMode] = useState<ProjectAdminMode>("list");

  const { projects, isLoading, error, refreshProjects } = useProjects();

  const { handleDelete, isDeleting, deleteError } = useDeleteProject({
    onSuccess: refreshProjects,
  });

  if (mode === "create") {
    return (
      <ProjectFormView
        onCancel={() => setMode("list")}
        onSuccess={async () => {
          await refreshProjects();
          setMode("list");
        }}
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
      })}
    </Stack>
  );
}

type RenderProjectListParams = {
  projects: ReturnType<typeof useProjects>["projects"];
  isLoading: boolean;
  error: string | null;
  isDeleting: boolean;
  onDelete: (projectId: number) => Promise<void>;
};

function renderProjectList({
  projects,
  isLoading,
  error,
  isDeleting,
  onDelete,
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

          <Button
            variant="outlined"
            color="error"
            disabled={isDeleting}
            onClick={() => onDelete(project.id)}
          >
            Supprimer
          </Button>
        </Box>
      ))}
    </Stack>
  );
}
