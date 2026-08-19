package repository

import (
	"context"
	"database/sql"
	"fmt"
)

// Database is implemented by both sql.DB and sql.Tx.
// Repositories depend only on the query operations they use.
type Database interface {
	ExecContext(context.Context, string, ...any) (sql.Result, error)
	QueryContext(context.Context, string, ...any) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...any) *sql.Row
}

type transactionBeginner interface {
	BeginTx(context.Context, *sql.TxOptions) (*sql.Tx, error)
}

// WithinTransaction runs work against one transaction and commits only when
// every repository operation succeeds.
func WithinTransaction(
	ctx context.Context,
	db Database,
	work func(Database) error,
) error {
	beginner, ok := db.(transactionBeginner)
	if !ok {
		return fmt.Errorf("database does not support transactions")
	}

	tx, err := beginner.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback() }()

	if err := work(tx); err != nil {
		return err
	}
	return tx.Commit()
}
