package auth

import (
	"bytes"
	"testing"
)

func TestSessionTokenGenerationAndHashing(t *testing.T) {
	token, err := GenerateSessionToken()
	if err != nil {
		t.Fatal(err)
	}
	first, err := HashSessionToken(token, "first-secret")
	if err != nil {
		t.Fatal(err)
	}
	second, err := HashSessionToken(token, "first-secret")
	if err != nil {
		t.Fatal(err)
	}
	if !bytes.Equal(first, second) || len(first) != 32 {
		t.Fatal("session token hash is not stable and 32 bytes long")
	}
	other, err := HashSessionToken(token, "other-secret")
	if err != nil {
		t.Fatal(err)
	}
	if bytes.Equal(first, other) {
		t.Fatal("session token hash did not depend on the secret")
	}
}

func TestSessionTokenRejectsMalformedValues(t *testing.T) {
	for _, token := range []string{"", "not-base64", "c2hvcnQ"} {
		if _, err := HashSessionToken(token, "secret"); err == nil {
			t.Fatalf("HashSessionToken(%q) unexpectedly succeeded", token)
		}
	}
}
