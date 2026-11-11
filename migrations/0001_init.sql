-- Quote / booking requests from the website form
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  email TEXT,
  car TEXT NOT NULL,
  pets TEXT,
  service TEXT NOT NULL,
  service_label TEXT NOT NULL,
  message TEXT,
  photos_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new',      -- new | contacted | quoted | booked | completed | cancelled
  notes TEXT,
  message_read INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- Notification emails sent for each request
CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  booking_id INTEGER,
  to_addr TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,                    -- sent | failed | skipped
  error TEXT
);
CREATE INDEX IF NOT EXISTS idx_email_created ON email_log (created_at DESC);

-- Journal / blog posts
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL DEFAULT '',
  cover TEXT,
  status TEXT NOT NULL DEFAULT 'draft',    -- draft | published
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  published_at TEXT
);

-- Key/value settings (notification email, dashboard password hash, …)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
