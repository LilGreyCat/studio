import { useState } from "react";

import type { Project } from "@/hooks/server/projects/types";

type ProjectAdminMode = "list" | "create" | "edit";

type UseAdminProjectsViewParams = {
    refreshProjects: () => Promise<void>;
};

export function useAdminProjectsView({
    refreshProjects,
}: UseAdminProjectsViewParams) {
    const [mode, setMode] = useState<ProjectAdminMode>("list");
    const [selectedProject, setSelectedProject] = useState<Project | null>(
        null
    );

    function openEditMode(project: Project): void {
        setSelectedProject(project);
        setMode("edit");
    }

    function openCreateMode(): void {
        setSelectedProject(null);
        setMode("create");
    }

    function closeForm(): void {
        setSelectedProject(null);
        setMode("list");
    }

    async function handleFormSuccess(): Promise<void> {
        await refreshProjects();
        closeForm();
    }

    return {
        mode,
        selectedProject,
        openEditMode,
        openCreateMode,
        closeForm,
        handleFormSuccess,
    };
}
