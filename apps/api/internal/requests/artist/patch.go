package artist

import "github.com/PtiCadri/studio/apps/api/internal/utils"

type PatchArtist struct {
	Name     utils.Optional[string] `json:"name"`
	ImageURL utils.Optional[string] `json:"image_url"`
}
