package artist

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"

	artistReq "github.com/PtiCadri/studio/apps/api/internal/requests/artist"
)

func TestCreateFullRollsBackWhenRelatedDataCannotBeSaved(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	mock.ExpectBegin()
	mock.ExpectQuery("INSERT INTO artists").
		WithArgs("Artiste", nil).
		WillReturnRows(sqlmock.NewRows([]string{
			"id", "name", "image_url", "display_order", "is_visible", "created_at", "updated_at",
		}).AddRow(8, "Artiste", nil, 2, true, now, now))
	mock.ExpectQuery("INSERT INTO artist_links").
		WithArgs(int64(8), nil, nil, nil, nil, nil, nil, nil).
		WillReturnError(errors.New("links unavailable"))
	mock.ExpectRollback()

	_, err = New(db).CreateFull(context.Background(), artistReq.CreateFullArtist{Name: "Artiste"})
	if err == nil {
		t.Fatal("expected related-data failure")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
