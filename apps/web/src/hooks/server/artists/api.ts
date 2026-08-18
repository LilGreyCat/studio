import type {
    Artist,
    ArtistDetail,
    ArtistIntegrations,
    ArtistLinks,
} from "./types";

import { fetchJson } from "@/utils/fetchJson";

export function getArtists(): Promise<Artist[]> {
    return fetchJson<Artist[]>("/artists/");
}

export function getArtistById(
    id: number,
    signal?: AbortSignal
): Promise<ArtistDetail> {
    return fetchJson<ArtistDetail>(`/artists/${id}`, { signal });
}

export function getArtistLinks(
    id: number,
    signal?: AbortSignal
): Promise<ArtistLinks> {
    return fetchJson<ArtistLinks>(`/artists/${id}/links`, { signal });
}

export function getArtistIntegrations(
    id: number,
    signal?: AbortSignal
): Promise<ArtistIntegrations> {
    return fetchJson<ArtistIntegrations>(`/artists/${id}/integrations`, {
        signal,
    });
}
