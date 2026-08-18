package utils

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/go-chi/chi/v5"
)

func TestNormalizeEntityName(t *testing.T) {
	name, err := NormalizeEntityName("  Album  ")
	if err != nil || name != "Album" {
		t.Fatalf("NormalizeEntityName() = %q, %v", name, err)
	}
	if _, err := NormalizeEntityName("   "); err == nil {
		t.Error("blank name was accepted")
	}
	if _, err := NormalizeEntityName(strings.Repeat("a", MaxEntityNameLength+1)); err == nil {
		t.Error("oversized name was accepted")
	}
}

func TestParseIDParam(t *testing.T) {
	for _, id := range []string{"0", "-1", "2147483648", "invalid"} {
		t.Run(id, func(t *testing.T) {
			request := httptest.NewRequest("GET", "/", nil)
			routeContext := chi.NewRouteContext()
			routeContext.URLParams.Add("id", id)
			request = request.WithContext(contextWithRoute(request, routeContext))
			if _, err := ParseIDParam(request, "id"); err == nil {
				t.Fatalf("ParseIDParam() accepted %q", id)
			}
		})
	}
}

func TestNormalizeHTTPURLs(t *testing.T) {
	validValue := "  https://example.com/album?id=1  "
	valid := &validValue
	if err := NormalizeHTTPURLs(&valid); err != nil {
		t.Fatal(err)
	}
	if valid == nil || *valid != "https://example.com/album?id=1" {
		t.Fatalf("URL was not normalized: %v", valid)
	}

	emptyValue := "   "
	empty := &emptyValue
	if err := NormalizeHTTPURLs(&empty); err != nil || empty != nil {
		t.Fatalf("empty URL was not normalized to nil: %v, %v", empty, err)
	}

	for _, invalid := range []string{"javascript:alert(1)", "/relative", "https://"} {
		value := &invalid
		if err := NormalizeHTTPURLs(&value); err == nil {
			t.Errorf("invalid URL %q was accepted", invalid)
		}
	}
}

func TestNormalizeEmbedURLs(t *testing.T) {
	embedValue := `<iframe title='player' src='https://open.spotify.com/embed/album/1'></iframe>`
	embed := &embedValue
	if err := NormalizeEmbedURLs(&embed); err != nil {
		t.Fatal(err)
	}
	if embed == nil || *embed != "https://open.spotify.com/embed/album/1" {
		t.Fatalf("iframe src was not extracted: %v", embed)
	}
}

func contextWithRoute(request *http.Request, routeContext *chi.Context) context.Context {
	return context.WithValue(request.Context(), chi.RouteCtxKey, routeContext)
}
