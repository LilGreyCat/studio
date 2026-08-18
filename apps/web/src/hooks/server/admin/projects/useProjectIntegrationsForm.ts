import { useState } from "react";

import type { ProjectIntegrations } from "@/hooks/server/projects/types";
import { emptyToNull } from "@/utils/emptyToNull";

export function useProjectIntegrationsForm({
    integrations,
}: {
    integrations?: ProjectIntegrations;
}) {
    const [spotifyEmbedURL, setSpotifyEmbedURL] = useState(
        integrations?.spotify_embed_url ?? ""
    );
    const [deezerEmbedURL, setDeezerEmbedURL] = useState(
        integrations?.deezer_embed_url ?? ""
    );
    const [appleMusicEmbedURL, setAppleMusicEmbedURL] = useState(
        integrations?.apple_music_embed_url ?? ""
    );

    function getIntegrationsPayload() {
        return {
            spotify_embed_url: emptyToNull(spotifyEmbedURL),
            deezer_embed_url: emptyToNull(deezerEmbedURL),
            apple_music_embed_url: emptyToNull(appleMusicEmbedURL),
        };
    }

    return {
        spotifyEmbedURL,
        deezerEmbedURL,
        appleMusicEmbedURL,
        setSpotifyEmbedURL,
        setDeezerEmbedURL,
        setAppleMusicEmbedURL,
        getIntegrationsPayload,
    };
}
