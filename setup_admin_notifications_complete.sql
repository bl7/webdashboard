-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS admin_notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_timestamp ON admin_notifications(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);

-- Insert sample notifications with complete data
INSERT INTO admin_notifications (type, title, message, data) VALUES
('new_signup', 'New Customer Signup', 'John Smith from Smith Kitchen has signed up for the Pro Kitchen plan', '{"user_id": "sample-user-1", "email": "john@smithkitchen.com", "customer_name": "John Smith", "company": "Smith Kitchen", "plan_name": "Pro Kitchen", "created_at": "2025-07-05T07:46:48.707Z"}'),
('upgrade', 'Customer Plan Upgrade', 'Sarah Johnson from Johnson Catering upgraded from Basic to Pro Kitchen plan', '{"user_id": "sample-user-2", "email": "sarah@johnsoncatering.com", "customer_name": "Sarah Johnson", "company": "Johnson Catering", "old_plan": "Basic", "new_plan": "Pro Kitchen", "changed_at": "2025-07-05T07:46:48.707Z"}'),
('device_shipped', 'Device Shipped', 'Device 1 shipped to Mike Wilson at Wilson Restaurant', '{"device_id": 1, "user_id": "sample-user-3", "email": "mike@wilsonrestaurant.com", "customer_name": "Mike Wilson", "company": "Wilson Restaurant", "plan_name": "Pro Kitchen", "status": "shipped", "shipped_at": "2025-07-05T07:46:48.707Z"}'),
('device_delivered', 'Device Delivered', 'Device 1 delivered to Mike Wilson at Wilson Restaurant', '{"device_id": 1, "user_id": "sample-user-3", "email": "mike@wilsonrestaurant.com", "customer_name": "Mike Wilson", "company": "Wilson Restaurant", "plan_name": "Pro Kitchen", "status": "delivered", "delivered_at": "2025-07-05T07:46:48.707Z"}'),
('device_return_requested', 'Device Return Requested', 'Device 1 return requested by Emma Davis at Davis Cafe', '{"device_id": 1, "user_id": "sample-user-4", "email": "emma@daviscafe.com", "customer_name": "Emma Davis", "company": "Davis Cafe", "plan_name": "Basic", "status": "return_requested", "return_requested_at": "2025-07-05T07:46:48.707Z"}'),
('device_returned', 'Device Returned', 'Device 1 returned by Lisa Garcia from Garcia Deli', '{"device_id": 1, "user_id": "sample-user-6", "email": "lisa@garcideli.com", "customer_name": "Lisa Garcia", "company": "Garcia Deli", "plan_name": "Pro Kitchen", "status": "returned", "returned_at": "2025-07-05T07:46:48.707Z"}'),
('cancellation', 'Subscription Cancelled', 'Emma Davis from Davis Cafe cancelled their Basic plan subscription', '{"user_id": "sample-user-4", "email": "emma@daviscafe.com", "customer_name": "Emma Davis", "company": "Davis Cafe", "plan_name": "Basic", "cancellation_reason": "Business closure", "cancelled_at": "2025-07-05T07:46:48.707Z"}'),
('payment_failed', 'Payment Failed', 'Payment failed for Robert Brown at Brown Bistro - requires attention', '{"user_id": "sample-user-5", "email": "robert@brownbistro.com", "customer_name": "Robert Brown", "company": "Brown Bistro", "plan_name": "Pro Kitchen", "amount": "£99.00", "failure_reason": "Insufficient funds", "failed_at": "2025-07-05T07:46:48.707Z"}'),
('payment_recovered', 'Payment Recovered', 'Payment recovered for Robert Brown at Brown Bistro', '{"user_id": "sample-user-5", "email": "robert@brownbistro.com", "customer_name": "Robert Brown", "company": "Brown Bistro", "plan_name": "Pro Kitchen", "amount": "£99.00", "recovered_at": "2025-07-05T07:46:48.707Z"}'),
('plan_renewal', 'Plan Renewed', 'Sarah Johnson from Johnson Catering renewed their Pro Kitchen plan', '{"user_id": "sample-user-2", "email": "sarah@johnsoncatering.com", "customer_name": "Sarah Johnson", "company": "Johnson Catering", "plan_name": "Pro Kitchen", "renewal_date": "2025-07-05T07:46:48.707Z", "next_billing": "2025-08-05T07:46:48.707Z"}'),
('label_order_placed', 'New Label Order', 'Mike Wilson from Wilson Restaurant placed an order for 5 label bundles', '{"order_id": 1, "user_id": "sample-user-3", "email": "mike@wilsonrestaurant.com", "customer_name": "Mike Wilson", "company": "Wilson Restaurant", "bundle_count": 5, "label_count": 25, "amount_cents": 5000, "amount_formatted": "$50.00", "product_name": "Standard Labels", "shipping_address": "123 Main St, City, State", "order_date": "2025-07-05T07:46:48.707Z"}'),
('label_order_paid', 'Label Order Paid', 'Mike Wilson from Wilson Restaurant paid for order #1 - 5 label bundles', '{"order_id": 1, "user_id": "sample-user-3", "email": "mike@wilsonrestaurant.com", "customer_name": "Mike Wilson", "company": "Wilson Restaurant", "bundle_count": 5, "label_count": 25, "amount_cents": 5000, "amount_formatted": "$50.00", "product_name": "Standard Labels", "payment_date": "2025-07-05T07:46:48.707Z"}'),
('label_order_shipped', 'Label Order Shipped', 'Order #1 shipped to Mike Wilson at Wilson Restaurant', '{"order_id": 1, "user_id": "sample-user-3", "email": "mike@wilsonrestaurant.com", "customer_name": "Mike Wilson", "company": "Wilson Restaurant", "bundle_count": 5, "label_count": 25, "product_name": "Standard Labels", "shipping_address": "123 Main St, City, State", "shipped_date": "2025-07-05T07:46:48.707Z"}'),
('label_order_delivered', 'Label Order Delivered', 'Order #1 delivered to Mike Wilson at Wilson Restaurant', '{"order_id": 1, "user_id": "sample-user-3", "email": "mike@wilsonrestaurant.com", "customer_name": "Mike Wilson", "company": "Wilson Restaurant", "bundle_count": 5, "label_count": 25, "product_name": "Standard Labels", "delivered_date": "2025-07-05T07:46:48.707Z"}'),
('label_order_cancelled', 'Label Order Cancelled', 'Order #2 cancelled by Emma Davis from Davis Cafe', '{"order_id": 2, "user_id": "sample-user-4", "email": "emma@daviscafe.com", "customer_name": "Emma Davis", "company": "Davis Cafe", "bundle_count": 3, "label_count": 15, "amount_cents": 3000, "amount_formatted": "$30.00", "product_name": "Standard Labels", "cancelled_date": "2025-07-05T07:46:48.707Z"}');

-- Create function to automatically create notifications for certain events
CREATE OR REPLACE FUNCTION create_admin_notification(
    p_type VARCHAR(50),
    p_title VARCHAR(255),
    p_message TEXT,
    p_data JSONB DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO admin_notifications (type, title, message, data)
    VALUES (p_type, p_title, p_message, p_data);
END;
$$ LANGUAGE plpgsql;

-- Create trigger function for new user signups
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

-- Create trigger for new subscriptions
CREATE TRIGGER trigger_new_signup
    AFTER INSERT ON subscription_better
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_signup();

-- Create trigger function for plan changes
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

-- Create trigger for plan changes
CREATE TRIGGER trigger_plan_change
    AFTER UPDATE ON subscription_better
    FOR EACH ROW
    EXECUTE FUNCTION notify_plan_change();

-- Create trigger function for subscription cancellations
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

-- Create trigger for subscription cancellations
CREATE TRIGGER trigger_subscription_cancellation
    AFTER UPDATE ON subscription_better
    FOR EACH ROW
    EXECUTE FUNCTION notify_subscription_cancellation();

-- Create trigger function for device status changes
CREATE OR REPLACE FUNCTION notify_device_status_change() RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
    plan_name TEXT;
BEGIN
    IF OLD.status != NEW.status THEN
        -- Get user details
        SELECT u.email, u.full_name, u.company_name, p.name INTO user_email, user_name, company_name, plan_name
        FROM user_profiles u
        LEFT JOIN plans p ON NEW.plan_id = p.id
        WHERE u.user_id = NEW.user_id;
        
        CASE NEW.status
            WHEN 'shipped' THEN
                PERFORM create_admin_notification(
                    'device_shipped',
                    'Device Shipped',
                    'Device ' || NEW.id || ' shipped to ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'device_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'plan_name', plan_name,
                        'status', NEW.status,
                        'shipped_at', NEW.shipped_at
                    )
                );
            WHEN 'delivered' THEN
                PERFORM create_admin_notification(
                    'device_delivered',
                    'Device Delivered',
                    'Device ' || NEW.id || ' delivered to ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'device_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'plan_name', plan_name,
                        'status', NEW.status,
                        'delivered_at', NEW.delivered_at
                    )
                );
            WHEN 'return_requested' THEN
                PERFORM create_admin_notification(
                    'device_return_requested',
                    'Device Return Requested',
                    'Device ' || NEW.id || ' return requested by ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'device_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'plan_name', plan_name,
                        'status', NEW.status,
                        'return_requested_at', NEW.return_requested_at
                    )
                );
            WHEN 'returned' THEN
                PERFORM create_admin_notification(
                    'device_returned',
                    'Device Returned',
                    'Device ' || NEW.id || ' returned by ' || COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'device_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'plan_name', plan_name,
                        'status', NEW.status,
                        'returned_at', NEW.returned_at
                    )
                );
            ELSE
                -- Handle any other status changes silently
                NULL;
        END CASE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for device status changes
CREATE TRIGGER trigger_device_status_change
    AFTER UPDATE ON devices
    FOR EACH ROW
    EXECUTE FUNCTION notify_device_status_change();

-- Function to manually create payment failure notification (called from webhook)
CREATE OR REPLACE FUNCTION notify_payment_failure(
    p_user_id TEXT,
    p_amount DECIMAL,
    p_failure_reason TEXT DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
    plan_name TEXT;
BEGIN
    -- Get user details
    SELECT u.email, u.full_name, u.company_name, s.plan_name INTO user_email, user_name, company_name, plan_name
    FROM user_profiles u
    LEFT JOIN subscription_better s ON u.user_id = s.user_id
    WHERE u.user_id = p_user_id;
    
    PERFORM create_admin_notification(
        'payment_failed',
        'Payment Failed',
        'Payment failed for ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company') || ' - requires attention',
        jsonb_build_object(
            'user_id', p_user_id,
            'email', user_email,
            'customer_name', user_name,
            'company', company_name,
            'plan_name', plan_name,
            'amount', p_amount,
            'failure_reason', p_failure_reason,
            'failed_at', NOW()
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to manually create payment recovery notification (called from webhook)
CREATE OR REPLACE FUNCTION notify_payment_recovery(
    p_user_id TEXT,
    p_amount DECIMAL
) RETURNS VOID AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
    plan_name TEXT;
BEGIN
    -- Get user details
    SELECT u.email, u.full_name, u.company_name, s.plan_name INTO user_email, user_name, company_name, plan_name
    FROM user_profiles u
    LEFT JOIN subscription_better s ON u.user_id = s.user_id
    WHERE u.user_id = p_user_id;
    
    PERFORM create_admin_notification(
        'payment_recovered',
        'Payment Recovered',
        'Payment recovered for ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company'),
        jsonb_build_object(
            'user_id', p_user_id,
            'email', user_email,
            'customer_name', user_name,
            'company', company_name,
            'plan_name', plan_name,
            'amount', p_amount,
            'recovered_at', NOW()
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to manually create plan renewal notification (called from webhook)
CREATE OR REPLACE FUNCTION notify_plan_renewal(
    p_user_id TEXT,
    p_next_billing_date TIMESTAMP
) RETURNS VOID AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
    plan_name TEXT;
BEGIN
    -- Get user details
    SELECT u.email, u.full_name, u.company_name, s.plan_name INTO user_email, user_name, company_name, plan_name
    FROM user_profiles u
    LEFT JOIN subscription_better s ON u.user_id = s.user_id
    WHERE u.user_id = p_user_id;
    
    PERFORM create_admin_notification(
        'plan_renewal',
        'Plan Renewed',
        COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company') || ' renewed their ' || COALESCE(plan_name, 'Unknown') || ' plan',
        jsonb_build_object(
            'user_id', p_user_id,
            'email', user_email,
            'customer_name', user_name,
            'company', company_name,
            'plan_name', plan_name,
            'renewal_date', NOW(),
            'next_billing', p_next_billing_date
        )
    );
END;
$$ LANGUAGE plpgsql; 

-- Create trigger function for label order status changes
CREATE OR REPLACE FUNCTION notify_label_order_status_change() RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
    product_name TEXT;
    amount_formatted TEXT;
BEGIN
    IF OLD.status != NEW.status THEN
        -- Get user details
        SELECT u.email, u.full_name, u.company_name, lp.name INTO user_email, user_name, company_name, product_name
        FROM user_profiles u
        LEFT JOIN label_products lp ON NEW.label_product_id = lp.id
        WHERE u.user_id = NEW.user_id;
        
        -- Format amount
        amount_formatted := '$' || (NEW.amount_cents / 100.0)::TEXT;
        
        CASE NEW.status
            WHEN 'paid' THEN
                PERFORM create_admin_notification(
                    'label_order_paid',
                    'Label Order Paid',
                    COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company') || ' paid for order #' || NEW.id || ' - ' || NEW.bundle_count || ' label bundles',
                    jsonb_build_object(
                        'order_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'bundle_count', NEW.bundle_count,
                        'label_count', NEW.label_count,
                        'amount_cents', NEW.amount_cents,
                        'amount_formatted', amount_formatted,
                        'product_name', product_name,
                        'payment_date', NEW.paid_at
                    )
                );
            WHEN 'shipped' THEN
                PERFORM create_admin_notification(
                    'label_order_shipped',
                    'Label Order Shipped',
                    'Order #' || NEW.id || ' shipped to ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'order_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'bundle_count', NEW.bundle_count,
                        'label_count', NEW.label_count,
                        'product_name', product_name,
                        'shipping_address', NEW.shipping_address,
                        'shipped_date', NEW.shipped_at
                    )
                );
            WHEN 'delivered' THEN
                PERFORM create_admin_notification(
                    'label_order_delivered',
                    'Label Order Delivered',
                    'Order #' || NEW.id || ' delivered to ' || COALESCE(user_name, 'Unknown User') || ' at ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'order_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'bundle_count', NEW.bundle_count,
                        'label_count', NEW.label_count,
                        'product_name', product_name,
                        'delivered_date', NOW()
                    )
                );
            WHEN 'cancelled' THEN
                PERFORM create_admin_notification(
                    'label_order_cancelled',
                    'Label Order Cancelled',
                    'Order #' || NEW.id || ' cancelled by ' || COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company'),
                    jsonb_build_object(
                        'order_id', NEW.id,
                        'user_id', NEW.user_id,
                        'email', user_email,
                        'customer_name', user_name,
                        'company', company_name,
                        'bundle_count', NEW.bundle_count,
                        'label_count', NEW.label_count,
                        'amount_cents', NEW.amount_cents,
                        'amount_formatted', amount_formatted,
                        'product_name', product_name,
                        'cancelled_date', NOW()
                    )
                );
            ELSE
                -- Handle any other status changes silently
                NULL;
        END CASE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for label order status changes
CREATE TRIGGER trigger_label_order_status_change
    AFTER UPDATE ON label_orders
    FOR EACH ROW
    EXECUTE FUNCTION notify_label_order_status_change();

-- Function to manually create new order notification (called when order is placed)
CREATE OR REPLACE FUNCTION notify_new_label_order(
    p_order_id INTEGER,
    p_user_id TEXT,
    p_bundle_count INTEGER,
    p_label_count INTEGER,
    p_amount_cents INTEGER,
    p_label_product_id INTEGER,
    p_shipping_address TEXT
) RETURNS VOID AS $$
DECLARE
    user_email TEXT;
    user_name TEXT;
    company_name TEXT;
    product_name TEXT;
    amount_formatted TEXT;
BEGIN
    -- Get user details
    SELECT u.email, u.full_name, u.company_name, lp.name INTO user_email, user_name, company_name, product_name
    FROM user_profiles u
    LEFT JOIN label_products lp ON p_label_product_id = lp.id
    WHERE u.user_id = p_user_id;
    
    -- Format amount
    amount_formatted := '$' || (p_amount_cents / 100.0)::TEXT;
    
    PERFORM create_admin_notification(
        'label_order_placed',
        'New Label Order',
        COALESCE(user_name, 'Unknown User') || ' from ' || COALESCE(company_name, 'Unknown Company') || ' placed an order for ' || p_bundle_count || ' label bundles',
        jsonb_build_object(
            'order_id', p_order_id,
            'user_id', p_user_id,
            'email', user_email,
            'customer_name', user_name,
            'company', company_name,
            'bundle_count', p_bundle_count,
            'label_count', p_label_count,
            'amount_cents', p_amount_cents,
            'amount_formatted', amount_formatted,
            'product_name', product_name,
            'shipping_address', p_shipping_address,
            'order_date', NOW()
        )
    );
END;
$$ LANGUAGE plpgsql; 