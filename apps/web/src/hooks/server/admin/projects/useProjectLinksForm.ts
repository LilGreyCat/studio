import { useState } from "react";

import type { ProjectLinks } from "@/hooks/server/projects/types";
import { emptyToNull } from "@/utils/emptyToNull";

export function useProjectLinksForm({ links }: { links?: ProjectLinks }) {
    const [spotifyURL, setSpotifyURL] = useState(links?.spotify_url ?? "");
    const [deezerURL, setDeezerURL] = useState(links?.deezer_url ?? "");
    const [appleMusicURL, setAppleMusicURL] = useState(
        links?.apple_music_url ?? ""
    );
    const [soundcloudURL, setSoundcloudURL] = useState(
        links?.soundcloud_url ?? ""
    );
    const [youtubeURL, setYoutubeURL] = useState(links?.youtube_url ?? "");

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
