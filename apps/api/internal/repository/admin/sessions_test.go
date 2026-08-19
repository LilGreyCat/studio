package admin

import (
	"context"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestReplaceSessionsRevokesPreviousLogins(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	hash := make([]byte, 32)
	expiresAt := time.Now().Add(time.Hour)
	mock.ExpectExec(regexp.QuoteMeta(`
		WITH revoked AS (
			DELETE FROM admin_sessions WHERE admin_id = $1
		)
		INSERT INTO admin_sessions (token_hash, admin_id, expires_at)
		VALUES ($2, $1, $3);
	`)).WithArgs(int64(7), hash, expiresAt).WillReturnResult(sqlmock.NewResult(0, 1))

	if err := New(db).ReplaceSessions(context.Background(), 7, hash, expiresAt); err != nil {
		t.Fatal(err)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}

func TestGetSessionAdminIDRequiresUnexpiredSession(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	hash := make([]byte, 32)
	now := time.Now()
	mock.ExpectQuery("SELECT session.admin_id").WithArgs(hash, now).
		WillReturnRows(sqlmock.NewRows([]string{"admin_id"}).AddRow(7))

	id, err := New(db).GetSessionAdminID(context.Background(), hash, now)
	if err != nil {
		t.Fatal(err)
	}
	if id != 7 {
		t.Fatalf("admin id = %d, want 7", id)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
