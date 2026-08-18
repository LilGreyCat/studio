# Application baseline

Recorded on 2026-08-18 from commit `e8aadf2` on branch
`refactor/production-readiness`.

This document defines the behavior that must remain stable while the
application is fixed and refactored. Intentional behavior or visual changes
must be reviewed separately.

## Public web application

The development frontend is served at `http://localhost:3000` and exposes:

| Route | Purpose | Baseline status |
| --- | --- | --- |
| `/` | Studio presentation and services | HTTP 200 |
| `/references` | Published projects/albums and integrations | HTTP 200 |
| `/tarifs` | Services and pricing | HTTP 200 |
| `/materiel` | Studio equipment | HTTP 200 |
| `/contact` | Contact information and inquiry form | HTTP 200 |
| `/shop` | Shop page | HTTP 200 |
| `/admin` | Administrator login/dashboard | HTTP 200 |

The contact form validates its fields in the browser and submits to
`POST /api/contact`, which sends an email through Resend.

## Visual contract

The following characteristics are intentional and must be preserved by
default:

- Dark radial-gradient background with three continuously moving star layers.
- Star positions, sizes, density, colors, and animation speeds.
- Fixed glass-effect navigation bar with animated border.
- Glass-effect cards, typography, spacing, responsive layouts, and icons.
- Existing carousel, lightbox, service-card, menu, and integration behavior.
- Existing desktop and mobile layout hierarchy.

The starfield compositor hints present at the start of this branch are
accepted as part of the baseline. They change layer composition only, not the
intended appearance or timing.

Automated browser screenshots could not be captured during this baseline
because the in-app browser connection was unavailable. Visual comparisons
must therefore be captured before the first visual-component refactor, or
performed manually against this branch.

## Public API

The development API is served at `http://localhost:8080`.

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/health` | Database readiness |
| GET | `/artists/` | List artists |
| GET | `/artists/{id}` | Artist details and projects |
| GET | `/artists/{id}/links` | Artist external links |
| GET | `/artists/{id}/integrations` | Artist embeds |
| GET | `/projects/` | List projects/albums |
| GET | `/projects/{id}` | Project details and artists |
| GET | `/projects/{id}/links` | Project external links |
| GET | `/projects/{id}/integrations` | Project embeds |

At baseline, `/health`, `/artists/`, and `/projects/` return HTTP 200.

## Administrator workflow

The administrator can:

1. Log in and retrieve the current session.
2. Log out.
3. Upload artist and project images.
4. Create, update, and delete artists.
5. Create, update, and delete projects/albums.
6. Replace or partially update links and integrations.
7. Associate artists with projects and remove associations.

Protected routes use the `admin_session` HTTP-only signed cookie. Its
baseline lifetime is 24 hours.

## Database baseline

PostgreSQL reports migration version `9` with `dirty = false`.

The development database contained the following records when this baseline
was recorded:

| Table | Rows |
| --- | ---: |
| `artists` | 2 |
| `projects` | 3 |
| `artist_projects` | 3 |
| `admin_users` | 1 |

Development data is operational state and is not intended to be committed as
seed data.

Migration `0009_compact_identifier_types` remains in place. The project will
not add another migration solely to return these identifiers to `BIGINT`.

## Known baseline defects

These are existing defects, not accepted production behavior:

- Frontend type checking fails on MUI style type mismatches in the studio-name
  constants and missing carousel lightbox style exports.
- The references page performs redundant per-project requests.
- PATCH requests cannot distinguish omitted nullable values from explicit
  `null` and use read-modify-write updates.
- Several mutation endpoints do not distinguish missing resources and
  database conflicts accurately.
- The contact endpoint logs personal data, does not escape HTML input, and has
  no abuse protection.
- The development containers are not suitable for production.
- Uploaded files are local to the API filesystem model.
- Automated coverage is minimal.

These defects are tracked by the production-readiness plan and may be fixed
without being treated as behavior regressions.
