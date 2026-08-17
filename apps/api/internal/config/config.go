package config

import (
	"os"
	"strconv"
)

type Config struct {
	Port         string
	DatabaseUrl  string
	AuthSecret   string
	FrontendUrl  string
	CookieSecure bool
}

// Load returns a Config object from environment variables.
// If the environment variable "API_PORT" is empty, it defaults to "8080".
// The other environment variables are "DATABASE_URL", "AUTH_SECRET" and "FRONTEND_URL".
func Load() Config {
	port := os.Getenv("API_PORT")
	if port == "" {
		port = "8080"
	}

	cookieSecure, _ := strconv.ParseBool(os.Getenv("COOKIE_SECURE"))

	return Config{
		Port:         port,
		DatabaseUrl:  os.Getenv("DATABASE_URL"),
		AuthSecret:   os.Getenv("AUTH_SECRET"),
		FrontendUrl:  os.Getenv("FRONTEND_URL"),
		CookieSecure: cookieSecure,
	}
}
