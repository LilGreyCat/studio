import { fetchJson } from "@/utils/fetchJson";
import type {
    Artist,
    ArtistIntegrations,
    ArtistLinks,
} from "@/hooks/server/artists/types";

export const getAdminArtists = () =>
    fetchJson<Artist[]>("/admin/artists", { credentials: "include" });
export const createArtist = (payload: {
    name: string;
    image_url: string | null;
}) =>
    fetchJson<Artist>("/admin/artists", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(payload),
    });
export const updateArtist = (
    id: number,
    payload: Partial<
        Pick<Artist, "name" | "image_url" | "display_order" | "is_visible">
    >
) =>
    fetchJson<Artist>(`/admin/artists/${id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify(payload),
    });
export const deleteArtist = (id: number) =>
    fetchJson<void>(`/admin/artists/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
export const reorderArtists = (ids: number[]) =>
    fetchJson<Artist[]>("/admin/artists/order", {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ ids }),
    });
export const putArtistLinks = (
    id: number,
    payload: Omit<ArtistLinks, "artist_id">
) =>
    fetchJson<ArtistLinks>(`/admin/artists/${id}/links`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
    });
export const putArtistIntegrations = (
    id: number,
    payload: Omit<ArtistIntegrations, "artist_id">
) =>
    fetchJson<ArtistIntegrations>(`/admin/artists/${id}/integrations`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(payload),
    });
