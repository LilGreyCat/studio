package repository

import (
	"context"
	"errors"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestWithinTransactionCommitsSuccessfulWork(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	mock.ExpectBegin()
	mock.ExpectExec("UPDATE projects").WillReturnResult(sqlmock.NewResult(0, 1))
	mock.ExpectCommit()

	err = WithinTransaction(context.Background(), db, func(tx Database) error {
		_, err := tx.ExecContext(context.Background(), "UPDATE projects SET updated_at = NOW()")
		return err
	})
	if err != nil {
		t.Fatal(err)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}

func TestWithinTransactionRollsBackFailedWork(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	workError := errors.New("integration write failed")
	mock.ExpectBegin()
	mock.ExpectRollback()

	err = WithinTransaction(context.Background(), db, func(Database) error {
		return workError
	})
	if !errors.Is(err, workError) {
		t.Fatalf("WithinTransaction() error = %v, want %v", err, workError)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
