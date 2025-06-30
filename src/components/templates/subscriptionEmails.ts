
export const newSubscriptionEmail = ({
  name,
  planName,
  trialDays,
  trialEndDate,
  amount,
  currency = 'gbp',
  billingInterval
}: {
  name: string
  planName: string
  trialDays: number
  trialEndDate: string
  amount: number
  currency?: string
  billingInterval: 'month' | 'year'
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to InstaLabel!</title>
    <style>
        body { font-family: 'Nunito', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .plan-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .trial-info { background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Welcome to InstaLabel!</h1>
            <p>Your subscription is now active</p>
        </div>
        
        <div class="content">
            <h2>Hello ${name},</h2>
            
            <p>Thank you for choosing InstaLabel! We're excited to have you on board and can't wait to help you streamline your kitchen labeling process.</p>
            
            <div class="plan-details">
                <h3>📋 Your Subscription Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Billing:</strong> ${billingInterval === 'month' ? 'Monthly' : 'Annual'} (${currency.toUpperCase()} ${amount})</p>
                <p><strong>Status:</strong> Active</p>
            </div>
            
            <div class="trial-info">
                <h3>🆓 Trial Period</h3>
                <p>You're currently enjoying a <strong>${trialDays}-day free trial</strong>!</p>
                <p><strong>Trial ends:</strong> ${trialEndDate}</p>
                <p>No charges will be made until your trial period ends. You can cancel anytime during the trial.</p>
            </div>
            
            <h3>🚀 What's Next?</h3>
            <ul>
                <li>Access your dashboard to start creating labels</li>
                <li>Upload your menu items and ingredients</li>
                <li>Configure your allergen settings</li>
                <li>Start printing professional labels</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">Go to Dashboard</a>
            
            <h3>💡 Getting Started Tips</h3>
            <ol>
                <li><strong>Upload your menu:</strong> Import your existing menu items via Excel or add them manually</li>
                <li><strong>Set up allergens:</strong> Configure your allergen database to ensure compliance</li>
                <li><strong>Test printing:</strong> Print a few test labels to ensure everything works perfectly</li>
                <li><strong>Train your team:</strong> Show your kitchen staff how to use the system</li>
            </ol>
            
            <h3>📞 Need Help?</h3>
            <p>Our support team is here to help you get the most out of InstaLabel:</p>
            <ul>
                <li>📧 Email: support@instalabel.co</li>
                <li>📱 Phone: +44 (0) 123 456 7890</li>
                <li>💬 Live Chat: Available in your dashboard</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2024 InstaLabel. All rights reserved.</p>
            <p>This email was sent to you because you signed up for InstaLabel.</p>
        </div>
    </div>
</body>
</html>`

export const planChangeEmail = ({
  name,
  oldPlan,
  newPlan,
  changeType,
  effectiveDate,
  amount,
  currency = 'gbp',
  billingInterval
}: {
  name: string
  oldPlan: string
  newPlan: string
  changeType: 'upgrade' | 'downgrade' | 'billing_change'
  effectiveDate: string
  amount: number
  currency?: string
  billingInterval: 'month' | 'year'
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan Change Confirmation - InstaLabel</title>
    <style>
        body { font-family: 'Nunito', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .change-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .upgrade { border-left-color: #4caf50; }
        .downgrade { border-left-color: #ff9800; }
        .billing-change { border-left-color: #2196f3; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Plan Change Confirmation</h1>
            <p>Your InstaLabel subscription has been updated</p>
        </div>
        
        <div class="content">
            <h2>Hello ${name},</h2>
            
            <p>We've successfully processed your plan change request. Here are the details:</p>
            
            <div class="change-details ${changeType}">
                <h3>🔄 Change Summary</h3>
                <p><strong>From:</strong> ${oldPlan}</p>
                <p><strong>To:</strong> ${newPlan}</p>
                <p><strong>Billing:</strong> ${billingInterval === 'month' ? 'Monthly' : 'Annual'} (${currency.toUpperCase()} ${amount})</p>
                <p><strong>Effective Date:</strong> ${effectiveDate}</p>
            </div>
            
            ${changeType === 'upgrade' ? `
            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
                <h3>🚀 Upgrade Benefits</h3>
                <p>Your upgrade is now active! You now have access to:</p>
                <ul>
                    <li>Enhanced features and capabilities</li>
                    <li>Priority support</li>
                    <li>Advanced reporting tools</li>
                </ul>
            </div>
            ` : ''}
            
            ${changeType === 'downgrade' ? `
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
                <h3>📉 Downgrade Notice</h3>
                <p>Your plan change will take effect at the end of your current billing period. You'll continue to enjoy your current plan features until then.</p>
            </div>
            ` : ''}
            
            ${changeType === 'billing_change' ? `
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196f3;">
                <h3>💳 Billing Change</h3>
                <p>Your billing cycle has been updated. The new billing schedule will take effect at the end of your current period.</p>
            </div>
            ` : ''}
            
            <h3>📊 What This Means</h3>
            <ul>
                <li>Your subscription remains active throughout the transition</li>
                <li>All your data and settings are preserved</li>
                <li>You can continue using InstaLabel without interruption</li>
                <li>Any prorated charges or credits will appear on your next invoice</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile" class="cta-button">View Billing Details</a>
            
            <h3>❓ Questions?</h3>
            <p>If you have any questions about your plan change, please don't hesitate to contact us:</p>
            <ul>
                <li>📧 Email: support@instalabel.co</li>
                <li>📱 Phone: +44 (0) 123 456 7890</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2024 InstaLabel. All rights reserved.</p>
            <p>This email was sent to you because you made changes to your InstaLabel subscription.</p>
        </div>
    </div>
</body>
</html>`

export const cancellationEmail = ({
  name,
  planName,
  cancellationType,
  endDate,
  refundInfo,
  currency = 'gbp'
}: {
  name: string
  planName: string
  cancellationType: 'immediate' | 'monthly' | 'annual'
  endDate: string
  refundInfo?: { amount: number; date: string }
  currency?: string
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cancellation Confirmation - InstaLabel</title>
    <style>
        body { font-family: 'Nunito', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .cancellation-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b6b; }
        .refund-info { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50; }
        .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📋 Cancellation Confirmation</h1>
            <p>Your InstaLabel subscription has been cancelled</p>
        </div>
        
        <div class="content">
            <h2>Hello ${name},</h2>
            
            <p>We're sorry to see you go! We've processed your cancellation request. Here are the details:</p>
            
            <div class="cancellation-details">
                <h3>❌ Cancellation Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Cancellation Type:</strong> ${cancellationType === 'immediate' ? 'Immediate' : cancellationType === 'monthly' ? 'Monthly Notice' : 'Annual Notice'}</p>
                <p><strong>Service End Date:</strong> ${endDate}</p>
            </div>
            
            ${cancellationType === 'immediate' ? `
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
                <h3>⚠️ Immediate Cancellation</h3>
                <p>Your subscription has been cancelled immediately. You will no longer have access to InstaLabel services.</p>
            </div>
            ` : ''}
            
            ${cancellationType === 'monthly' ? `
            <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
                <h3>📅 Monthly Notice Period</h3>
                <p>As per our cancellation policy, you have been charged for one additional month. Your service will end on ${endDate}.</p>
                <p>You can continue using all InstaLabel features until this date.</p>
            </div>
            ` : ''}
            
            ${cancellationType === 'annual' && refundInfo ? `
            <div class="refund-info">
                <h3>💰 Refund Information</h3>
                <p>As per our annual cancellation policy, you will receive a refund of 50% of the remaining months after your final month.</p>
                <p><strong>Refund Amount:</strong> ${currency.toUpperCase()} ${refundInfo.amount}</p>
                <p><strong>Refund Date:</strong> ${refundInfo.date}</p>
                <p>The refund will be processed to your original payment method.</p>
            </div>
            ` : ''}
            
            <h3>📊 What Happens Next</h3>
            <ul>
                <li>Your data will be retained for 30 days after cancellation</li>
                <li>You can reactivate your subscription anytime within this period</li>
                <li>After 30 days, your data will be permanently deleted</li>
                <li>You can export your data before the deletion date</li>
            </ul>
            
          
            <h3>🔄 Want to Reactivate?</h3>
            <p>Changed your mind? You can reactivate your subscription anytime within 30 days:</p>
            <ul>
                <li>Log into your dashboard</li>
                <li>Go to the billing section</li>
                <li>Choose a plan and reactivate</li>
            </ul>
            
            <h3>📞 Feedback</h3>
            <p>We'd love to hear why you're leaving and how we can improve. Your feedback helps us make InstaLabel better for everyone.</p>
            <p>Contact us at: admin@instalabel.co</p>
            
            <h3>❓ Questions?</h3>
            <p>If you have any questions about your cancellation, please contact us:</p>
            <ul>
                <li>📧 Email: support@instalabel.co</li>
                <li>📱 Phone: +44 (0) 123 456 7890</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2024 InstaLabel. All rights reserved.</p>
            <p>This email was sent to you because you cancelled your InstaLabel subscription.</p>
        </div>
    </div>
</body>
</html>`

// Helper function to format dates consistently
export const formatDate = (date: Date | string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Helper function to format currency
export const formatCurrency = (amount: number, currency: string = 'gbp'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency.toUpperCase()
  }).format(amount / 100) // Convert from cents to pounds
} 