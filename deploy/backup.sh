#!/usr/bin/env bash
set -Eeuo pipefail

repo_dir="${REPO_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
env_file="${ENV_FILE:-$repo_dir/.env.production}"
compose_file="$repo_dir/docker-compose.prod.yml"

if [[ ! -f "$env_file" ]]; then
    echo "Production environment file not found: $env_file" >&2
    exit 1
fi

backup_dir="${BACKUP_DIR:-/var/backups/nhadesrecords}"
retention_days="${BACKUP_RETENTION_DAYS:-14}"
remote="${BACKUP_REMOTE:-}"

if [[ "$backup_dir" != /* || "$backup_dir" == "/" ]]; then
    echo "BACKUP_DIR must be a specific absolute directory" >&2
    exit 1
fi
if [[ ! "$retention_days" =~ ^[1-9][0-9]*$ ]]; then
    echo "BACKUP_RETENTION_DAYS must be a positive integer" >&2
    exit 1
fi
if [[ ! "$remote" =~ ^[A-Za-z0-9_-]+:.+ ]]; then
    echo "BACKUP_REMOTE must be a scoped rclone destination such as b2:bucket/nhadesrecords" >&2
    exit 1
fi
for command in docker tar sha256sum rclone; do
    command -v "$command" >/dev/null || { echo "Missing required command: $command" >&2; exit 1; }
done

compose=(docker compose --env-file "$env_file" -f "$compose_file")
for service in db api web; do
    if ! "${compose[@]}" ps --status running --services | grep -qx "$service"; then
        echo "Production service is not running: $service" >&2
        exit 1
    fi
done
postgres_user="$("${compose[@]}" exec -T db printenv POSTGRES_USER)"
postgres_db="$("${compose[@]}" exec -T db printenv POSTGRES_DB)"

mkdir -p "$backup_dir"
stage="$(mktemp -d "$backup_dir/.stage-XXXXXXXX")"
services_stopped=false
cleanup() {
    rm -rf -- "$stage"
    if [[ "$services_stopped" == true ]]; then
        "${compose[@]}" start api web >/dev/null
    fi
}
trap cleanup EXIT

timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
archive_name="nhadesrecords-$timestamp.tar.gz"

"${compose[@]}" stop web api >/dev/null
services_stopped=true

"${compose[@]}" exec -T db rm -f /tmp/nhadesrecords.dump
"${compose[@]}" exec -T db pg_dump \
    --username "$postgres_user" \
    --dbname "$postgres_db" \
    --format custom \
    --no-owner \
    --file /tmp/nhadesrecords.dump
"${compose[@]}" cp db:/tmp/nhadesrecords.dump "$stage/database.dump"
"${compose[@]}" exec -T db rm -f /tmp/nhadesrecords.dump

mkdir -p "$stage/uploads"
"${compose[@]}" cp api:/app/uploads/. "$stage/uploads"

tar -C "$stage" -czf "$backup_dir/$archive_name" database.dump uploads
(
    cd "$backup_dir"
    sha256sum "$archive_name" > "$archive_name.sha256"
)

"${compose[@]}" start api web >/dev/null
services_stopped=false

rclone copyto "$backup_dir/$archive_name" "${remote%/}/$archive_name"
rclone copyto "$backup_dir/$archive_name.sha256" "${remote%/}/$archive_name.sha256"
rclone delete "$remote" --min-age "${retention_days}d" --include "nhadesrecords-*.tar.gz" --include "nhadesrecords-*.tar.gz.sha256"

find "$backup_dir" -maxdepth 1 -type f \
    \( -name 'nhadesrecords-*.tar.gz' -o -name 'nhadesrecords-*.tar.gz.sha256' \) \
    -mtime "+$retention_days" -delete

echo "Backup completed: $backup_dir/$archive_name"
