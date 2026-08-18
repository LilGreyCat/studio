package models

import "time"

type HardwareItem struct {
	ID           int64     `json:"id" db:"id"`
	Slug         string    `json:"slug" db:"slug"`
	Eyebrow      string    `json:"eyebrow" db:"eyebrow"`
	Title        string    `json:"title" db:"title"`
	Description  string    `json:"description" db:"description"`
	ImageURL     string    `json:"image_url" db:"image_url"`
	ImageWidth   int16     `json:"image_width" db:"image_width"`
	ImageHeight  int16     `json:"image_height" db:"image_height"`
	DisplayOrder int16     `json:"display_order" db:"display_order"`
	IsVisible    bool      `json:"is_visible" db:"is_visible"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}
