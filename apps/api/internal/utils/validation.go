package utils

import (
	"errors"
	"fmt"
	"net/url"
	"regexp"
	"strings"
	"unicode/utf8"
)

const MaxEntityNameLength = 200
const MaxURLLength = 2048

var iframeSrcPattern = regexp.MustCompile(`(?i)\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')`)

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

func NormalizeHTTPURLs(values ...**string) error {
	for _, destination := range values {
		if *destination == nil {
			continue
		}

		value := strings.TrimSpace(**destination)
		if value == "" {
			*destination = nil
			continue
		}
		if len(value) > MaxURLLength {
			return fmt.Errorf("URL must be at most %d characters", MaxURLLength)
		}

		parsed, err := url.Parse(value)
		if err != nil || parsed.Host == "" || (parsed.Scheme != "http" && parsed.Scheme != "https") {
			return errors.New("URL must be an absolute HTTP or HTTPS URL")
		}
		*destination = &value
	}
	return nil
}

func NormalizeOptionalHTTPURLs(fields ...*Optional[string]) error {
	for _, field := range fields {
		if field.Set {
			if err := NormalizeHTTPURLs(&field.Value); err != nil {
				return err
			}
		}
	}
	return nil
}

func NormalizeEmbedURLs(values ...**string) error {
	for _, destination := range values {
		if *destination == nil {
			continue
		}
		value := strings.TrimSpace(**destination)
		if strings.HasPrefix(strings.ToLower(value), "<iframe") {
			matches := iframeSrcPattern.FindStringSubmatch(value)
			if len(matches) == 0 {
				return errors.New("iframe embed must contain a src URL")
			}
			value = matches[1]
			if value == "" {
				value = matches[2]
			}
			*destination = &value
		}
	}
	return NormalizeHTTPURLs(values...)
}

func NormalizeOptionalEmbedURLs(fields ...*Optional[string]) error {
	for _, field := range fields {
		if field.Set {
			if err := NormalizeEmbedURLs(&field.Value); err != nil {
				return err
			}
		}
	}
	return nil
}

func AnyOptionalSet(fields ...*Optional[string]) bool {
	for _, field := range fields {
		if field.Set {
			return true
		}
	}
	return false
}
