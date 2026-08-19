"use client";

import { useCallback, useEffect, useState } from "react";

import type { Project } from "@/hooks/server/projects/types";
import { getAdminProjects } from "./api";

export function useAdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshProjects = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            setProjects(await getAdminProjects());
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Impossible de charger les projets"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshProjects();
    }, [refreshProjects]);

    return { projects, isLoading, error, refreshProjects };
}
