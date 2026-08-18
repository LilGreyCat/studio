package utils

import (
	"errors"
	"strings"
	"unicode/utf8"
)

const MaxEntityNameLength = 200

func NormalizeEntityName(name string) (string, error) {
	name = strings.TrimSpace(name)
	if name == "" {
		return "", errors.New("name is required")
	}
	if utf8.RuneCountInString(name) > MaxEntityNameLength {
		return "", errors.New("name must be at most 200 characters")
	}
	return name, nil
}
