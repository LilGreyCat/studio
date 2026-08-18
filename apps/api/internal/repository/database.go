package repository

import (
	"context"
	"database/sql"
)

// Database is implemented by both sql.DB and sql.Tx.
// Repositories depend only on the query operations they use.
type Database interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
	QueryContext(context.Context, string, ...any) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...any) *sql.Row
}
