"use client";

import { useState } from "react";

import { logoutAdmin } from "./api";

type UseAdminLogoutParams = {
    onLogoutSuccess?: () => Promise<void> | void;
};

export function useAdminLogout({ onLogoutSuccess }: UseAdminLogoutParams = {}) {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [logoutError, setLogoutError] = useState<string | null>(null);

    async function handleLogout(): Promise<void> {
        try {
            setIsLoggingOut(true);
            setLogoutError(null);

            await logoutAdmin();
            await onLogoutSuccess?.();
        } catch (err) {
            setLogoutError(
                err instanceof Error ? err.message : "Failed to logout"
            );
        } finally {
            setIsLoggingOut(false);
        }
    }

    return {
        handleLogout,
        isLoggingOut,
        logoutError,
    };
}
