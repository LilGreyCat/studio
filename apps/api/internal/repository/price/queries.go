package price

import (
	"context"
	"encoding/json"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	priceReq "github.com/PtiCadri/studio/apps/api/internal/requests/price"
)

func (r *Repository) List(ctx context.Context) ([]models.Price, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT key, amount_cents, updated_at FROM prices ORDER BY key;`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]models.Price, 0, 8)
	for rows.Next() {
		var item models.Price
		if err := rows.Scan(&item.Key, &item.AmountCents, &item.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *Repository) UpdateAll(ctx context.Context, prices []priceReq.Item) ([]models.Price, error) {
	payload, err := json.Marshal(prices)
	if err != nil {
		return nil, err
	}
	const query = `
		WITH input AS (
			SELECT key, amount_cents
			FROM jsonb_to_recordset($1::jsonb) AS value(key TEXT, amount_cents INTEGER)
		), updated AS (
			UPDATE prices AS price
			SET amount_cents = input.amount_cents, updated_at = NOW()
			FROM input WHERE price.key = input.key
			RETURNING price.key, price.amount_cents, price.updated_at
		)
		SELECT key, amount_cents, updated_at FROM updated ORDER BY key;
	`
	rows, err := r.db.QueryContext(ctx, query, string(payload))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]models.Price, 0, 8)
	for rows.Next() {
		var item models.Price
		if err := rows.Scan(&item.Key, &item.AmountCents, &item.UpdatedAt); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}
