CREATE TABLE notifications (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    message VARCHAR(500) NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
    target_url VARCHAR(2048) NOT NULL CHECK (char_length(target_url) BETWEEN 1 AND 2048),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (ends_at > starts_at)
);

CREATE INDEX notifications_active_idx
    ON notifications (starts_at DESC, ends_at)
    WHERE ends_at > starts_at;
