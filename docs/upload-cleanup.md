# Orphaned upload cleanup

The admin uploads an image before saving its project, artist, or hardware row.
If that later request fails or the browser closes, the file can remain without
a database reference.

The `upload-cleanup` production tool reads every uploaded image URL referenced
by `artists`, `projects`, and `hardware_items`, then walks only the managed
`artists`, `projects`, and `hardware` upload directories. It removes a file
only when all of the following are true:

- no database row references its exact public URL;
- its extension is one accepted by the upload endpoint;
- it is older than `UPLOAD_CLEANUP_GRACE_HOURS` (24 hours by default);
- it is a regular file rather than a symlink.

The grace period prevents a file from being removed while an administrator is
between the upload request and the database save. Keep this value at 24 hours
or longer in production.

Run the reconciliation manually with:

```sh
make prod-clean-uploads
```

For automatic cleanup, install the supplied systemd units:

```sh
sudo cp deploy/nhadesrecords-upload-cleanup.service /etc/systemd/system/
sudo cp deploy/nhadesrecords-upload-cleanup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nhadesrecords-upload-cleanup.timer
sudo systemctl start nhadesrecords-upload-cleanup.service
sudo systemctl status nhadesrecords-upload-cleanup.service
```

The cleanup runs after the daily backup window, so an accidentally removed file
is still present in the latest off-server snapshot.
