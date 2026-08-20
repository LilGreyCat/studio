# Studio Web

Next.js frontend for Nhadès Records. It contains the public website, contact
endpoint, and authenticated administration interface.

## Technology

- Next.js App Router and React
- TypeScript
- Material UI and Emotion
- Playwright production smoke tests

## Structure

```text
src/app/         routes, metadata, and the contact route handler
src/components/  public and administration UI
src/hooks/       client state and API access
src/theme/       MUI and Emotion configuration
src/utils/       shared browser/server utilities
public/          versioned static assets
tests/e2e/       production-build browser tests
```

## Development

Use the root Compose stack for normal development:

```sh
make up
make logs-web
```

The application is available at <http://localhost:3000>.

Run the frontend release checks from this directory:

```sh
npm ci
npm run lint
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

`NEXT_PUBLIC_*` variables are embedded into the client build. Changing the
public API URL or Google Maps key therefore requires rebuilding the web image.
See [`../../docs/environment.md`](../../docs/environment.md) for configuration
details.
