# Environment variables

This inventory describes configuration currently used by the application.
It contains names and purposes only; real secrets must never be committed.

## API

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| `API_PORT` | No | No | API listen port; defaults to `8080` |
| `DATABASE_URL` | Yes | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes | Yes | HMAC key for administrator sessions |
| `FRONTEND_URL` | Yes | No | Allowed credentialed CORS origin |
| `COOKIE_SECURE` | Production | No | Enables HTTPS-only session cookies |
| `TRUSTED_PROXY_CIDRS` | Behind a proxy | No | Proxy networks allowed to supply API client addresses, as comma-separated CIDRs |

## Administrator bootstrap command

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| `ADMIN_EMAIL` | When creating an admin | No | Initial administrator email |
| `ADMIN_PASSWORD` | When creating an admin | Yes | Initial administrator password |
| `UPLOAD_CLEANUP_GRACE_HOURS` | No | No | Minimum age before an unreferenced upload may be removed; defaults to 24 hours |

## Web application

| Variable | Required | Secret | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Yes | No | Browser-visible base URL for the Go API |
| `API_INTERNAL_URL` | Server rendering | No | Internal API base URL used by the Next.js server |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | For the map | Public credential | Browser Maps API key; restrict by domain and API |
| `RESEND_API_KEY` | For contact submissions | Yes | Resend server API key |
| `CONTACT_TO_EMAIL` | For contact submissions | Sensitive configuration | Contact-form recipient |
| `CONTACT_FROM_EMAIL` | For contact submissions | No | Verified sender address |
| `CONTACT_RATE_LIMIT_MAX` | No | No | Maximum contact submissions per client and window; defaults to `5` |
| `CONTACT_RATE_LIMIT_WINDOW_SECONDS` | No | No | Contact limiter window in seconds; defaults to `600` |

The production reverse proxy must overwrite `X-Real-IP` and
`X-Forwarded-For`; the contact limiter intentionally treats the rightmost
valid forwarded address as the nearest client hop.

## Development database container

The current Compose file supplies `POSTGRES_USER`, `POSTGRES_PASSWORD`, and
`POSTGRES_DB` directly for local development. Production must use unique
secrets, must not publish PostgreSQL publicly, and should supply credentials
through the deployment platform rather than committed configuration.

## Environment policy to introduce

- `.env.example` must list every required variable with non-secret examples.
- Development, test, staging, and production configurations must be distinct.
- Server startup must reject missing or invalid required configuration.
- Production secrets must be stored in the deployment platform or secret
  manager, not in images, Compose files, or Git.
- Public keys must still be restricted to the necessary domains and APIs.
