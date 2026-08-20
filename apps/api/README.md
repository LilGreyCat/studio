# Studio API

Go HTTP API for Nhadès Records. It owns persistence, administrator
authentication, public content endpoints, uploads, and database migrations.

## Structure

```text
cmd/api/              API entrypoint
cmd/create-admin/     administrator bootstrap command
cmd/cleanup-uploads/  orphan-upload maintenance command
internal/handlers/    HTTP handlers
internal/repository/  PostgreSQL queries and transactions
internal/middleware/  authentication, origin, rate-limit, and security layers
internal/storage/     database and upload storage
migrations/           ordered up/down SQL migrations
```

## Development

The normal development workflow runs the API through the root Compose stack:

```sh
make up
make logs-api
```

The API listens on <http://localhost:8080>; `GET /health` returns `ok` when the
database is reachable.

Run the backend release checks directly from this directory:

```sh
go vet ./...
go test ./...
```

Configuration is loaded from the root `.env` file. See
[`../../docs/environment.md`](../../docs/environment.md) for the complete
contract. Database changes must be introduced as paired migration files and
must not be edited after production use.
