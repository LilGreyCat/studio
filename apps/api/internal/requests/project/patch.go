package project

import "github.com/PtiCadri/studio/apps/api/internal/utils"

type PatchProject struct {
	Name     utils.Optional[string] `json:"name"`
	ImageURL utils.Optional[string] `json:"image_url"`
}
