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

func contextWithRoute(request *http.Request, routeContext *chi.Context) context.Context {
	return context.WithValue(request.Context(), chi.RouteCtxKey, routeContext)
}
