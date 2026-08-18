package httpapi

import (
	"context"
	"database/sql"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestParseIDWritesExistingErrorContract(t *testing.T) {
	request := httptest.NewRequest("GET", "/", nil)
	routeContext := chi.NewRouteContext()
	routeContext.URLParams.Add("id", "invalid")
	request = request.WithContext(context.WithValue(request.Context(), chi.RouteCtxKey, routeContext))
	recorder := httptest.NewRecorder()

	if _, ok := ParseID(recorder, request, "id", "artist"); ok {
		t.Fatal("invalid id was accepted")
	}
	if recorder.Code != 400 || recorder.Body.String() != "invalid artist id\n" {
		t.Fatalf("unexpected response: %d %q", recorder.Code, recorder.Body.String())
	}
}

func TestDecodeJSONWritesExistingErrorContract(t *testing.T) {
	request := httptest.NewRequest("POST", "/", strings.NewReader(`{"unknown":true}`))
	recorder := httptest.NewRecorder()
	var destination struct {
		Name string `json:"name"`
	}

	if DecodeJSON(recorder, request, &destination) {
		t.Fatal("invalid body was accepted")
	}
	if recorder.Code != 400 || recorder.Body.String() != "invalid request body\n" {
		t.Fatalf("unexpected response: %d %q", recorder.Code, recorder.Body.String())
	}
}

func TestWriteRepositoryError(t *testing.T) {
	recorder := httptest.NewRecorder()
	WriteRepositoryError(recorder, sql.ErrNoRows, "artist not found", "failed to fetch artist")
	if recorder.Code != 404 || recorder.Body.String() != "artist not found\n" {
		t.Fatalf("unexpected response: %d %q", recorder.Code, recorder.Body.String())
	}
}
