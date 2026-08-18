"use client";

import { useEffect, useState } from "react";

import { getProjectIntegrations, getProjectLinks } from "./api";
import type { ProjectIntegrations, ProjectLinks } from "./types";

type ProjectDetailsState = {
    links: ProjectLinks | null;
    integrations: ProjectIntegrations | null;
    isLoading: boolean;
    error: string | null;
};

type LoadedProjectDetailsState = ProjectDetailsState & {
    projectId: number | null;
};

const emptyState: ProjectDetailsState = {
    links: null,
    integrations: null,
    isLoading: false,
    error: null,
};

export function useProjectDetails(
    projectId: number | null
): ProjectDetailsState {
    const [state, setState] = useState<LoadedProjectDetailsState>(() => ({
        ...emptyState,
        projectId,
        isLoading: projectId !== null,
    }));

    useEffect(() => {
        let isCancelled = false;

        if (projectId === null) {
            return;
        }

        void Promise.all([
            getProjectLinks(projectId),
            getProjectIntegrations(projectId),
        ])
            .then(([links, integrations]) => {
                if (!isCancelled) {
                    setState({
                        projectId,
                        links,
                        integrations,
                        isLoading: false,
                        error: null,
                    });
                }
            })
            .catch((error: unknown) => {
                if (!isCancelled) {
                    setState({
                        projectId,
                        links: null,
                        integrations: null,
                        isLoading: false,
                        error:
                            error instanceof Error
                                ? error.message
                                : "Failed to fetch project details",
                    });
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [projectId]);

    if (projectId === null) {
        return emptyState;
    }

    if (state.projectId !== projectId) {
        return { ...emptyState, isLoading: true };
    }

    return state;
}
