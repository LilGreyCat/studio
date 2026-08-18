package artist

import (
	"context"
	"database/sql"
	"errors"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestDeleteReturnsDeletedArtist(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	query := regexp.QuoteMeta(`
		DELETE FROM artists
		WHERE id = $1
		RETURNING id, name, image_url, created_at, updated_at;
	`)
	mock.ExpectQuery(query).WithArgs(int64(7)).WillReturnRows(
		sqlmock.NewRows([]string{"id", "name", "image_url", "created_at", "updated_at"}).
			AddRow(7, "Artist", "/uploads/artist.webp", now, now),
	)

	deleted, err := New(db).Delete(context.Background(), 7)
	if err != nil {
		t.Fatal(err)
	}
	if deleted.ID != 7 || deleted.Name != "Artist" || deleted.ImageURL.String != "/uploads/artist.webp" {
		t.Fatalf("unexpected deleted artist: %+v", deleted)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}

func TestDeleteReturnsNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	mock.ExpectQuery("DELETE FROM artists").WithArgs(int64(99)).WillReturnError(sql.ErrNoRows)
	_, err = New(db).Delete(context.Background(), 99)
	if !errors.Is(err, sql.ErrNoRows) {
		t.Fatalf("Delete() error = %v, want sql.ErrNoRows", err)
	}
}
