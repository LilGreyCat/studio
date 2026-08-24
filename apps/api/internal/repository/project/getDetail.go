package project

import (
	"context"
	"database/sql"

	"github.com/PtiCadri/studio/apps/api/internal/domain/models"
)

func (r *ProjectRepository) GetDetail(ctx context.Context, id int64) (models.Project, []models.Artist, error) {
	const query = `
		SELECT
			p.id, p.name, p.image_url, p.display_order, p.is_visible, p.is_featured,
			p.created_at, p.updated_at,
			a.id, a.name, a.image_url, a.display_order, a.is_visible,
			a.created_at, a.updated_at
		FROM projects AS p
		LEFT JOIN artist_projects AS ap ON ap.project_id = p.id
		LEFT JOIN artists AS a ON a.id = ap.artist_id
		WHERE p.id = $1
		ORDER BY a.id DESC;
	`

	rows, err := r.db.QueryContext(ctx, query, id)
	if err != nil {
		return models.Project{}, nil, err
	}
	defer rows.Close()

	var project models.Project
	artists := make([]models.Artist, 0)
	found := false
	for rows.Next() {
		found = true
		var artistID sql.NullInt64
		var artistName sql.NullString
		var artistImageURL sql.NullString
		var artistCreatedAt sql.NullTime
		var artistUpdatedAt sql.NullTime
		var artistDisplayOrder sql.NullInt16
		var artistIsVisible sql.NullBool

		if err := rows.Scan(
			&project.ID, &project.Name, &project.ImageURL,
			&project.DisplayOrder, &project.IsVisible,
			&project.IsFeatured,
			&project.CreatedAt, &project.UpdatedAt,
			&artistID, &artistName, &artistImageURL,
			&artistDisplayOrder, &artistIsVisible,
			&artistCreatedAt, &artistUpdatedAt,
		); err != nil {
			return models.Project{}, nil, err
		}

		if artistID.Valid {
			artists = append(artists, models.Artist{
				ID:           artistID.Int64,
				Name:         artistName.String,
				ImageURL:     artistImageURL,
				DisplayOrder: artistDisplayOrder.Int16,
				IsVisible:    artistIsVisible.Bool,
				CreatedAt:    artistCreatedAt.Time,
				UpdatedAt:    artistUpdatedAt.Time,
			})
		}
	}
	if err := rows.Err(); err != nil {
		return models.Project{}, nil, err
	}
	if !found {
		return models.Project{}, nil, sql.ErrNoRows
	}
	return project, artists, nil
}
