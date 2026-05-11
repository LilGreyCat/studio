export type Project = {
    id: number;
    name: string;
    image_url: string | null;
    created_at: string;
    updated_at: string;
};

export type CreateProjectPayload = {
    name: string;
    image_url: string | null;
};

export type ProjectLinks = {
    project_id: number;
    spotify_url: string | null;
    deezer_url: string | null;
    apple_music_url: string | null;
    soundcloud_url: string | null;
    youtube_url: string | null;
};

export type PutProjectLinksPayload = {
    spotify_url: string | null;
    deezer_url: string | null;
    apple_music_url: string | null;
    soundcloud_url: string | null;
    youtube_url: string | null;
};

export type ProjectIntegrations = {
    project_id: number;
    spotify_embed_url: string | null;
    deezer_embed_url: string | null;
    apple_music_embed_url: string | null;
};

export type PutProjectIntegrationsPayload = {
    spotify_embed_url: string | null;
    deezer_embed_url: string | null;
    apple_music_embed_url: string | null;
};
