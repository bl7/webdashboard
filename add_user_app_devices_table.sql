-- Mobile app device heartbeats (distinct physical devices per account)
-- Run against PostgreSQL before deploying /api/app-devices/heartbeat

CREATE TABLE IF NOT EXISTS user_app_devices (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  device_id VARCHAR(128) NOT NULL,
  platform VARCHAR(16) NOT NULL DEFAULT 'mobile',
  device_model VARCHAR(255),
  app_version VARCHAR(64),
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_app_devices_platform_check CHECK (platform IN ('web', 'mobile')),
  CONSTRAINT user_app_devices_user_device_unique UNIQUE (user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_user_app_devices_user_last_seen
  ON user_app_devices (user_id, last_seen_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_app_devices_last_seen
  ON user_app_devices (last_seen_at DESC);

COMMENT ON TABLE user_app_devices IS 'Tracks distinct mobile/web app installs per user via heartbeat (device_id = hashed ANDROID_ID on mobile).';
COMMENT ON COLUMN user_app_devices.device_id IS 'Stable hashed device identifier from the client (not raw ANDROID_ID).';
COMMENT ON COLUMN user_app_devices.last_seen_at IS 'Updated on each heartbeat; used for active device counts.';
