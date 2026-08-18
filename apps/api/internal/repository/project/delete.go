package project

import (
	"context"
	"database/sql"
)

func (r *ProjectRepository) Delete(
	ctx context.Context,
	id int64,
) error {
	const query = `
		DELETE FROM projects
		WHERE id = $1;
	`

	result, err := r.db.ExecContext(ctx, query, id)
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
