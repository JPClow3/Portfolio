-- D1 Telemetry Schema
CREATE TABLE IF NOT EXISTS telemetry_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  path TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  metric_name TEXT,
  metric_value REAL,
  error_message TEXT,
  error_source TEXT,
  error_line INTEGER,
  error_column INTEGER,
  country TEXT,
  city TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telemetry_type ON telemetry_events(type);
CREATE INDEX IF NOT EXISTS idx_telemetry_timestamp ON telemetry_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_telemetry_path ON telemetry_events(path);
CREATE INDEX IF NOT EXISTS idx_telemetry_metric ON telemetry_events(metric_name);
