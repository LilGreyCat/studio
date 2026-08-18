"use client";

import { useResource } from "../useResource";
import { getArtistIntegrations } from "./api";
import type { ArtistIntegrations } from "./types";

export function useArtistIntegrations(artistId: number | null) {
    const state = useResource<ArtistIntegrations>(
        artistId,
        getArtistIntegrations,
        "Failed to fetch artist integrations"
    );
    return {
        integrations: state.data,
        isLoading: state.isLoading,
        error: state.error,
    };
}
