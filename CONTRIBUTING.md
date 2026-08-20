# Contributing

## Workflow

1. Branch from `production` using a focused name such as `fix/login-session`
   or `feat/artist-search`.
2. Keep changes scoped and preserve existing visual and behavioral contracts
   unless the change explicitly updates them.
3. Use concise conventional commit messages, for example
   `fix(auth): handle expired sessions`.
4. Run the relevant checks locally.
5. Open a pull request into `production` and wait for CI to pass.

Do not commit `.env` files, credentials, production exports, database dumps,
or uploaded customer data.

## Required checks

```sh
cd apps/api
go vet ./...
go test ./...

cd ../web
npm ci
npm run lint
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Database changes require paired `up` and `down` migrations. Once a migration
has run in production, add a new migration instead of rewriting its history.

Operational changes must keep `docs/deployment.md`, `docs/environment.md`, and
the release checklist accurate.
