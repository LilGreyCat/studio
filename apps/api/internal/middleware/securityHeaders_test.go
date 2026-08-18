package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestSecurityHeaders(t *testing.T) {
	handler := SecurityHeaders(http.HandlerFunc(func(
		w http.ResponseWriter,
		_ *http.Request,
	) {
		w.WriteHeader(http.StatusNoContent)
	}))

	response := httptest.NewRecorder()
	handler.ServeHTTP(
		response,
		httptest.NewRequest(http.MethodGet, "/health", nil),
	)

	expectedHeaders := map[string]string{
		"X-Content-Type-Options": "nosniff",
		"Referrer-Policy":        "no-referrer",
		"X-Frame-Options":        "DENY",
	}
	for name, expected := range expectedHeaders {
		if actual := response.Header().Get(name); actual != expected {
			t.Errorf("%s = %q, want %q", name, actual, expected)
		}
	}
}
