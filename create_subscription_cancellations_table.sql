-- Create subscription_cancellations table
CREATE TABLE IF NOT EXISTS subscription_cancellations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    subscription_id VARCHAR(255),
    reason TEXT,
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_cancellations_user_id ON subscription_cancellations(user_id);
CREATE INDEX IF NOT EXISTS idx_subscription_cancellations_cancelled_at ON subscription_cancellations(cancelled_at);

-- Add trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscription_cancellations_updated_at 
    BEFORE UPDATE ON subscription_cancellations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 