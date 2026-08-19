import type {
    Artist,
    ArtistDetail,
    ArtistIntegrations,
    ArtistLinks,
} from "./types";

import { fetchJson } from "@/utils/fetchJson";
import { normalizeEmbedURL } from "@/utils/normalizeEmbedURL";

export function getArtists(): Promise<Artist[]> {
    return fetchJson<Artist[]>("/artists/");
}

export function getArtistById(
    id: number,
    signal?: AbortSignal
): Promise<ArtistDetail> {
    return fetchJson<ArtistDetail>(`/artists/${id}`, { signal });
}

export async function getArtistLinks(
    id: number,
    signal?: AbortSignal
): Promise<ArtistLinks> {
    try {
        return await fetchJson<ArtistLinks>(`/artists/${id}/links`, { signal });
    } catch (error) {
        if (isNotFoundError(error)) {
            return {
                artist_id: id,
                spotify_url: null,
                deezer_url: null,
                apple_music_url: null,
                soundcloud_url: null,
                youtube_url: null,
                instagram_url: null,
                tiktok_url: null,
            };
        }

        throw error;
    }
}

export async function getArtistIntegrations(
    id: number,
    signal?: AbortSignal
): Promise<ArtistIntegrations> {
    let integrations: ArtistIntegrations;
    try {
        integrations = await fetchJson<ArtistIntegrations>(
            `/artists/${id}/integrations`,
            { signal }
        );
    } catch (error) {
        if (isNotFoundError(error)) {
            return {
                artist_id: id,
                spotify_embed_url: null,
                deezer_embed_url: null,
                apple_music_embed_url: null,
            };
        }

        throw error;
    }

    return {
        ...integrations,
        spotify_embed_url: normalizeEmbedURL(integrations.spotify_embed_url),
        deezer_embed_url: normalizeEmbedURL(integrations.deezer_embed_url),
        apple_music_embed_url: normalizeEmbedURL(
            integrations.apple_music_embed_url
        ),
    };
}

function isNotFoundError(error: unknown): boolean {
    return error instanceof Error && error.message.includes("status 404");
}
