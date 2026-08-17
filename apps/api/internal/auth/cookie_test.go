package auth

import (
	"testing"
	"time"
)

func TestSignedUserID(t *testing.T) {
	value := SignUserID(42, "test-secret", time.Now().Add(time.Hour))

	userID, err := VerifyUserID(value, "test-secret")
	if err != nil {
		t.Fatalf("VerifyUserID returned an error: %v", err)
	}
	if userID != 42 {
		t.Fatalf("VerifyUserID returned %d, want 42", userID)
	}
}

func TestSignedUserIDRejectsExpiredValue(t *testing.T) {
	value := SignUserID(42, "test-secret", time.Now().Add(-time.Second))

	if _, err := VerifyUserID(value, "test-secret"); err == nil {
		t.Fatal("VerifyUserID accepted an expired value")
	}
}

func TestSignedUserIDRejectsTampering(t *testing.T) {
	value := SignUserID(42, "test-secret", time.Now().Add(time.Hour))

	if _, err := VerifyUserID(value, "different-secret"); err == nil {
		t.Fatal("VerifyUserID accepted a value signed with another secret")
	}
}
