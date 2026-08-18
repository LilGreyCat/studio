package artist

import "github.com/PtiCadri/studio/apps/api/internal/utils"

type PatchIntegrations struct {
	SpotifyEmbedURL    utils.Optional[string] `json:"spotify_embed_url"`
	DeezerEmbedURL     utils.Optional[string] `json:"deezer_embed_url"`
	AppleMusicEmbedURL utils.Optional[string] `json:"apple_music_embed_url"`
}
