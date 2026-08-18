"use client";

import { useCallback, useEffect, useState } from "react";

import { getAdminHardware } from "./api";
import type { HardwareItem } from "./types";

export function useAdminHardware() {
    const [items, setItems] = useState<HardwareItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async (): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);
            setItems(await getAdminHardware());
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Impossible de charger le matériel"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { items, isLoading, error, refresh };
}
