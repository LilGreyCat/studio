package middleware

import "net/http"

func isSafeMethod(method string) bool {
	return method == http.MethodGet ||
		method == http.MethodHead ||
		method == http.MethodOptions
}

// RequireOrigin rejects browser-originated state changes unless they come
// from the configured frontend origin.
func RequireOrigin(allowedOrigin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if isSafeMethod(r.Method) {
				next.ServeHTTP(w, r)
				return
			}

			if r.Header.Get("Origin") != allowedOrigin {
				http.Error(w, "forbidden origin", http.StatusForbidden)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
