"use client";

import { useCallback, useEffect, useState } from "react";

import { getAdminSession } from "./api";
import type { AdminSession } from "./types";

type UseAdminSessionResult = {
    admin: AdminSession | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    refreshSession: () => Promise<void>;
};

export function useAdminSession(): UseAdminSessionResult {
    const [admin, setAdmin] = useState<AdminSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refreshSession = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await getAdminSession();
            setAdmin(data);
        } catch (err) {
            setAdmin(null);
            setError(err instanceof Error ? err.message : "Unauthorized");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshSession();
    }, [refreshSession]);

    return {
        admin,
        isAuthenticated: admin !== null,
        isLoading,
        error,
        refreshSession,
    };
}
