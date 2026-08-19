import { Project } from "../projects/types";

export type Artist = {
    id: number;
    name: string;
    image_url: string | null;
    display_order: number;
    is_visible: boolean;
    created_at: string;
    updated_at: string;
};

export type ArtistDetail = {
    id: number;
    name: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
    projects: Project[];
};

export type ArtistLinks = {
    artist_id: number;
    spotify_url: string | null;
    deezer_url: string | null;
    apple_music_url: string | null;
    soundcloud_url: string | null;
    youtube_url: string | null;
    instagram_url: string | null;
    tiktok_url: string | null;
};

export type ArtistIntegrations = {
    artist_id: number;
    spotify_embed_url: string | null;
    deezer_embed_url: string | null;
    apple_music_embed_url: string | null;
};
