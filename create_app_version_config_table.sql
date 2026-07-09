-- Mobile app version gate config (GET /api/app-version?platform=mobile)
-- Run against PostgreSQL before deploying; editable from boss dashboard.

CREATE TABLE IF NOT EXISTS app_version_config (
  platform VARCHAR(32) PRIMARY KEY,
  min_supported_version_code INTEGER NOT NULL,
  min_supported_version VARCHAR(32),
  latest_version_code INTEGER,
  latest_version VARCHAR(32),
  update_url TEXT,
  message TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_version_config (
  platform,
  min_supported_version_code,
  min_supported_version,
  latest_version_code,
  latest_version,
  update_url,
  message
)
VALUES (
  'mobile',
  8,
  '6.1.0',
  8,
  '6.1.0',
  'https://play.google.com/store/apps/details?id=com.instalabel.co.app',
  'A new version of InstaLabel is available. Please update to continue.'
)
ON CONFLICT (platform) DO NOTHING;
