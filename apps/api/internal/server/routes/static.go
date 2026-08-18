package routes

import (
	"net/http"
	"path/filepath"
	"strings"

	"github.com/go-chi/chi/v5"
)

func RegisterStatic(r chi.Router) {
	fileServer := http.FileServer(http.Dir("./uploads"))
	r.Handle(
		"/uploads/*",
		http.StripPrefix("/uploads/", uploadFileHandler(fileServer)),
	)
}

var publicImageExtensions = map[string]bool{
	".jpg":  true,
	".jpeg": true,
	".png":  true,
	".webp": true,
}

func uploadFileHandler(fileServer http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/") ||
			!publicImageExtensions[strings.ToLower(filepath.Ext(r.URL.Path))] {
			http.NotFound(w, r)
			return
		}

		fileServer.ServeHTTP(w, r)
	})
}
