import { useEffect, useState } from "react";

import { useProjectLinks } from "@/hooks/server/projects";
import { emptyToNull } from "@/utils/emptyToNull";

type UseProjectLinksFormParams = {
    projectId: number | null;
    enabled: boolean;
};

export function useProjectLinksForm({
    projectId,
    enabled,
}: UseProjectLinksFormParams) {
    const [spotifyURL, setSpotifyURL] = useState("");
    const [deezerURL, setDeezerURL] = useState("");
    const [appleMusicURL, setAppleMusicURL] = useState("");
    const [soundcloudURL, setSoundcloudURL] = useState("");
    const [youtubeURL, setYoutubeURL] = useState("");

    const { links } = useProjectLinks(enabled ? projectId : null);

    useEffect(() => {
        if (!enabled || !links) {
            return;
        }

        setSpotifyURL(links.spotify_url ?? "");
        setDeezerURL(links.deezer_url ?? "");
        setAppleMusicURL(links.apple_music_url ?? "");
        setSoundcloudURL(links.soundcloud_url ?? "");
        setYoutubeURL(links.youtube_url ?? "");
    }, [enabled, links]);

    function getLinksPayload() {
        return {
            spotify_url: emptyToNull(spotifyURL),
            deezer_url: emptyToNull(deezerURL),
            apple_music_url: emptyToNull(appleMusicURL),
            soundcloud_url: emptyToNull(soundcloudURL),
            youtube_url: emptyToNull(youtubeURL),
        };
    }

    return {
        spotifyURL,
        deezerURL,
        appleMusicURL,
        soundcloudURL,
        youtubeURL,

        setSpotifyURL,
        setDeezerURL,
        setAppleMusicURL,
        setSoundcloudURL,
        setYoutubeURL,

        getLinksPayload,
    };
}
