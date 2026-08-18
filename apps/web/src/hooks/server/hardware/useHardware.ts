"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getHardware } from "./api";
import type { HardwareItem } from "./types";

export function useHardware() {
    const [items, setItems] = useState<HardwareItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(false);
    const latestRequest = useRef(0);

    const refresh = useCallback(async (): Promise<void> => {
        const requestID = ++latestRequest.current;
        try {
            setIsLoading(true);
            setError(null);
            const response = await getHardware();
            if (isMounted.current && requestID === latestRequest.current) {
                setItems(response);
            }
        } catch (err) {
            if (isMounted.current && requestID === latestRequest.current) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Impossible de charger le matériel"
                );
            }
        } finally {
            if (isMounted.current && requestID === latestRequest.current) {
                setIsLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        isMounted.current = true;
        void refresh();
        return () => {
            isMounted.current = false;
            latestRequest.current += 1;
        };
    }, [refresh]);

    return { items, isLoading, error, refresh };
}
