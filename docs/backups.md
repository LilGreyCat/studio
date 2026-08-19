# Production backups and restoration

Production content consists of two inseparable data sets:

- the PostgreSQL database;
- the `prod_uploads` Docker volume.

`deploy/backup.sh` briefly stops the web and API containers so that both are
captured without an administrator changing content between the database dump
and file copy. PostgreSQL remains running while `pg_dump` creates a portable
custom-format dump. The resulting compressed archive includes the dump and all
uploads, plus a SHA-256 checksum.

## Off-server storage

Install and configure `rclone` for a private storage provider. Use a dedicated
bucket/path and credentials restricted to that destination. Backups must not
be stored only on the VPS.

Copy `deploy/backup.env.example` to `/etc/nhadesrecords-backup.env`, restrict it
to root, and set `BACKUP_REMOTE` to the dedicated remote path. The backup fails
if no scoped rclone destination is configured. Local and remote archives older
than `BACKUP_RETENTION_DAYS` are removed.

Install the systemd units:

```sh
sudo cp deploy/nhadesrecords-backup.service /etc/systemd/system/
sudo cp deploy/nhadesrecords-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nhadesrecords-backup.timer
sudo systemctl start nhadesrecords-backup.service
sudo systemctl status nhadesrecords-backup.service
```

The timer runs daily around 03:15 and catches up after downtime. Check its next
run with `systemctl list-timers nhadesrecords-backup.timer`.

## Manual backup

From the production checkout:

```sh
sudo --preserve-env=BACKUP_DIR,BACKUP_RETENTION_DAYS,BACKUP_REMOTE \
  bash deploy/backup.sh
```

Do not consider the setup complete until the archive and checksum are visible
in the remote destination.

## Restoration drill

Restoration replaces the database and uploaded files and causes downtime. Take
a fresh backup first. Download both the archive and its adjacent `.sha256` file,
then run:

```sh
sudo bash deploy/restore.sh --yes \
  /var/backups/nhadesrecords/nhadesrecords-YYYYMMDDTHHMMSSZ.tar.gz
```

The script verifies the checksum and archive paths, stops web/API services,
replaces uploads, restores PostgreSQL with `--exit-on-error`, and restarts the
services only after success.

After every drill, verify `/health`, public images, projects, artists, prices,
notifications, and admin login. Perform a restoration drill before launch and
at least quarterly thereafter. A backup that has never been restored is not a
verified backup.
