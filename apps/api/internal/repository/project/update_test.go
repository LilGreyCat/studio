package project

import (
	"context"
	"regexp"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
)

func TestUpdatePassesPatchPresenceSeparatelyFromValues(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	name := "Renamed project"
	query := regexp.QuoteMeta(`
		WITH previous AS (
			SELECT image_url
			FROM projects
			WHERE id = $1
			FOR UPDATE
		)
		UPDATE projects AS p
		SET
			name = CASE WHEN $2 THEN $3 ELSE p.name END,
			image_url = CASE WHEN $4 THEN $5 ELSE p.image_url END,
			updated_at = NOW()
		FROM previous
		WHERE p.id = $1
		RETURNING
			p.id,
			p.name,
			p.image_url,
			p.created_at,
			p.updated_at,
			previous.image_url;
	`)
	mock.ExpectQuery(query).
		WithArgs(int64(4), true, &name, false, nil).
		WillReturnRows(sqlmock.NewRows([]string{
			"id", "name", "image_url", "created_at", "updated_at", "previous_image_url",
		}).AddRow(4, name, "/uploads/current.webp", now, now, "/uploads/current.webp"))

	updated, previousImage, err := New(db).Update(context.Background(), 4, true, &name, false, nil)
	if err != nil {
		t.Fatal(err)
	}
	if updated.Name != name || previousImage == nil || *previousImage != "/uploads/current.webp" {
		t.Fatalf("unexpected update result: %+v, previous image %v", updated, previousImage)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
