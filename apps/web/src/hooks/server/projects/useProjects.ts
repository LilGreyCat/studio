"use client";

import { useCallback, useEffect, useState } from "react";

import { getProjects } from "./api";
import type { Project } from "./types";

type UseProjectsResult = {
    projects: Project[];
    isLoading: boolean;
    error: string | null;
    refreshProjects: () => Promise<void>;
};

export function useProjects(): UseProjectsResult {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProjects = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getProjects();
            setProjects(data);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to fetch projects"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshProjects();
    }, [refreshProjects]);

    return {
        projects,
        isLoading,
        error,
        refreshProjects,
    };
}
