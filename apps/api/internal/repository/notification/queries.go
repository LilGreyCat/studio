package notification

import (
	"context"
	"database/sql"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
	notificationReq "github.com/PtiCadri/studio/apps/api/internal/requests/notification"
)

const notificationColumns = `id, message, target_url, starts_at, ends_at, created_at, updated_at`

type scanner interface {
	Scan(dest ...any) error
}

func scan(row scanner) (models.Notification, error) {
	var item models.Notification
	err := row.Scan(&item.ID, &item.Message, &item.TargetURL, &item.StartsAt, &item.EndsAt, &item.CreatedAt, &item.UpdatedAt)
	return item, err
}

func (r *Repository) Active(ctx context.Context) (*models.Notification, error) {
	query := `SELECT ` + notificationColumns + ` FROM notifications
		WHERE starts_at <= NOW() AND ends_at > NOW()
		ORDER BY starts_at DESC, id DESC LIMIT 1;`
	item, err := scan(r.db.QueryRowContext(ctx, query))
	if err == sql.ErrNoRows {
		return nil, nil
	}
	return &item, err
}

func (r *Repository) List(ctx context.Context) ([]models.Notification, error) {
	query := `SELECT ` + notificationColumns + ` FROM notifications ORDER BY starts_at DESC, id DESC;`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := make([]models.Notification, 0)
	for rows.Next() {
		item, err := scan(rows)
		if err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

func (r *Repository) Create(ctx context.Context, request notificationReq.Write) (models.Notification, error) {
	query := `INSERT INTO notifications (message, target_url, starts_at, ends_at)
		VALUES ($1, $2, $3, $4) RETURNING ` + notificationColumns + `;`
	return scan(r.db.QueryRowContext(ctx, query, request.Message, request.TargetURL, request.StartsAt, request.EndsAt))
}

func (r *Repository) Update(ctx context.Context, id int64, request notificationReq.Write) (models.Notification, error) {
	query := `UPDATE notifications SET message=$2, target_url=$3, starts_at=$4, ends_at=$5, updated_at=NOW()
		WHERE id=$1 RETURNING ` + notificationColumns + `;`
	return scan(r.db.QueryRowContext(ctx, query, id, request.Message, request.TargetURL, request.StartsAt, request.EndsAt))
}

func (r *Repository) Delete(ctx context.Context, id int64) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM notifications WHERE id=$1`, id)
	if err != nil {
		return err
	}
	count, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if count == 0 {
		return sql.ErrNoRows
	}
	return nil
}
