package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
	"time"
)

// SignUserID generates a signed user ID and expiry cookie value.
// The returned string is a valid cookie value.
func SignUserID(userID int64, secret string, expiresAt time.Time) string {
	payload := fmt.Sprintf("%d:%d", userID, expiresAt.Unix())

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(payload))
	signature := base64.URLEncoding.EncodeToString(mac.Sum(nil))

	return payload + "." + signature
}

// VerifyUserID verifies the signature and rejects expired cookie values.
func VerifyUserID(value string, secret string) (int64, error) {
	parts := strings.SplitN(value, ".", 2)
	if len(parts) != 2 {
		return 0, fmt.Errorf("invalid cookie format")
	}

	payload := parts[0]
	givenSignature := parts[1]

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(payload))
	expectedSignature := base64.URLEncoding.EncodeToString(mac.Sum(nil))

	if !hmac.Equal(
		[]byte(givenSignature),
		[]byte(expectedSignature),
	) {
		return 0, fmt.Errorf("invalid signature")
	}

	payloadParts := strings.SplitN(payload, ":", 2)
	if len(payloadParts) != 2 {
		return 0, fmt.Errorf("invalid cookie payload")
	}

	userID, err := strconv.ParseInt(payloadParts[0], 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid user id: %w", err)
	}

	expiresAt, err := strconv.ParseInt(payloadParts[1], 10, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid expiry: %w", err)
	}
	if time.Now().Unix() >= expiresAt {
		return 0, fmt.Errorf("cookie expired")
	}

	return userID, nil
}
