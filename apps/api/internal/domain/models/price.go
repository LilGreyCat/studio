package models

import "time"

type Price struct {
	Key         string    `json:"key" db:"key"`
	AmountCents int       `json:"amount_cents" db:"amount_cents"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}
