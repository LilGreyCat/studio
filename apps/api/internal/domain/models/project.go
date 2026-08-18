package models

import (
	"database/sql"
	"time"
)

type Project struct {
	ID        int64          `json:"id" db:"id"`
	Name      string         `json:"name" db:"name"`
	ImageURL  sql.NullString `json:"image_url" db:"image_url"`
	CreatedAt time.Time      `json:"created_at" db:"created_at"`
	UpdatedAt time.Time      `json:"updated_at" db:"updated_at"`
}
