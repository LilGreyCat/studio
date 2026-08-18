"use client";

import { useResource } from "../useResource";
import { getProjectLinks } from "./api";
import type { ProjectLinks } from "./types";

export function useProjectLinks(projectId: number | null) {
    const state = useResource<ProjectLinks>(
        projectId,
        getProjectLinks,
        "Failed to fetch project links"
    );
    return {
        links: state.data,
        isLoading: state.isLoading,
        error: state.error,
    };
}
