package models

import (
	"database/sql"
	"time"
)

type Project struct {
	ID           int64          `json:"id" db:"id"`
	Name         string         `json:"name" db:"name"`
	ImageURL     sql.NullString `json:"image_url" db:"image_url"`
	DisplayOrder int16          `json:"display_order" db:"display_order"`
	IsVisible    bool           `json:"is_visible" db:"is_visible"`
	CreatedAt    time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at" db:"updated_at"`
}
