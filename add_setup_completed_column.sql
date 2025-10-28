-- Add setup_completed column to user_profiles table
-- This column tracks whether a user has completed the initial setup process

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS setup_completed BOOLEAN DEFAULT FALSE;

-- Create index for better performance on setup_completed queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_setup_completed 
ON user_profiles(setup_completed);

-- Update existing users who have both company_name and email to mark them as setup completed
-- This ensures existing users don't get stuck in setup loop
UPDATE user_profiles 
SET setup_completed = TRUE 
WHERE company_name IS NOT NULL 
  AND company_name != '' 
  AND email IS NOT NULL 
  AND email != '';

-- Add comment to the column
COMMENT ON COLUMN user_profiles.setup_completed IS 'Tracks whether user has completed initial setup process. Once true, user should never see /setup page again.';
