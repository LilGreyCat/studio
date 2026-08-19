package admin

import (
	"context"
	"time"
)

// ReplaceSessions revokes all previous sessions for an administrator before
// creating the new login session.
func (r *AdminRepository) ReplaceSessions(
	ctx context.Context,
	adminID int64,
	tokenHash []byte,
	expiresAt time.Time,
) error {
	const query = `
		WITH revoked AS (
			DELETE FROM admin_sessions WHERE admin_id = $1
		)
		INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
		VALUES ($2, $1, $3);
	`
	_, err := r.db.ExecContext(ctx, query, adminID, tokenHash, expiresAt)
	return err
}

func (r *AdminRepository) GetSessionAdminID(
	ctx context.Context,
	tokenHash []byte,
	now time.Time,
) (int64, error) {
	const query = `
		SELECT session.admin_id
		FROM admin_sessions AS session
		JOIN admin_users AS admin ON admin.id = session.admin_id
		WHERE session.token_hash = $1 AND session.expires_at > $2;
	`
	var adminID int64
	err := r.db.QueryRowContext(ctx, query, tokenHash, now).Scan(&adminID)
	return adminID, err
}

func (r *AdminRepository) DeleteSession(ctx context.Context, tokenHash []byte) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM admin_sessions WHERE token_hash = $1`, tokenHash)
	return err
}
