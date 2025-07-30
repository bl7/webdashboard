-- Minimal Square Integration Schema
-- Only essential fields for manual credential storage and sync tracking

-- Add Square integration fields to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS square_access_token TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS square_merchant_id TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS square_location_id TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS square_sync_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS last_square_sync TIMESTAMP WITH TIME ZONE;

-- Create simple sync logs table
CREATE TABLE IF NOT EXISTS square_sync_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  sync_type VARCHAR(50) NOT NULL, -- 'menu_items', 'ingredients', 'allergens'
  status VARCHAR(20) NOT NULL, -- 'success', 'failed'
  items_processed INTEGER DEFAULT 0,
  items_created INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_square_sync_logs_user_id ON square_sync_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_square_sync_logs_started_at ON square_sync_logs(started_at DESC); 