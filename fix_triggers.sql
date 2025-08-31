-- Fix the database triggers that are causing subscription insertion to fail
-- The issue is that the triggers are looking for 'company' column but it should be 'company_name'

-- Drop existing triggers first
DROP TRIGGER IF EXISTS trigger_new_signup ON subscription_better;
DROP TRIGGER IF EXISTS trigger_plan_change ON subscription_better;
DROP TRIGGER IF EXISTS trigger_subscription_cancellation ON subscription_better;

-- Drop existing functions
DROP FUNCTION IF EXISTS notify_new_signup();
DROP FUNCTION IF EXISTS notify_plan_change();
DROP FUNCTION IF EXISTS notify_subscription_cancellation();

-- Recreate the notify_new_signup function with correct column names
CREATE OR REPLACE FUNCTION notify_new_signup() RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
BEGIN
    -- Get user details
    SELECT email, full_name, company_name INTO user_email, user_name, company_name
    FROM user_profiles 
    WHERE user_id = NEW.user_id;
    
    PERFORM create_admin_notification(
        'new_signup',
        'New Customer Signup',
        COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company') || ' has signed up for ' || NEW.plan_name || ' plan',
        jsonb_build_object(
            'user_id', NEW.user_id,
            'email', user_email,
            'customer_name', user_name,
            'company', company_name,
            'plan_name', NEW.plan_name,
            'created_at', NEW.created_at
        )
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the notify_plan_change function with correct column names
CREATE OR REPLACE FUNCTION notify_plan_change() RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
BEGIN
    IF OLD.plan_name != NEW.plan_name THEN
        -- Get user details
        SELECT email, full_name, company_name INTO user_email, user_name, company_name
        FROM user_profiles 
        WHERE user_id = NEW.user_id;
        
        PERFORM create_admin_notification(
            'upgrade',
            'Customer Plan Change',
            COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company') || ' changed from ' || OLD.plan_name || ' to ' || NEW.plan_name,
            jsonb_build_object(
                'user_id', NEW.user_id,
                'email', user_email,
                'customer_name', user_name,
                'company', company_name,
                'old_plan', OLD.plan_name,
                'new_plan', NEW.plan_name,
                'changed_at', NEW.updated_at
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the notify_subscription_cancellation function with correct column names
CREATE OR REPLACE FUNCTION notify_subscription_cancellation() RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
BEGIN
    -- Check if subscription was cancelled
    IF OLD.status != 'canceled' AND NEW.status = 'canceled' THEN
        -- Get user details
        SELECT email, full_name, company_name INTO user_email, user_name, company_name
        FROM user_profiles 
        WHERE user_id = NEW.user_id;
        
        PERFORM create_admin_notification(
            'cancellation',
            'Subscription Cancelled',
            COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company') || ' cancelled their ' || NEW.plan_name || ' subscription',
            jsonb_build_object(
                'user_id', NEW.user_id,
                'email', user_email,
                'customer_name', user_name,
                'company', company_name,
                'plan_name', NEW.plan_name,
                'cancellation_reason', NEW.metadata->>'cancellation_reason',
                'cancelled_at', NEW.updated_at
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the triggers
CREATE TRIGGER trigger_new_signup
    AFTER INSERT ON subscription_better
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_signup();

CREATE TRIGGER trigger_plan_change
    AFTER UPDATE ON subscription_better
    FOR EACH ROW
    EXECUTE FUNCTION notify_plan_change();

CREATE TRIGGER trigger_subscription_cancellation
    AFTER UPDATE ON subscription_better
    FOR EACH ROW
    EXECUTE FUNCTION notify_subscription_cancellation();
