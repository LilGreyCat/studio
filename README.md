# Nhadès Records

Production website and content-management application for Nhadès Records, a
recording studio in Bihorel, France.

[![CI](https://github.com/PtiCadri/studio/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/PtiCadri/studio/actions/workflows/ci.yml)

The repository contains a public Next.js website, an authenticated
administration panel, a Go HTTP API, PostgreSQL migrations, and an operational
Docker deployment for a single VPS.

## Features

- Responsive public pages for the studio, equipment, references, pricing,
  contact information, legal information, and shop preview
- Database-managed projects, artists, equipment, prices, and scheduled
  notifications
- Image uploads with validation and orphan cleanup
- Secure administrator sessions with credentialed CORS and origin checks
- Contact-form delivery through Resend with abuse protection
- Google Maps Embed integration
- Automated database/upload backups and a documented restoration workflow

## Architecture

```text
Browser
  ├── nhadesrecords.fr ──────> Caddy ──> Next.js web container
  └── api.nhadesrecords.fr ──> Caddy ──> Go API container
                                             ├── PostgreSQL volume
                                             └── Uploads volume
```

| Component       | Technology                              | Location              |
| --------------- | --------------------------------------- | --------------------- |
| Web application | Next.js 16, React 19, TypeScript, MUI   | `apps/web`            |
| API             | Go 1.25, Chi, pgx                       | `apps/api`            |
| Database        | PostgreSQL 16, versioned SQL migrations | `apps/api/migrations` |
| Operations      | Docker Compose, Caddy, systemd, rclone  | `deploy`, `docs`      |

## Local development

### Requirements

- Docker Desktop with Docker Compose
- GNU Make (or run the equivalent Compose commands directly)

Create the local configuration:

```sh
cp .env.example .env
```

Replace the service credentials in `.env`, then start the stack:

```sh
make up
```

The services are available at:

- Web: <http://localhost:3000>
- API: <http://localhost:8080>
- API health: <http://localhost:8080/health>
- PostgreSQL: `localhost:55432`

Useful commands:

```sh
make logs       # Follow all development logs
make logs-api   # Follow API logs
make logs-web   # Follow web logs
make down       # Stop the development stack
```

## Quality checks

Backend:

```sh
cd apps/api
go vet ./...
go test ./...
```

Frontend:

```sh
cd apps/web
npm ci
npx playwright install chromium
npm run lint
npm run typecheck
npm run test:e2e
```

Pull requests and the `main` branch are checked by GitHub Actions.

## Configuration and secrets

The complete variable inventory is documented in
[`docs/environment.md`](docs/environment.md). Start from:

- `.env.example` for local development
- `.env.production.example` for production

Real `.env` files are intentionally ignored. Never commit database passwords,
administrator credentials, Resend keys, Google API keys, or authentication
secrets.

## Production deployment

Production runs on a Linux VPS with Docker Compose and host-level Caddy. Begin
with:

- [`docs/deployment.md`](docs/deployment.md)
- [`docs/release-checklist.md`](docs/release-checklist.md)
- [`docs/backups.md`](docs/backups.md)
- [`docs/upload-cleanup.md`](docs/upload-cleanup.md)

The standard deployment command is:

```sh
make prod-up
```

Do not expose PostgreSQL or container ports 3000/8080 publicly. Only Caddy
should accept public traffic on ports 80 and 443.

## Repository workflow

`main` is the deployable branch. Changes should be made on focused
branches and merged only after CI passes. See [`CONTRIBUTING.md`](CONTRIBUTING.md)
and [`SECURITY.md`](SECURITY.md).
