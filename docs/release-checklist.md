# Production release checklist

The application code and container topology are ready for deployment when the
local release gate in `docs/deployment.md` passes. This does not by itself mean
the live service is ready: the VPS, DNS, secrets, email domain, backups, and
live smoke tests remain operator-controlled launch gates.

## Before the first deployment

- Provision a Linux VPS capable of running Docker Compose. The IONOS Web
  Hosting Standard plan cannot run this Go, Next.js, and PostgreSQL stack.
- Point the IONOS `@`, `www`, and `api` DNS records to the VPS as described in
  `docs/deployment.md`.
- Install Docker Engine, the Compose plugin, Caddy, and `rclone` on the VPS.
- Copy `.env.production.example` to the untracked `.env.production` file and
  replace every placeholder with a production value.
- Use independent random values for the database password and `AUTH_SECRET`.
- Restrict the Google Maps key to the production browser origin and required
  Maps APIs.
- Verify the Resend sending domain and set real contact sender and recipient
  addresses.
- Keep PostgreSQL and ports 3000/8080 private; expose only Caddy on ports 80
  and 443.

## Deploy

From the release checkout on the VPS:

```sh
make prod-up
make prod-create-admin
```

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` only for the administrator bootstrap
command, then remove them from `.env.production`. Confirm that the `migrate`
container exited successfully before accepting traffic:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml ps -a
docker compose --env-file .env.production -f docker-compose.prod.yml logs migrate
```

Install and validate the Caddy configuration only after the DNS records point
to the server. Then perform the HTTPS and functional checks listed in
`docs/deployment.md`.

## Required manual smoke tests

- Public home, Matériel, Références, Shop, Tarifs, Contact, and legal pages
  load on desktop and mobile.
- Project and artist media embeds load without content-security-policy errors.
- An administrator can log in, log out, and create, update, reorder, hide, and
  delete a disposable project, artist, hardware item, and notification.
- Price edits appear on the public Tarifs page.
- Uploaded images remain available after restarting the API container.
- The contact form delivers one real message, rejects invalid input, and does
  not expose its contents in application logs.

## Data protection gate

Before launch, enable the off-server backup timer, run a manual backup, and
complete the restoration drill in `docs/backups.md`. Only after that succeeds,
enable the orphan-upload timer from `docs/upload-cleanup.md`.

## Rollback

Keep the previously deployed Git revision available. For application-only
failures, check out that revision and rebuild with `make prod-up`. Do not run a
down migration against production data as an automatic rollback. If a release
has changed or damaged stored data, follow the verified restoration procedure
in `docs/backups.md` and accept the documented downtime.
