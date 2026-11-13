-- Cookieless website analytics (page views, time on page, WhatsApp clicks)
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  vid TEXT NOT NULL,          -- anonymous visitor hash (no cookies, nothing stored on the device)
  type TEXT NOT NULL,         -- pv | wa
  path TEXT,
  ref TEXT,                   -- referring host, or NULL for direct
  dur INTEGER NOT NULL DEFAULT 0  -- ms spent on the page (pv only)
);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events (ts);
CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events (type, ts);
CREATE INDEX IF NOT EXISTS idx_events_vid ON events (vid, ts);
