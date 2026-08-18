package project

import (
	"context"
	"database/sql"
)

func (r *ProjectRepository) RemoveArtist(
	ctx context.Context,
	projectID int64,
	artistID int64,
) error {
	const query = `
		DELETE FROM artist_projects
		WHERE project_id = $1
		  AND artist_id = $2;
	`

	result, err := r.db.ExecContext(ctx, query, projectID, artistID)
	if err != nil {
		return err
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
