"use client";

import { useResource } from "../useResource";
import { getArtistLinks } from "./api";
import type { ArtistLinks } from "./types";

export function useArtistLinks(artistId: number | null) {
    const state = useResource<ArtistLinks>(
        artistId,
        getArtistLinks,
        "Failed to fetch artist links"
    );
    return {
        links: state.data,
        isLoading: state.isLoading,
        error: state.error,
    };
}
