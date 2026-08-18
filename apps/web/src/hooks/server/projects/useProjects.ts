"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
    const isMountedRef = useRef(false);
    const latestRequestRef = useRef(0);

    const refreshProjects = useCallback(async (): Promise<void> => {
        const requestId = ++latestRequestRef.current;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getProjects();
            if (
                isMountedRef.current &&
                requestId === latestRequestRef.current
            ) {
                setProjects(data);
            }
        } catch (err) {
            if (
                isMountedRef.current &&
                requestId === latestRequestRef.current
            ) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to fetch projects"
                );
            }
        } finally {
            if (
                isMountedRef.current &&
                requestId === latestRequestRef.current
            ) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        void refreshProjects();

        return () => {
            isMountedRef.current = false;
            latestRequestRef.current += 1;
        };
    }, [refreshProjects]);

    return {
        projects,
        isLoading,
        error,
        refreshProjects,
    };
}
