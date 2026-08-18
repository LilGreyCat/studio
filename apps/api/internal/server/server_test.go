package server

import (
	"net/http"
	"testing"
)

func TestNewConfiguresHTTPTimeouts(t *testing.T) {
	handler := http.HandlerFunc(func(http.ResponseWriter, *http.Request) {})
	server := New(":8080", handler)

	if server.httpServer.ReadHeaderTimeout != readHeaderTimeout {
		t.Errorf(
			"ReadHeaderTimeout = %v, want %v",
			server.httpServer.ReadHeaderTimeout,
			readHeaderTimeout,
		)
	}
	if server.httpServer.ReadTimeout != readTimeout {
		t.Errorf(
			"ReadTimeout = %v, want %v",
			server.httpServer.ReadTimeout,
			readTimeout,
		)
	}
	if server.httpServer.WriteTimeout != writeTimeout {
		t.Errorf(
			"WriteTimeout = %v, want %v",
			server.httpServer.WriteTimeout,
			writeTimeout,
		)
	}
	if server.httpServer.IdleTimeout != idleTimeout {
		t.Errorf(
			"IdleTimeout = %v, want %v",
			server.httpServer.IdleTimeout,
			idleTimeout,
		)
	}
}
