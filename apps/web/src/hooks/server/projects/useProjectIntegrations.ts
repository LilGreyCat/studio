"use client";

import { useResource } from "../useResource";
import { getProjectIntegrations } from "./api";
import type { ProjectIntegrations } from "./types";

export function useProjectIntegrations(projectId: number | null) {
    const state = useResource<ProjectIntegrations>(
        projectId,
        getProjectIntegrations,
        "Failed to fetch project integrations"
    );
    return {
        integrations: state.data,
        isLoading: state.isLoading,
        error: state.error,
    };
}
