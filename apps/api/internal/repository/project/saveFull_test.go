package project

import (
	"context"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"

	projectReq "github.com/PtiCadri/studio/apps/api/internal/requests/project"
)

func TestCreateFullCommitsProjectLinksAndIntegrationsTogether(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	mock.ExpectBegin()
	mock.ExpectQuery("INSERT INTO projects").
		WithArgs("Album", nil).
		WillReturnRows(sqlmock.NewRows([]string{
			"id", "name", "image_url", "display_order", "is_visible", "created_at", "updated_at",
		}).AddRow(12, "Album", nil, 3, true, now, now))
	mock.ExpectQuery("INSERT INTO project_links").
		WithArgs(int64(12), nil, nil, nil, nil, nil).
		WillReturnRows(sqlmock.NewRows([]string{
			"project_id", "spotify_url", "deezer_url", "apple_music_url", "soundcloud_url", "youtube_url",
		}).AddRow(12, nil, nil, nil, nil, nil))
	mock.ExpectQuery("INSERT INTO project_integrations").
		WithArgs(int64(12), nil, nil, nil).
		WillReturnRows(sqlmock.NewRows([]string{
			"project_id", "spotify_embed_url", "deezer_embed_url", "apple_music_embed_url",
		}).AddRow(12, nil, nil, nil))
	mock.ExpectCommit()

	saved, err := New(db).CreateFull(context.Background(), projectReq.CreateFullProject{Name: "Album"})
	if err != nil {
		t.Fatal(err)
	}
	if saved.ID != 12 || saved.Name != "Album" {
		t.Fatalf("unexpected project: %#v", saved)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
