package server

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jackc/pgx/v5/pgconn"

	"github.com/PtiCadri/studio/apps/api/internal/auth"
	"github.com/PtiCadri/studio/apps/api/internal/config"
)

const (
	testAdminSecret  = "hardware-admin-test-secret"
	testFrontendURL  = "http://localhost:3000"
	testSessionToken = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
)

func authenticatedHardwareRequest(method, target, body string) *http.Request {
	request := httptest.NewRequest(method, target, strings.NewReader(body))
	request.Header.Set("Origin", testFrontendURL)
	request.AddCookie(&http.Cookie{
		Name:  "admin_session",
		Value: testSessionToken,
	})
	return request
}

func expectAuthenticatedSession(t *testing.T, mock sqlmock.Sqlmock) {
	t.Helper()
	hash, err := auth.HashSessionToken(testSessionToken, testAdminSecret)
	if err != nil {
		t.Fatal(err)
	}
	mock.ExpectQuery("SELECT session.admin_id").
		WithArgs(hash, sqlmock.AnyArg()).
		WillReturnRows(sqlmock.NewRows([]string{"admin_id"}).AddRow(1))
}

func hardwareTestConfig() config.Config {
	return config.Config{AuthSecret: testAdminSecret, FrontendUrl: testFrontendURL}
}

func TestAdminHardwareRequiresAuthentication(t *testing.T) {
	db, _, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	request := httptest.NewRequest(http.MethodGet, "/admin/hardware", nil)
	response := httptest.NewRecorder()
	NewRouter(db, hardwareTestConfig()).ServeHTTP(response, request)
	if response.Code != http.StatusUnauthorized {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusUnauthorized)
	}
}

func TestAdminHardwareListIncludesHiddenItems(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	expectAuthenticatedSession(t, mock)
	mock.ExpectQuery("FROM hardware_items").WillReturnRows(
		sqlmock.NewRows([]string{
			"id", "slug", "eyebrow", "title", "description", "image_url",
			"image_width", "image_height", "display_order", "is_visible",
			"created_at", "updated_at",
		}).AddRow(8, "hidden", "Hidden", "Hidden", "Hidden", "/matos/hidden.jpg", 100, 100, 1, false, now, now),
	)

	response := httptest.NewRecorder()
	NewRouter(db, hardwareTestConfig()).ServeHTTP(
		response,
		authenticatedHardwareRequest(http.MethodGet, "/admin/hardware", ""),
	)
	if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), `"is_visible":false`) {
		t.Fatalf("unexpected response: %d %s", response.Code, response.Body)
	}
}

func TestAdminHardwareCreateReportsSlugConflict(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	expectAuthenticatedSession(t, mock)
	mock.ExpectQuery("INSERT INTO hardware_items").WillReturnError(&pgconn.PgError{Code: "23505"})
	body := `{"slug":"soundcard","eyebrow":"Interface","title":"Apollo","description":"Description","image_url":"/matos/carte-son.jpg","image_width":100,"image_height":100}`
	response := httptest.NewRecorder()
	NewRouter(db, hardwareTestConfig()).ServeHTTP(
		response,
		authenticatedHardwareRequest(http.MethodPost, "/admin/hardware", body),
	)
	if response.Code != http.StatusConflict {
		t.Fatalf("unexpected response: %d %s", response.Code, response.Body)
	}
}

func TestAdminHardwarePatchAcceptsVisibilityFalse(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	now := time.Now()
	expectAuthenticatedSession(t, mock)
	mock.ExpectQuery("UPDATE hardware_items").WillReturnRows(
		sqlmock.NewRows([]string{
			"id", "slug", "eyebrow", "title", "description", "image_url",
			"image_width", "image_height", "display_order", "is_visible",
			"created_at", "updated_at", "previous_image_url",
		}).AddRow(2, "soundcard", "Interface", "Apollo", "Description", "/matos/carte-son.jpg", 100, 100, 2, false, now, now, "/matos/carte-son.jpg"),
	)

	response := httptest.NewRecorder()
	NewRouter(db, hardwareTestConfig()).ServeHTTP(
		response,
		authenticatedHardwareRequest(http.MethodPatch, "/admin/hardware/2", `{"is_visible":false}`),
	)
	if response.Code != http.StatusOK || !strings.Contains(response.Body.String(), `"is_visible":false`) {
		t.Fatalf("unexpected response: %d %s", response.Code, response.Body)
	}
}

func TestAdminHardwareDeleteReportsNotFound(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	expectAuthenticatedSession(t, mock)
	mock.ExpectQuery("DELETE FROM hardware_items").WillReturnRows(
		sqlmock.NewRows([]string{
			"id", "slug", "eyebrow", "title", "description", "image_url",
			"image_width", "image_height", "display_order", "is_visible",
			"created_at", "updated_at",
		}),
	)

	response := httptest.NewRecorder()
	NewRouter(db, hardwareTestConfig()).ServeHTTP(
		response,
		authenticatedHardwareRequest(http.MethodDelete, "/admin/hardware/999", ""),
	)
	if response.Code != http.StatusNotFound {
		t.Fatalf("unexpected response: %d %s", response.Code, response.Body)
	}
}
