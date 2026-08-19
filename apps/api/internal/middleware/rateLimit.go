package middleware

import (
	"net"
	"net/http"
	"net/netip"
	"strconv"
	"strings"
	"sync"
	"time"
)

const maxTrackedRateLimitClients = 10_000

type rateLimitEntry struct {
	count   int
	resetAt time.Time
}

type clientRateLimiter struct {
	mu          sync.Mutex
	entries     map[string]rateLimitEntry
	maxRequests int
	window      time.Duration
}

func newClientRateLimiter(maxRequests int, window time.Duration) *clientRateLimiter {
	return &clientRateLimiter{
		entries:     make(map[string]rateLimitEntry),
		maxRequests: maxRequests,
		window:      window,
	}
}

func (limiter *clientRateLimiter) allow(
	clientKey string,
	now time.Time,
) (bool, time.Duration) {
	limiter.mu.Lock()
	defer limiter.mu.Unlock()

	entry, exists := limiter.entries[clientKey]
	if !exists || !now.Before(entry.resetAt) {
		if len(limiter.entries) >= maxTrackedRateLimitClients {
			limiter.prune(now)
		}

		limiter.entries[clientKey] = rateLimitEntry{
			count:   1,
			resetAt: now.Add(limiter.window),
		}
		return true, 0
	}

	if entry.count >= limiter.maxRequests {
		return false, entry.resetAt.Sub(now)
	}

	entry.count++
	limiter.entries[clientKey] = entry
	return true, 0
}

func (limiter *clientRateLimiter) prune(now time.Time) {
	for key, entry := range limiter.entries {
		if !now.Before(entry.resetAt) {
			delete(limiter.entries, key)
		}
	}

	if len(limiter.entries) < maxTrackedRateLimitClients {
		return
	}

	for key := range limiter.entries {
		delete(limiter.entries, key)
		break
	}
}

func remoteClientKey(remoteAddress string) string {
	host, _, err := net.SplitHostPort(remoteAddress)
	if err == nil {
		return host
	}
	return remoteAddress
}

func clientKey(r *http.Request, trustedProxies []netip.Prefix) string {
	directText := remoteClientKey(r.RemoteAddr)
	direct, err := netip.ParseAddr(directText)
	if err != nil || !addressInPrefixes(direct, trustedProxies) {
		return directText
	}

	forwarded := strings.Split(r.Header.Get("X-Forwarded-For"), ",")
	for index := len(forwarded) - 1; index >= 0; index-- {
		candidate, err := netip.ParseAddr(strings.TrimSpace(forwarded[index]))
		if err != nil {
			continue
		}
		if !addressInPrefixes(candidate, trustedProxies) {
			return candidate.String()
		}
	}
	return directText
}

func addressInPrefixes(address netip.Addr, prefixes []netip.Prefix) bool {
	for _, prefix := range prefixes {
		if prefix.Contains(address) {
			return true
		}
	}
	return false
}

// RateLimit restricts requests by client address. Forwarded addresses are
// considered only when the direct peer belongs to a configured trusted proxy.
func RateLimit(
	maxRequests int,
	window time.Duration,
	trustedProxies []netip.Prefix,
) func(http.Handler) http.Handler {
	limiter := newClientRateLimiter(maxRequests, window)

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			allowed, retryAfter := limiter.allow(
				clientKey(r, trustedProxies),
				time.Now(),
			)
			if !allowed {
				retryAfterSeconds := max(
					1,
					int((retryAfter+time.Second-1)/time.Second),
				)
				w.Header().Set("Retry-After", strconv.Itoa(retryAfterSeconds))
				http.Error(w, "too many requests", http.StatusTooManyRequests)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
