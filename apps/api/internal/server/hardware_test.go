package server

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"

	"github.com/PtiCadri/studio/apps/api/internal/config"
)

func TestHardwareRouteReturnsVisibleHardware(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now().UTC().Truncate(time.Microsecond)
	mock.ExpectQuery("FROM hardware_items").WillReturnRows(
		sqlmock.NewRows([]string{
			"id", "slug", "eyebrow", "title", "description", "image_url",
			"image_width", "image_height", "display_order", "is_visible",
			"created_at", "updated_at",
		}).AddRow(
			2,
			"soundcard",
			"Interface principale",
			"Carte Son Apollo Twin USB",
			"Description",
			"/matos/carte-son.jpg",
			1920,
			1920,
			2,
			true,
			now,
			now,
		),
	)

	response := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodGet, "/hardware", nil)
	NewRouter(db, config.Config{FrontendUrl: "http://localhost:3000"}).ServeHTTP(
		response,
		request,
	)

	if response.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d; body: %s", response.Code, http.StatusOK, response.Body)
	}

	var payload []struct {
		Slug         string `json:"slug"`
		ImageURL     string `json:"image_url"`
		DisplayOrder int16  `json:"display_order"`
		IsVisible    bool   `json:"is_visible"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		t.Fatal(err)
	}
	if len(payload) != 1 || payload[0].Slug != "soundcard" ||
		payload[0].ImageURL != "/matos/carte-son.jpg" ||
		payload[0].DisplayOrder != 2 || !payload[0].IsVisible {
		t.Fatalf("unexpected response: %+v", payload)
	}

	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatal(err)
	}
}
