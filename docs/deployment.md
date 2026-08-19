# Production deployment

The production topology uses Docker Compose for PostgreSQL, the Go API, and
Next.js. Caddy runs on the host and is the only public HTTP service.

## DNS

In IONOS, point these records to the VPS public address:

| Name | Type | Destination |
| --- | --- | --- |
| `@` | `A` / `AAAA` | VPS address |
| `www` | `A` / `AAAA` | VPS address |
| `api` | `A` / `AAAA` | VPS address |

Remove an `AAAA` record if the server does not actually have working IPv6.
DNS proxying/CDN should initially remain disabled until the direct deployment
has been verified.

## Environment

Copy `.env.production.example` to `.env.production`, replace every placeholder,
and use these public origins:

```dotenv
FRONTEND_URL=https://nhadesrecords.fr
NEXT_PUBLIC_API_URL=https://api.nhadesrecords.fr
COOKIE_SECURE=true
TRUSTED_PROXY_CIDRS=127.0.0.1/32,::1/128
```

Generate unique database and authentication secrets. Restrict the Google Maps
browser key to `https://nhadesrecords.fr/*` and only the APIs the site uses.

## Services and TLS

1. Install a supported Caddy release using the official installation
   instructions for the server operating system.
2. Copy `deploy/Caddyfile` to `/etc/caddy/Caddyfile`.
3. Validate it with `caddy validate --config /etc/caddy/Caddyfile`.
4. Start the application with `make prod-up`.
5. Reload Caddy with `sudo systemctl reload caddy`.

Allow inbound TCP ports 80 and 443. Do not expose PostgreSQL, port 3000, or
port 8080 publicly; Compose binds the web and API ports to loopback.

Caddy obtains and renews certificates automatically when the DNS records point
to the server and ports 80/443 are reachable. `www.nhadesrecords.fr` redirects
to the canonical root domain. API traffic uses `api.nhadesrecords.fr`.

The proxy overwrites forwarded-address headers before sending requests to the
application. This is required for the login and contact rate limits to identify
clients safely. If another CDN is added in front of Caddy, configure its trusted
proxy ranges explicitly before enabling it.

## Verification

Before transferring the release to the server, run the local release gate:

```sh
cd apps/api && go vet ./... && go test ./...
cd ../web
npm ci && npx playwright install chromium
npm run lint && npm run typecheck && npm run test:e2e
cd ../..
export ENV_FILE=.env.production.example
docker compose --env-file .env.production.example -f docker-compose.prod.yml config --quiet
docker compose --env-file .env.production.example -f docker-compose.prod.yml build
```

`ENV_FILE` makes the Compose services read the non-secret example file during
configuration validation. Actual deployment commands continue to use the
untracked `.env.production` file.

After deployment, verify:

```sh
curl -I https://nhadesrecords.fr
curl -I https://www.nhadesrecords.fr
curl -i https://api.nhadesrecords.fr/health
```

Confirm that HTTPS redirects work, the health endpoint returns success, uploads
load through the API domain, the contact form sends successfully, and admin
login is functional. Browser developer tools should show no CSP violations on
the map or music integrations.

Before accepting production traffic, install the automated off-server backup
timer and complete the restoration drill described in `docs/backups.md`.
Install the orphaned-upload maintenance timer described in
`docs/upload-cleanup.md` after the backup timer is working.

The complete launch and rollback checklist is in `docs/release-checklist.md`.
