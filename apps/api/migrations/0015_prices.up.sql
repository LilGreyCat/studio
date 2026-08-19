CREATE TABLE prices (
    key VARCHAR(32) PRIMARY KEY,
    amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO prices (key, amount_cents) VALUES
    ('recording', 3000),
    ('mixing', 4000),
    ('mastering', 2000),
    ('live_setup', 1000),
    ('live_performance', 10000),
    ('single', 10000),
    ('ep', 8000),
    ('album', 6000);
