package project

import "github.com/PtiCadri/studio/apps/api/internal/utils"

type PatchLinks struct {
	SpotifyURL    utils.Optional[string] `json:"spotify_url"`
	DeezerURL     utils.Optional[string] `json:"deezer_url"`
	AppleMusicURL utils.Optional[string] `json:"apple_music_url"`
	SoundcloudURL utils.Optional[string] `json:"soundcloud_url"`
	YoutubeURL    utils.Optional[string] `json:"youtube_url"`
}
