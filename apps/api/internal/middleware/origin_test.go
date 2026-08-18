package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestRequireOriginAllowsConfiguredOriginForMutation(t *testing.T) {
	handler := RequireOrigin("https://studio.example.com")(
		http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
			w.WriteHeader(http.StatusNoContent)
		}),
	)
	request := httptest.NewRequest(http.MethodPost, "/admin/uploads", nil)
	request.Header.Set("Origin", "https://studio.example.com")
	response := httptest.NewRecorder()

	handler.ServeHTTP(response, request)

	if response.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusNoContent)
	}
}

func TestRequireOriginRejectsMissingOrDifferentOriginForMutation(t *testing.T) {
	tests := []struct {
		name   string
		origin string
	}{
		{name: "missing origin"},
		{name: "different origin", origin: "https://attacker.example.com"},
		{name: "opaque origin", origin: "null"},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			handler := RequireOrigin("https://studio.example.com")(
				http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
					w.WriteHeader(http.StatusNoContent)
				}),
			)
			request := httptest.NewRequest(http.MethodPatch, "/admin/projects/1", nil)
			if test.origin != "" {
				request.Header.Set("Origin", test.origin)
			}
			response := httptest.NewRecorder()

			handler.ServeHTTP(response, request)

			if response.Code != http.StatusForbidden {
				t.Fatalf("status = %d, want %d", response.Code, http.StatusForbidden)
			}
		})
	}
}

func TestRequireOriginAllowsSafeMethodsWithoutOrigin(t *testing.T) {
	for _, method := range []string{http.MethodGet, http.MethodHead, http.MethodOptions} {
		t.Run(method, func(t *testing.T) {
			handler := RequireOrigin("https://studio.example.com")(
				http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
					w.WriteHeader(http.StatusNoContent)
				}),
			)
			response := httptest.NewRecorder()

			handler.ServeHTTP(
				response,
				httptest.NewRequest(method, "/admin/me", nil),
			)

			if response.Code != http.StatusNoContent {
				t.Fatalf("status = %d, want %d", response.Code, http.StatusNoContent)
			}
		})
	}
}
