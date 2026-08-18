package utils

import (
	"net/http/httptest"
	"strings"
	"testing"
)

type decodeFixture struct {
	Name string `json:"name"`
}

func TestDecodeJSON(t *testing.T) {
	tests := []struct {
		name    string
		body    string
		wantErr bool
	}{
		{name: "valid body", body: `{"name":"album"}`},
		{name: "unknown field", body: `{"name":"album","typo":true}`, wantErr: true},
		{name: "multiple values", body: `{"name":"album"} {"name":"other"}`, wantErr: true},
		{name: "empty body", body: ``, wantErr: true},
		{name: "oversized body", body: `{"name":"` + strings.Repeat("a", maxJSONBodyBytes) + `"}`, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			request := httptest.NewRequest("POST", "/", strings.NewReader(tt.body))
			var destination decodeFixture

			err := DecodeJSON(request, &destination)
			if (err != nil) != tt.wantErr {
				t.Fatalf("DecodeJSON() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}
