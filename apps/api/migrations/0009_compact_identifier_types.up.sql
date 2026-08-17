BEGIN;

ALTER TABLE artist_projects
    DROP CONSTRAINT artist_projects_artist_id_fkey,
    DROP CONSTRAINT artist_projects_project_id_fkey;
ALTER TABLE artist_links
    DROP CONSTRAINT artist_links_artist_id_fkey;
ALTER TABLE project_links
    DROP CONSTRAINT project_links_project_id_fkey;
ALTER TABLE artist_integrations
    DROP CONSTRAINT artist_integrations_artist_id_fkey;
ALTER TABLE project_integrations
    DROP CONSTRAINT project_integrations_project_id_fkey;

ALTER TABLE artist_projects
    ALTER COLUMN artist_id TYPE INTEGER,
    ALTER COLUMN project_id TYPE INTEGER;
ALTER TABLE artist_links
    ALTER COLUMN artist_id TYPE INTEGER;
ALTER TABLE project_links
    ALTER COLUMN project_id TYPE INTEGER;
ALTER TABLE artist_integrations
    ALTER COLUMN artist_id TYPE INTEGER;
ALTER TABLE project_integrations
    ALTER COLUMN project_id TYPE INTEGER;

ALTER TABLE artists
    ALTER COLUMN id TYPE INTEGER;
ALTER TABLE projects
    ALTER COLUMN id TYPE INTEGER;
ALTER TABLE admin_users
    ALTER COLUMN id TYPE INTEGER;

ALTER SEQUENCE artists_id_seq AS INTEGER NO MAXVALUE;
ALTER SEQUENCE projects_id_seq AS INTEGER NO MAXVALUE;
ALTER SEQUENCE admin_users_id_seq AS INTEGER NO MAXVALUE;

ALTER TABLE artist_projects
    ADD CONSTRAINT artist_projects_artist_id_fkey
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
    ADD CONSTRAINT artist_projects_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE artist_links
    ADD CONSTRAINT artist_links_artist_id_fkey
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;
ALTER TABLE project_links
    ADD CONSTRAINT project_links_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
ALTER TABLE artist_integrations
    ADD CONSTRAINT artist_integrations_artist_id_fkey
        FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE;
ALTER TABLE project_integrations
    ADD CONSTRAINT project_integrations_project_id_fkey
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

COMMIT;
