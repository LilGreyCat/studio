package artist

import "github.com/PtiCadri/studio/apps/api/internal/utils"

type CreateArtist struct {
	Name     string  `json:"name"`
	ImageURL *string `json:"image_url"`
}

type CreateFullArtist struct {
	Name         string          `json:"name"`
	ImageURL     *string         `json:"image_url"`
	Links        PutLinks        `json:"links"`
	Integrations PutIntegrations `json:"integrations"`
}

type UpdateFullArtist struct {
	Artist       PatchArtist     `json:"artist"`
	Links        PutLinks        `json:"links"`
	Integrations PutIntegrations `json:"integrations"`
}

type PatchArtist struct {
	Name         utils.Optional[string] `json:"name"`
	ImageURL     utils.Optional[string] `json:"image_url"`
	DisplayOrder utils.Optional[int16]  `json:"display_order"`
	IsVisible    utils.Optional[bool]   `json:"is_visible"`
}

type Reorder struct {
	IDs []int64 `json:"ids"`
}

type PutLinks struct {
	SpotifyURL    *string `json:"spotify_url"`
	DeezerURL     *string `json:"deezer_url"`
	AppleMusicURL *string `json:"apple_music_url"`
	SoundcloudURL *string `json:"soundcloud_url"`
	YoutubeURL    *string `json:"youtube_url"`
	InstagramURL  *string `json:"instagram_url"`
	TiktokURL     *string `json:"tiktok_url"`
}

type PatchLinks struct {
	SpotifyURL    utils.Optional[string] `json:"spotify_url"`
	DeezerURL     utils.Optional[string] `json:"deezer_url"`
	AppleMusicURL utils.Optional[string] `json:"apple_music_url"`
	SoundcloudURL utils.Optional[string] `json:"soundcloud_url"`
	YoutubeURL    utils.Optional[string] `json:"youtube_url"`
	InstagramURL  utils.Optional[string] `json:"instagram_url"`
	TiktokURL     utils.Optional[string] `json:"tiktok_url"`
}

type PutIntegrations struct {
	SpotifyEmbedURL    *string `json:"spotify_embed_url"`
	DeezerEmbedURL     *string `json:"deezer_embed_url"`
	AppleMusicEmbedURL *string `json:"apple_music_embed_url"`
}

type PatchIntegrations struct {
	SpotifyEmbedURL    utils.Optional[string] `json:"spotify_embed_url"`
	DeezerEmbedURL     utils.Optional[string] `json:"deezer_embed_url"`
	AppleMusicEmbedURL utils.Optional[string] `json:"apple_music_embed_url"`
}
