"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
    const isMountedRef = useRef(false);
    const latestRequestRef = useRef(0);

    const refreshSession = useCallback(async (): Promise<void> => {
        const requestId = ++latestRequestRef.current;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getAdminSession();
            if (
                isMountedRef.current &&
                requestId === latestRequestRef.current
            ) {
                setAdmin(data);
            }
        } catch (err) {
            if (
                isMountedRef.current &&
                requestId === latestRequestRef.current
            ) {
                setAdmin(null);
                setError(err instanceof Error ? err.message : "Unauthorized");
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
        void refreshSession();

        return () => {
            isMountedRef.current = false;
            latestRequestRef.current += 1;
        };
    }, [refreshSession]);

    return {
        admin,
        isAuthenticated: admin !== null,
        isLoading,
        error,
        refreshSession,
    };
}
