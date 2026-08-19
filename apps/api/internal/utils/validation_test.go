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
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "Spotify iframe",
			input:    `<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/album/4L6E6dsKYBoLp33NQLe0zL?utm_source=generator&si=2ec667a9909444cf" width="100%" height="352"></iframe>`,
			expected: "https://open.spotify.com/embed/album/4L6E6dsKYBoLp33NQLe0zL?utm_source=generator&si=2ec667a9909444cf",
		},
		{
			name:     "Deezer iframe",
			input:    `<iframe title="deezer-widget" src="https://widget.deezer.com/widget/dark/album/811834641" width="100%" height="300"></iframe>`,
			expected: "https://widget.deezer.com/widget/dark/album/811834641",
		},
		{
			name:     "Apple Music iframe",
			input:    `<iframe allow="autoplay *; encrypted-media *" src="https://embed.music.apple.com/fr/album/s-p-a-c-e/1836310530"></iframe>`,
			expected: "https://embed.music.apple.com/fr/album/s-p-a-c-e/1836310530",
		},
		{
			name:     "direct URL",
			input:    "https://open.spotify.com/embed/album/1",
			expected: "https://open.spotify.com/embed/album/1",
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			embedValue := test.input
			embed := &embedValue
			if err := NormalizeEmbedURLs(&embed); err != nil {
				t.Fatal(err)
			}
			if embed == nil || *embed != test.expected {
				t.Fatalf("iframe src was not extracted: %v", embed)
			}
		})
	}
}

func contextWithRoute(request *http.Request, routeContext *chi.Context) context.Context {
	return context.WithValue(request.Context(), chi.RouteCtxKey, routeContext)
}
