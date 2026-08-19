package models

import "time"

type Notification struct {
	ID        int64     `json:"id" db:"id"`
	Message   string    `json:"message" db:"message"`
	TargetURL string    `json:"target_url" db:"target_url"`
	StartsAt  time.Time `json:"starts_at" db:"starts_at"`
	EndsAt    time.Time `json:"ends_at" db:"ends_at"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}
