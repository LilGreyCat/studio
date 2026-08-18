"use client";

import { useResource } from "../useResource";
import { getArtistById } from "./api";
import type { ArtistDetail } from "./types";

export function useArtist(artistId: number | null) {
    const state = useResource<ArtistDetail>(
        artistId,
        getArtistById,
        "Failed to fetch artist"
    );
    return {
        artist: state.data,
        isLoading: state.isLoading,
        error: state.error,
    };
}
