package middleware

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestClientRateLimiterEnforcesAndResetsLimit(t *testing.T) {
	limiter := newClientRateLimiter(2, time.Minute)
	now := time.Unix(1_000, 0)

	if allowed, _ := limiter.allow("client", now); !allowed {
		t.Fatal("first request was unexpectedly rejected")
	}
	if allowed, _ := limiter.allow("client", now); !allowed {
		t.Fatal("second request was unexpectedly rejected")
	}
	if allowed, retryAfter := limiter.allow("client", now); allowed || retryAfter <= 0 {
		t.Fatal("request above the limit was not rejected with a retry delay")
	}
	if allowed, _ := limiter.allow("client", now.Add(time.Minute)); !allowed {
		t.Fatal("request was not allowed after the window reset")
	}
}

func TestRateLimitSeparatesClients(t *testing.T) {
	handler := RateLimit(1, time.Minute)(http.HandlerFunc(func(
		w http.ResponseWriter,
		_ *http.Request,
	) {
		w.WriteHeader(http.StatusNoContent)
	}))

	firstRequest := httptest.NewRequest(http.MethodPost, "/admin/login", nil)
	firstRequest.RemoteAddr = "192.0.2.1:1234"
	handler.ServeHTTP(httptest.NewRecorder(), firstRequest)

	blockedRequest := httptest.NewRequest(http.MethodPost, "/admin/login", nil)
	blockedRequest.RemoteAddr = "192.0.2.1:5678"
	blockedResponse := httptest.NewRecorder()
	handler.ServeHTTP(blockedResponse, blockedRequest)
	if blockedResponse.Code != http.StatusTooManyRequests {
		t.Fatalf("status = %d, want %d", blockedResponse.Code, http.StatusTooManyRequests)
	}
	if blockedResponse.Header().Get("Retry-After") == "" {
		t.Fatal("rate-limited response is missing Retry-After")
	}

	otherRequest := httptest.NewRequest(http.MethodPost, "/admin/login", nil)
	otherRequest.RemoteAddr = "192.0.2.2:1234"
	otherResponse := httptest.NewRecorder()
	handler.ServeHTTP(otherResponse, otherRequest)
	if otherResponse.Code != http.StatusNoContent {
		t.Fatalf("other client status = %d, want %d", otherResponse.Code, http.StatusNoContent)
	}
}
