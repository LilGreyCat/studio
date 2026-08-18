import { useEffect, useState } from "react";

import { useProjectIntegrations } from "@/hooks/server/projects";
import { emptyToNull } from "@/utils/emptyToNull";

type UseProjectIntegrationsFormParams = {
    projectId: number | null;
    enabled: boolean;
};

export function useProjectIntegrationsForm({
    projectId,
    enabled,
}: UseProjectIntegrationsFormParams) {
    const [spotifyEmbedURL, setSpotifyEmbedURL] = useState("");
    const [deezerEmbedURL, setDeezerEmbedURL] = useState("");
    const [appleMusicEmbedURL, setAppleMusicEmbedURL] = useState("");

    const { integrations } = useProjectIntegrations(enabled ? projectId : null);

    useEffect(() => {
        if (!enabled || !integrations) {
            return;
        }

        // Editable form state must be initialized when the async resource arrives.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSpotifyEmbedURL(integrations.spotify_embed_url ?? "");
        setDeezerEmbedURL(integrations.deezer_embed_url ?? "");
        setAppleMusicEmbedURL(integrations.apple_music_embed_url ?? "");
    }, [enabled, integrations]);

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
