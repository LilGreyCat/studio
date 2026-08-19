"use client";
import { useCallback, useEffect, useState } from "react";
import type { Artist } from "@/hooks/server/artists/types";
import { getAdminArtists } from "./api";

export function useAdminArtists() {
    const [artists, setArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const refresh = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            setArtists(await getAdminArtists());
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Impossible de charger les artistes"
            );
        } finally {
            setIsLoading(false);
        }
    }, []);
    useEffect(() => {
        void refresh();
    }, [refresh]);
    return { artists, isLoading, error, refresh };
}
