package hardware

import "github.com/PtiCadri/studio/apps/api/internal/utils"

type Create struct {
	Slug         string `json:"slug"`
	Eyebrow      string `json:"eyebrow"`
	Title        string `json:"title"`
	Description  string `json:"description"`
	ImageURL     string `json:"image_url"`
	ImageWidth   int16  `json:"image_width"`
	ImageHeight  int16  `json:"image_height"`
	DisplayOrder *int16 `json:"display_order"`
	IsVisible    *bool  `json:"is_visible"`
}

type Patch struct {
	Slug         utils.Optional[string] `json:"slug"`
	Eyebrow      utils.Optional[string] `json:"eyebrow"`
	Title        utils.Optional[string] `json:"title"`
	Description  utils.Optional[string] `json:"description"`
	ImageURL     utils.Optional[string] `json:"image_url"`
	ImageWidth   utils.Optional[int16]  `json:"image_width"`
	ImageHeight  utils.Optional[int16]  `json:"image_height"`
	DisplayOrder utils.Optional[int16]  `json:"display_order"`
	IsVisible    utils.Optional[bool]   `json:"is_visible"`
}

type Reorder struct {
	IDs []int64 `json:"ids"`
}
