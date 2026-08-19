#!/usr/bin/env bash
set -Eeuo pipefail

if [[ $# -ne 2 || "$1" != "--yes" ]]; then
    echo "Usage: $0 --yes /absolute/path/to/nhadesrecords-TIMESTAMP.tar.gz" >&2
    echo "This replaces the production database and uploaded files." >&2
    exit 1
fi

archive="$(realpath "$2")"
repo_dir="${REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
env_file="${ENV_FILE:-$repo_dir/.env.production}"
compose_file="$repo_dir/docker-compose.prod.yml"

[[ -f "$archive" ]] || { echo "Backup archive not found: $archive" >&2; exit 1; }
[[ -f "$env_file" ]] || { echo "Production environment file not found: $env_file" >&2; exit 1; }

if [[ -f "$archive.sha256" ]]; then
    (cd "$(dirname "$archive")" && sha256sum -c "$(basename "$archive").sha256")
else
    echo "Refusing restore without checksum file: $archive.sha256" >&2
    exit 1
fi

if tar -tzf "$archive" | grep -Eq '(^/|(^|/)\.\.(/|$))'; then
    echo "Backup contains an unsafe path" >&2
    exit 1
fi

restore_dir="$(mktemp -d)"
trap 'rm -rf -- "$restore_dir"' EXIT
tar -C "$restore_dir" -xzf "$archive"
[[ -f "$restore_dir/database.dump" && -d "$restore_dir/uploads" ]] || {
    echo "Backup is missing database.dump or uploads" >&2
    exit 1
}

compose=(docker compose --env-file "$env_file" -f "$compose_file")
postgres_user="$("${compose[@]}" exec -T db printenv POSTGRES_USER)"
postgres_db="$("${compose[@]}" exec -T db printenv POSTGRES_DB)"
"${compose[@]}" stop web api

"${compose[@]}" run --rm --no-deps \
    -v "$restore_dir/uploads:/restore:ro" \
    --entrypoint sh api -c \
    'find /app/uploads -mindepth 1 -delete && cp -a /restore/. /app/uploads/'

"${compose[@]}" exec -T db pg_restore \
    --username "$postgres_user" \
    --dbname "$postgres_db" \
    --clean \
    --if-exists \
    --no-owner \
    --exit-on-error < "$restore_dir/database.dump"

"${compose[@]}" start api web
echo "Restore completed from: $archive"
