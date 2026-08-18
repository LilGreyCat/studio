"use client";

import { useResource } from "../useResource";
import { getProjectById } from "./api";
import type { ProjectDetail } from "./types";

export function useProject(projectId: number | null) {
    const state = useResource<ProjectDetail>(
        projectId,
        getProjectById,
        "Failed to fetch project"
    );
    return {
        project: state.data,
        isLoading: state.isLoading,
        error: state.error,
    };
}
