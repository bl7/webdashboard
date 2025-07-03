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
    <title>Welcome to InstaLabel - Subscription Activated</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .trial-highlight { 
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%); 
            border-left-color: #2196f3;
        }
        .trial-highlight .trial-badge {
            display: inline-block;
            background: #2196f3;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Welcome to InstaLabel</h1>
                <p>Your professional kitchen labeling solution</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                Thank you for choosing InstaLabel as your kitchen labeling solution. Your subscription has been successfully activated and you're ready to streamline your food safety compliance and operational efficiency.
            </div>
            
            <div class="info-card">
                <h3>📋 Subscription Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Billing Cycle:</strong> ${billingInterval === 'month' ? 'Monthly' : 'Annual'}</p>
                <p><strong>Amount:</strong> ${currency.toUpperCase()} ${(amount / 100).toFixed(2)}</p>
                <p><strong>Status:</strong> Active</p>
            </div>
            
            <div class="info-card trial-highlight">
                <div class="trial-badge">Free Trial</div>
                <h3>🎯 Trial Period Active</h3>
                <p>You're currently in your <strong>${trialDays}-day free trial</strong> period.</p>
                <p><strong>Trial expires:</strong> ${trialEndDate}</p>
                <p>Your first payment will be processed automatically when your trial ends. You can cancel anytime during the trial period without any charges.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
                    Access Your Dashboard
                </a>
            </div>
            
            <div class="next-steps">
                <h3>🚀 Quick Start Guide</h3>
                <ul class="steps-list">
                    <li>Set up your business profile and preferences</li>
                    <li>Import your menu items and ingredients database</li>
                    <li>Configure allergen management settings</li>
                    <li>Design and print your first professional labels</li>
                    <li>Train your team on the platform features</li>
            </ul>
            </div>
            
            <div class="support-section">
                <h3>Need Assistance?</h3>
                <p>Our customer success team is here to help you get the most out of InstaLabel.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent because you subscribed to InstaLabel.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
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
    <title>Subscription Change Confirmation - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .change-summary { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .change-summary.upgrade { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%); 
            border-left-color: #28a745;
        }
        .change-summary.downgrade { 
            background: linear-gradient(135deg, #fff3e0 0%, #fffaf0 100%); 
            border-left-color: #ffc107;
        }
        .change-summary.billing_change { 
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%); 
            border-left-color: #007bff;
        }
        .change-summary h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .change-summary p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .change-summary p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .change-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .upgrade-badge {
            background: #28a745;
            color: white;
        }
        .downgrade-badge {
            background: #ffc107;
            color: #212529;
        }
        .billing-badge {
            background: #007bff;
            color: white;
        }
        .benefits-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #28a745;
        }
        .benefits-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .benefits-list { 
            list-style: none; 
            padding: 0; 
        }
        .benefits-list li { 
            padding: 8px 0; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .benefits-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .notice-section { 
            background: linear-gradient(135deg, #fff3e0 0%, #fffaf0 100%); 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #ffc107;
        }
        .notice-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .notice-section p { 
            color: #555; 
            margin-bottom: 8px;
            font-size: 15px;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .what-happens { 
            margin: 32px 0; 
        }
        .what-happens h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .what-happens-list { 
            list-style: none; 
            padding: 0; 
        }
        .what-happens-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .what-happens-list li:last-child { 
            border-bottom: none; 
        }
        .what-happens-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Subscription Updated</h1>
                <p>Your plan change has been confirmed</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                We've successfully processed your subscription change. Your updated plan is now active and ready to use.
            </div>
            
            <div class="change-summary ${changeType}">
                <div class="change-badge ${changeType === 'upgrade' ? 'upgrade-badge' : changeType === 'downgrade' ? 'downgrade-badge' : 'billing-badge'}">
                    ${changeType === 'upgrade' ? 'Upgraded' : changeType === 'downgrade' ? 'Downgraded' : 'Billing Updated'}
                </div>
                <h3>📋 Change Summary</h3>
                <p><strong>Previous Plan:</strong> ${oldPlan}</p>
                <p><strong>New Plan:</strong> ${newPlan}</p>
                <p><strong>Billing Cycle:</strong> ${billingInterval === 'month' ? 'Monthly' : 'Annual'}</p>
                <p><strong>Amount:</strong> ${currency.toUpperCase()} ${(amount / 100).toFixed(2)}</p>
                <p><strong>Effective Date:</strong> ${effectiveDate}</p>
            </div>
            
            ${changeType === 'upgrade' ? `
            <div class="benefits-section">
                <h3>🚀 Enhanced Features Now Available</h3>
                <ul class="benefits-list">
                    <li>Access to premium features and advanced functionality</li>
                    <li>Priority customer support with faster response times</li>
                    <li>Advanced analytics and reporting capabilities</li>
                    <li>Enhanced customization options for your labels</li>
                    <li>Higher monthly limits and increased storage capacity</li>
                </ul>
            </div>
            ` : ''}
            
            ${changeType === 'downgrade' ? `
            <div class="notice-section">
                <h3>📅 Important Notice</h3>
                <p>Your plan change will take effect at the end of your current billing cycle. You'll continue to have access to all current features until <strong>${effectiveDate}</strong>.</p>
                <p>After this date, your account will be adjusted to match your new plan's feature set and limits.</p>
            </div>
            ` : ''}
            
            ${changeType === 'billing_change' ? `
            <div class="notice-section">
                <h3>💳 Billing Cycle Update</h3>
                <p>Your billing frequency has been successfully updated. The new billing schedule will take effect on <strong>${effectiveDate}</strong>.</p>
                <p>Any prorated charges or credits will be automatically applied to your next invoice.</p>
            </div>
            ` : ''}
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" class="cta-button">
                    View Billing Details
                </a>
            </div>
            
            <div class="what-happens">
            <h3>📊 What This Means</h3>
                <ul class="what-happens-list">
                <li>Your subscription remains active throughout the transition</li>
                    <li>All existing data and configurations are preserved</li>
                    <li>No service interruption during the plan change</li>
                    <li>Billing adjustments will be reflected in your next invoice</li>
                    <li>You can modify your plan again at any time</li>
            </ul>
            </div>
            
            <div class="support-section">
                <h3>Questions About Your Plan Change?</h3>
                <p>Our customer success team is here to help you make the most of your updated subscription.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent because you modified your InstaLabel subscription.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
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
export const expiringSoonEmail = ({
  name,
  planName,
  expiryDate,
  daysLeft
}: {
  name: string
  planName: string
  expiryDate: string
  daysLeft: number
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Expiring Soon - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .expiry-warning { 
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); 
            border: 1px solid #ffb74d; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #ff9800;
        }
        .expiry-warning h3 { 
            color: #e65100; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .expiry-warning p { 
            margin-bottom: 8px; 
            color: #bf360c;
            font-size: 15px;
        }
        .expiry-warning p strong { 
            color: #e65100;
            font-weight: 600;
        }
        .countdown-badge {
            display: inline-block;
            background: #ff9800;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #ff9800;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #ff9800; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #ff5722; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #ff9800; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>⏰ Subscription Expiring Soon</h1>
                <p>Time to renew your InstaLabel subscription</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                This is an important reminder that your InstaLabel subscription is approaching its expiration date. To ensure uninterrupted access to all your kitchen labeling features, please renew your subscription before it expires.
            </div>
            
            <div class="expiry-warning">
                <div class="countdown-badge">${daysLeft} Day${daysLeft === 1 ? '' : 's'} Left</div>
                <h3>⚠️ Subscription Expiring Soon</h3>
                <p>Your <strong>${planName}</strong> subscription will expire on <strong>${expiryDate}</strong>.</p>
                <p>After this date, you will lose access to all premium features and your account will be downgraded to our free tier.</p>
            </div>
            
            <div class="info-card">
                <h3>📋 Current Subscription</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Expiry Date:</strong> ${expiryDate}</p>
                <p><strong>Days Remaining:</strong> ${daysLeft}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" class="cta-button">
                    Renew Subscription Now
                </a>
            </div>
            
            <div class="next-steps">
                <h3>🔄 What Happens Next</h3>
                <ul class="steps-list">
                    <li>Click the "Renew Subscription Now" button above</li>
                    <li>Choose your preferred billing cycle and payment method</li>
                    <li>Complete the renewal process to maintain uninterrupted service</li>
                    <li>Continue enjoying all your premium InstaLabel features</li>
                </ul>
            </div>
            
            <div class="info-card">
                <h3>❓ What You'll Lose Without Renewal</h3>
                <p>If your subscription expires, you'll lose access to:</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li>Premium label templates and designs</li>
                    <li>Advanced allergen management features</li>
                    <li>Bulk printing and batch operations</li>
                    <li>Priority customer support</li>
                    <li>Enhanced reporting and analytics</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Need Help with Renewal?</h3>
                <p>Our customer support team is here to assist you with any questions about renewing your subscription.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent because your InstaLabel subscription is expiring soon.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`
export const renewalReminderEmail = ({
  name,
  planName,
  renewalDate,
  amount,
  currency = 'gbp',
  billingInterval
}: {
  name: string
  planName: string
  renewalDate: string
  amount?: number
  currency?: string
  billingInterval?: 'month' | 'year'
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Renewal Reminder - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .renewal-highlight { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%); 
            border: 1px solid #4caf50; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #4caf50;
        }
        .renewal-highlight h3 { 
            color: #2e7d32; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .renewal-highlight p { 
            margin-bottom: 8px; 
            color: #388e3c;
            font-size: 15px;
        }
        .renewal-highlight p strong { 
            color: #2e7d32;
            font-weight: 600;
        }
        .renewal-badge {
            display: inline-block;
            background: #4caf50;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 16px;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .secondary-button { 
            display: inline-block; 
            background: transparent; 
            color: #667eea; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            border: 2px solid #667eea;
            margin: 8px 12px;
            transition: all 0.3s ease;
        }
        .secondary-button:hover { 
            background: #667eea;
            color: white;
        }
        .button-group {
            text-align: center;
            margin: 32px 0;
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
        }
        .important-note { 
            background: linear-gradient(135deg, #fff3e0 0%, #fffaf0 100%); 
            border: 1px solid #ffb74d; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #ff9800;
        }
        .important-note h3 { 
            color: #e65100; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .important-note p { 
            color: #bf360c;
            font-size: 15px;
            margin-bottom: 8px;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .button-group {
                text-align: center;
            }
            .secondary-button {
                display: block;
                margin: 12px 0;
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>🔄 Subscription Renewal</h1>
                <p>Your subscription will renew automatically</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                This is a friendly reminder that your InstaLabel subscription will renew automatically soon. We wanted to give you advance notice so you can review your subscription details and make any necessary changes before the renewal date.
            </div>
            
            <div class="renewal-highlight">
                <div class="renewal-badge">Auto-Renewal</div>
                <h3>🔄 Upcoming Renewal</h3>
                <p>Your <strong>${planName}</strong> subscription will automatically renew on <strong>${renewalDate}</strong>.</p>
                ${amount ? `<p><strong>Renewal Amount:</strong> ${currency.toUpperCase()} ${(amount / 100).toFixed(2)} (${billingInterval === 'month' ? 'Monthly' : 'Annual'})</p>` : ''}
                <p>No action is required on your part - your subscription will continue seamlessly.</p>
            </div>
            
            <div class="info-card">
                <h3>📋 Current Subscription Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Renewal Date:</strong> ${renewalDate}</p>
                ${amount ? `<p><strong>Billing Cycle:</strong> ${billingInterval === 'month' ? 'Monthly' : 'Annual'}</p>` : ''}
                <p><strong>Status:</strong> Active</p>
            </div>
            
            <div class="button-group">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing" class="cta-button">
                    Manage Subscription
                </a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="secondary-button">
                    View Dashboard
                </a>
            </div>
            
            <div class="important-note">
                <h3>⚠️ Want to Make Changes?</h3>
                <p>If you'd like to modify your subscription, update your payment method, or cancel your plan, please do so before the renewal date.</p>
                <p>Changes made after the renewal date will take effect on your next billing cycle.</p>
            </div>
            
            <div class="next-steps">
                <h3>🎯 What You Can Do</h3>
                <ul class="steps-list">
                    <li>Review your current plan and features</li>
                    <li>Update your payment method if needed</li>
                    <li>Upgrade or downgrade your subscription</li>
                    <li>Update your billing address or contact information</li>
                    <li>Cancel your subscription if you no longer need it</li>
                </ul>
            </div>
            
            <div class="info-card">
                <h3>💡 Why Auto-Renewal?</h3>
                <p>Auto-renewal ensures:</p>
                <ul style="margin-left: 20px; margin-top: 8px;">
                    <li>Uninterrupted access to all your premium features</li>
                    <li>No service disruption for your kitchen operations</li>
                    <li>Consistent billing without manual intervention</li>
                    <li>Peace of mind knowing your subscription is always active</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Questions About Your Renewal?</h3>
                <p>Our customer support team is here to help with any questions about your subscription or renewal process.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent as a courtesy reminder about your upcoming subscription renewal.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const renewalConfirmationEmail = ({
  name,
  planName,
  renewalDate,
  amount,
  currency = 'gbp',
  billingInterval
}: {
  name: string
  planName: string
  renewalDate: string
  amount: number
  currency?: string
  billingInterval: 'month' | 'year'
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subscription Renewed - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .renewal-highlight { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); 
            border-left-color: #28a745;
        }
        .renewal-highlight .renewal-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Subscription Renewed</h1>
                <p>Your InstaLabel subscription continues seamlessly</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                Thank you for your continued trust in InstaLabel. Your subscription has been successfully renewed and you can continue enjoying uninterrupted access to our professional kitchen labeling solutions.
            </div>
            
            <div class="info-card">
                <h3>📋 Subscription Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Billing Cycle:</strong> ${billingInterval === 'month' ? 'Monthly' : 'Annual'}</p>
                <p><strong>Amount:</strong> ${currency.toUpperCase()} ${(amount / 100).toFixed(2)}</p>
                <p><strong>Status:</strong> Active</p>
            </div>
            
            <div class="info-card renewal-highlight">
                <div class="renewal-badge">Renewed</div>
                <h3>🎉 Renewal Confirmed</h3>
                <p><strong>Renewal Date:</strong> ${renewalDate}</p>
                <p><strong>Next Billing:</strong> ${billingInterval === 'month' ? 'Next month' : 'Next year'}</p>
                <p>Your subscription has been automatically renewed. Continue enjoying all premium features without interruption.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile" class="cta-button">
                    View Billing Details
                </a>
            </div>
            
            <div class="next-steps">
                <h3>🚀 What's Next</h3>
                <ul class="steps-list">
                    <li>Continue creating professional labels for your kitchen</li>
                    <li>Explore new features and updates in your dashboard</li>
                    <li>Optimize your food safety compliance workflows</li>
                    <li>Access training resources and best practices</li>
                    <li>Review your usage analytics and insights</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Need Assistance?</h3>
                <p>Our customer success team is here to help you get the most out of InstaLabel.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent because your subscription was renewed.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const paymentFailedEmail = ({
  name,
  planName,
  dueDate
}: {
  name: string
  planName: string
  dueDate: string
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Failed - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .payment-alert { 
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); 
            border-left-color: #ffc107;
            border: 1px solid #ffeb9c;
        }
        .payment-alert .alert-badge {
            display: inline-block;
            background: #dc3545;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .urgent-notice { 
            background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%); 
            border-left-color: #dc3545;
            border: 1px solid #f8bbd9;
        }
        .urgent-notice .urgent-badge {
            display: inline-block;
            background: #dc3545;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #dc3545;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Payment Issue</h1>
                <p>Action required for your subscription</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                We encountered an issue processing your recent payment for InstaLabel. To ensure uninterrupted access to your kitchen labeling solutions, please update your payment information as soon as possible.
            </div>
            
            <div class="info-card">
                <h3>📋 Subscription Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Payment Due:</strong> ${dueDate}</p>
                <p><strong>Status:</strong> Payment Failed</p>
            </div>
            
            <div class="info-card payment-alert">
                <div class="alert-badge">Payment Issue</div>
                <h3>⚠️ Payment Processing Failed</h3>
                <p>We were unable to process your payment using the card on file. This could be due to:</p>
                <p>• Expired or invalid payment method</p>
                <p>• Insufficient funds</p>
                <p>• Bank security restrictions</p>
                <p>• Card issuer declined the transaction</p>
            </div>
            
            <div class="info-card urgent-notice">
                <div class="urgent-badge">Action Required</div>
                <h3>🚨 Immediate Action Needed</h3>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <p>Please update your payment method before the due date to avoid service interruption. Your subscription will remain active during this grace period.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile" class="cta-button">
                    Update Payment Method
                </a>
            </div>
            
            <div class="next-steps">
                <h3>🔧 How to Resolve</h3>
                <ul class="steps-list">
                    <li>Click the "Update Payment Method" button above</li>
                    <li>Add a new payment method or update your existing one</li>
                    <li>Verify your billing information is correct</li>
                    <li>Confirm the updated payment details</li>
                    <li>Your subscription will resume automatically</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Need Help?</h3>
                <p>Our support team is ready to assist you with any payment or billing questions.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent because we couldn't process your payment.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const trialEndingSoonEmail = ({
  name,
  planName,
  trialEndDate,
  daysLeft
}: {
  name: string
  planName: string
  trialEndDate: string
  daysLeft: number
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trial Ending Soon - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .countdown-card { 
            background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); 
            border-left-color: #ff9800;
            border: 1px solid #ffcc80;
            text-align: center;
        }
        .countdown-card .countdown-badge {
            display: inline-block;
            background: #ff9800;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .countdown-number {
            font-size: 48px;
            font-weight: 700;
            color: #ff9800;
            margin: 16px 0;
            line-height: 1;
        }
        .countdown-text {
            font-size: 18px;
            color: #2c3e50;
            font-weight: 600;
            margin-bottom: 16px;
        }
        .trial-benefits { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); 
            border-left-color: #28a745;
            border: 1px solid #a3d6a3;
        }
        .trial-benefits .benefits-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #ff9800;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .countdown-number {
                font-size: 36px;
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Trial Ending Soon</h1>
                <p>Don't miss out on continued access to InstaLabel</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name},</div>
            
            <div class="intro-text">
                We hope you've been enjoying your InstaLabel trial! Your free trial period is coming to an end soon. To continue using our professional kitchen labeling solutions without interruption, please choose a subscription plan.
            </div>
            
            <div class="info-card">
                <h3>📋 Trial Details</h3>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Trial End Date:</strong> ${trialEndDate}</p>
                <p><strong>Current Status:</strong> Active Trial</p>
            </div>
            
            <div class="info-card countdown-card">
                <div class="countdown-badge">Time Remaining</div>
                <div class="countdown-number">${daysLeft}</div>
                <div class="countdown-text">Day${daysLeft === 1 ? '' : 's'} Left</div>
                <p>Your trial will end on <strong>${trialEndDate}</strong>. After this date, you'll need an active subscription to continue using InstaLabel.</p>
            </div>
            
            <div class="info-card trial-benefits">
                <div class="benefits-badge">Don't Lose Access</div>
                <h3>✨ What You'll Keep With a Subscription</h3>
                <p>• Professional kitchen label creation and printing</p>
                <p>• Comprehensive allergen management system</p>
                <p>• Food safety compliance tracking</p>
                <p>• Custom branding and template designs</p>
                <p>• Priority customer support</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile" class="cta-button">
                    Choose Your Plan
                </a>
            </div>
            
            <div class="next-steps">
                <h3>🚀 Continue Your Journey</h3>
                <ul class="steps-list">
                    <li>Click "Choose Your Plan" to view subscription options</li>
                    <li>Select the plan that best fits your needs</li>
                    <li>Add your payment information</li>
                    <li>Enjoy uninterrupted access to all features</li>
                    <li>Continue growing your business with InstaLabel</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Questions About Upgrading?</h3>
                <p>Our team is here to help you choose the right plan and ensure a smooth transition.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent because your trial is ending soon.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const labelOrderConfirmationEmail = ({
  name,
  email,
  bundleCount,
  labelCount,
  amount,
  shippingAddress,
  orderId,
}: {
  name: string
  email: string
  bundleCount: number
  labelCount: number
  amount: number
  shippingAddress: string
  orderId: string | number
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Label Order Confirmation - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .shipping-highlight { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); 
            border-left-color: #28a745;
        }
        .shipping-highlight .shipping-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .shipping-address {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 12px;
            margin-top: 8px;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
            color: #2c3e50;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Order Confirmed!</h1>
                <p>Your premium labels are on their way</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name || email},</div>
            
            <div class="intro-text">
                Thank you for your order! Your payment has been successfully processed and your professional kitchen labels are being prepared for shipment. You'll receive tracking information once your order is dispatched.
            </div>
            
            <div class="info-card">
                <h3>📦 Order Details</h3>
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Label Bundles:</strong> ${bundleCount}</p>
                <p><strong>Total Labels:</strong> ${labelCount}</p>
                <p><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</p>
                <p><strong>Order Status:</strong> Confirmed & Processing</p>
            </div>
            
            <div class="info-card shipping-highlight">
                <div class="shipping-badge">Shipping</div>
                <h3>🚚 Delivery Information</h3>
                <p><strong>Shipping Address:</strong></p>
                <div class="shipping-address">${shippingAddress.replace(/, /g, '<br>')}</div>
                <p style="margin-top: 12px;">Expected delivery: 3-5 business days</p>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
                    Track Your Order
                </a>
            </div>
            
            <div class="next-steps">
                <h3>📋 What Happens Next</h3>
                <ul class="steps-list">
                    <li>Your order is being processed and quality checked</li>
                    <li>Labels will be carefully packaged for shipping</li>
                    <li>You'll receive tracking information via email</li>
                    <li>Your labels will be delivered within 3-5 business days</li>
                    <li>Start creating professional kitchen labels immediately</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Need Help?</h3>
                <p>Our support team is ready to assist you with any questions about your order or our products.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent to confirm your label order.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const labelOrderShippedEmail = ({
  name,
  email,
  bundleCount,
  labelCount,
  amount,
  shippingAddress,
  orderId,
}: {
  name: string
  email: string
  bundleCount: number
  labelCount: number
  amount: number
  shippingAddress: string
  orderId: string | number
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Labels Have Shipped! - InstaLabel</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .content { 
            padding: 40px 30px; 
        }
        .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .intro-text { 
            font-size: 16px; 
            margin-bottom: 32px; 
            color: #333;
            line-height: 1.7;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #667eea;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .shipping-highlight { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); 
            border-left-color: #28a745;
        }
        .shipping-highlight .shipping-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .delivery-highlight { 
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); 
            border-left-color: #ffc107;
        }
        .delivery-highlight .delivery-badge {
            display: inline-block;
            background: #ffc107;
            color: #212529;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .shipping-address {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 12px;
            margin-top: 8px;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
            color: #2c3e50;
        }
        .tracking-section {
            background: #fff;
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
            text-align: center;
        }
        .tracking-section h4 {
            color: #667eea;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        .tracking-section p {
            color: #555;
            font-size: 14px;
            margin-bottom: 8px;
        }
        .tracking-number {
            font-family: monospace;
            font-size: 16px;
            font-weight: 600;
            color: #2c3e50;
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 4px;
            display: inline-block;
            margin: 8px 0;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        .cta-button.secondary {
            background: #fff;
            color: #667eea;
            border: 2px solid #667eea;
            box-shadow: none;
        }
        .cta-button.secondary:hover {
            background: #f8f9fa;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
        }
        .button-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '✓';
            position: absolute;
            left: 0;
            color: #28a745;
            font-weight: bold;
        }
        .support-section { 
            background: #f8f9fa; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            text-align: center;
        }
        .support-section h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 12px;
        }
        .support-section p { 
            color: #555; 
            margin-bottom: 16px;
        }
        .support-links { 
            display: flex; 
            justify-content: center; 
            gap: 20px; 
            flex-wrap: wrap;
        }
        .support-link { 
            color: #667eea; 
            text-decoration: none; 
            font-weight: 600;
            font-size: 14px;
        }
        .support-link:hover { 
            color: #764ba2; 
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #667eea; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .support-links { 
                flex-direction: column; 
                gap: 12px; 
            }
            .button-group {
                flex-direction: column;
                align-items: center;
            }
            .cta-button {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>Your Labels Have Shipped!</h1>
                <p>Your order is on its way. Track your package with Royal Mail using your address.</p>
            </div>
        </div>
        
        <div class="content">
            <div class="greeting">Hello ${name || email},</div>
            
            <div class="intro-text">
                Great news! Your premium kitchen labels have been carefully packaged and shipped. Your order is now on its way to you and should arrive within 2-3 business days.
            </div>
            
            <div class="info-card">
                <h3>📦 Shipped Order Details</h3>
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Label Bundles:</strong> ${bundleCount}</p>
                <p><strong>Total Labels:</strong> ${labelCount}</p>
                <p><strong>Amount Paid:</strong> $${(amount / 100).toFixed(2)}</p>
                <p><strong>Order Status:</strong> Shipped & In Transit</p>
            </div>
            
            <div class="info-card delivery-highlight">
                <div class="delivery-badge">In Transit</div>
                <h3>🚚 Delivery Information</h3>
                <p><strong>Shipping Address:</strong></p>
                <div class="shipping-address">${shippingAddress.replace(/, /g, '<br>')}</div>
                <p style="margin-top: 12px;"><strong>Expected Delivery:</strong> 2-3 business days</p>
                
                <div class="tracking-section">
                    <h4>📍 Track Your Package</h4>
                    <p>Use the tracking information provided by your carrier to monitor your package's progress.</p>
                    <p style="font-size: 13px; color: #888;">You'll receive tracking details from the shipping carrier via email.</p>
                </div>
            </div>
            
            <div class="button-group">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="cta-button">
                    View Order Status
                </a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/help/tracking" class="cta-button secondary">
                    Tracking Help
                </a>
            </div>
            
            <div class="next-steps">
                <h3>📋 While You Wait</h3>
                <ul class="steps-list">
                    <li>Your package is being carefully handled by our shipping partner</li>
                    <li>Track your shipment using carrier tracking information</li>
                    <li>Prepare your kitchen workspace for professional labeling</li>
                    <li>Review our quick-start guide for label application tips</li>
                    <li>Get ready to enhance your food safety compliance</li>
                </ul>
            </div>
            
            <div class="support-section">
                <h3>Questions About Your Shipment?</h3>
                <p>Our support team can help with tracking, delivery questions, or any concerns about your order.</p>
                <div class="support-links">
                    <a href="mailto:support@instalabel.co" class="support-link">📧 Email Support</a>
                    <a href="tel:+441234567890" class="support-link">📞 Phone Support</a>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL}/help" class="support-link">📚 Help Center</a>
                </div>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel</strong> - Professional Kitchen Labeling Solutions</p>
            <div class="divider"></div>
            <p>This email was sent to notify you that your order has shipped.</p>
            <p>Questions? Contact us at <a href="mailto:support@instalabel.co">support@instalabel.co</a></p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`

export const labelOrderAdminNotificationEmail = ({
  name,
  email,
  bundleCount,
  labelCount,
  amount,
  shippingAddress,
  orderId,
}: {
  name: string
  email: string
  bundleCount: number
  labelCount: number
  amount: number
  shippingAddress: string
  orderId: string | number
}) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Label Order - Admin Notification</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #2c3e50; 
            background-color: #f8f9fa;
        }
        .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: #ffffff; 
            border-radius: 12px; 
            overflow: hidden; 
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
        .header { 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            color: white; 
            padding: 40px 30px; 
            text-align: center; 
            position: relative;
        }
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
        }
        .header-content { position: relative; z-index: 1; }
        .logo { 
            max-width: 120px; 
            height: auto; 
            margin-bottom: 8px;
            filter: brightness(0) invert(1);
        }
        .header h1 { 
            font-size: 28px; 
            font-weight: 700; 
            margin-bottom: 8px;
            letter-spacing: -0.5px;
            color: #fff;
        }
        .header p { 
            font-size: 16px; 
            opacity: 0.9;
            font-weight: 400;
            color: #fff;
        }
        .urgent-badge {
            display: inline-block;
            background: #ffc107;
            color: #212529;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .content { 
            padding: 40px 30px; 
        }
        .alert-section {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            border-left: 4px solid #ffc107;
        }
        .alert-section h3 {
            color: #856404;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .alert-section p {
            color: #856404;
            font-size: 15px;
            margin-bottom: 8px;
        }
        .info-card { 
            background: #f8f9fa; 
            border: 1px solid #e9ecef; 
            border-radius: 8px; 
            padding: 24px; 
            margin: 24px 0;
            border-left: 4px solid #dc3545;
        }
        .info-card h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-card p { 
            margin-bottom: 8px; 
            color: #555;
            font-size: 15px;
        }
        .info-card p strong { 
            color: #2c3e50;
            font-weight: 600;
        }
        .customer-highlight { 
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%); 
            border-left-color: #2196f3;
        }
        .customer-highlight .customer-badge {
            display: inline-block;
            background: #2196f3;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .shipping-highlight { 
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8f0 100%); 
            border-left-color: #28a745;
        }
        .shipping-highlight .shipping-badge {
            display: inline-block;
            background: #28a745;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }
        .shipping-address {
            background: #fff;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 12px;
            margin-top: 8px;
            font-family: monospace;
            font-size: 14px;
            line-height: 1.4;
            color: #2c3e50;
        }
        .cta-button { 
            display: inline-block; 
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 6px; 
            font-weight: 600;
            font-size: 16px;
            margin: 24px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
        }
        .cta-button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
        }
        .cta-button.secondary {
            background: #fff;
            color: #dc3545;
            border: 2px solid #dc3545;
            box-shadow: none;
        }
        .cta-button.secondary:hover {
            background: #f8f9fa;
            box-shadow: 0 4px 12px rgba(220, 53, 69, 0.1);
        }
        .button-group {
            display: flex;
            gap: 16px;
            justify-content: center;
            flex-wrap: wrap;
        }
        .order-summary {
            background: #fff;
            border: 2px solid #dc3545;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        .order-summary h4 {
            color: #dc3545;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
        }
        .order-summary .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .order-summary .summary-row:last-child {
            border-bottom: none;
            font-weight: 600;
            color: #dc3545;
            font-size: 16px;
        }
        .order-summary .summary-row span:first-child {
            color: #555;
        }
        .order-summary .summary-row span:last-child {
            color: #2c3e50;
            font-weight: 600;
        }
        .next-steps { 
            margin: 32px 0; 
        }
        .next-steps h3 { 
            color: #2c3e50; 
            font-size: 18px; 
            font-weight: 600; 
            margin-bottom: 16px;
        }
        .steps-list { 
            list-style: none; 
            padding: 0; 
        }
        .steps-list li { 
            padding: 12px 0; 
            border-bottom: 1px solid #e9ecef; 
            color: #555;
            font-size: 15px;
            position: relative;
            padding-left: 24px;
        }
        .steps-list li:last-child { 
            border-bottom: none; 
        }
        .steps-list li::before {
            content: '→';
            position: absolute;
            left: 0;
            color: #dc3545;
            font-weight: bold;
        }
        .footer { 
            background: #2c3e50; 
            color: #ecf0f1; 
            padding: 30px; 
            text-align: center; 
            font-size: 14px;
        }
        .footer p { 
            margin-bottom: 8px; 
        }
        .footer a { 
            color: #dc3545; 
            text-decoration: none; 
        }
        .footer .divider { 
            margin: 16px 0; 
            height: 1px; 
            background: #34495e; 
        }
        @media (max-width: 600px) {
            .email-container { 
                margin: 0; 
                border-radius: 0; 
            }
            .header, .content { 
                padding: 30px 20px; 
            }
            .header h1 { 
                font-size: 24px; 
            }
            .button-group {
                flex-direction: column;
                align-items: center;
            }
            .cta-button {
                width: 100%;
                text-align: center;
            }
            .order-summary .summary-row {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <div class="urgent-badge">Action Required</div>
                <img src="/long_longwhite.png" alt="InstaLabel" class="logo">
                <h1>New Order Received</h1>
                <p>Label order payment confirmed - process immediately</p>
            </div>
        </div>
        
        <div class="content">
            <div class="alert-section">
                <h3>🚨 New Paid Order Alert</h3>
                <p>A new label order has been successfully paid and is ready for processing.</p>
                <p><strong>Action needed:</strong> Review order details and mark as shipped once processed.</p>
            </div>
            
            <div class="info-card">
                <h3>📦 Order Information</h3>
                <p><strong>Order Number:</strong> #${orderId}</p>
                <p><strong>Label Bundles:</strong> ${bundleCount}</p>
                <p><strong>Total Labels:</strong> ${labelCount}</p>
                <p><strong>Order Value:</strong> $${(amount / 100).toFixed(2)}</p>
                <p><strong>Status:</strong> Paid & Ready to Ship</p>
            </div>
            
            <div class="info-card customer-highlight">
                <div class="customer-badge">Customer</div>
                <h3>👤 Customer Details</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Contact:</strong> Available via email for any questions</p>
            </div>
            
            <div class="info-card shipping-highlight">
                <div class="shipping-badge">Shipping</div>
                <h3>🚚 Shipping Information</h3>
                <p><strong>Delivery Address:</strong></p>
                <div class="shipping-address">${shippingAddress.replace(/, /g, '<br>')}</div>
                <p style="margin-top: 12px;"><strong>Processing time:</strong> Ship within 24 hours</p>
            </div>
            
            <div class="order-summary">
                <h4>📊 Order Summary</h4>
                <div class="summary-row">
                    <span>Bundle Count:</span>
                    <span>${bundleCount}</span>
                </div>
                <div class="summary-row">
                    <span>Label Count:</span>
                    <span>${labelCount}</span>
                </div>
                <div class="summary-row">
                    <span>Total Amount:</span>
                    <span>$${(amount / 100).toFixed(2)}</span>
                </div>
            </div>
            
            <div class="button-group">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/bossdashboard/orders" class="cta-button">
                    Manage in Boss Dashboard
                </a>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/bossdashboard/orders?order=${orderId}" class="cta-button secondary">
                    View Order Details
                </a>
            </div>
            
            <div class="next-steps">
                <h3>⚡ Next Steps</h3>
                <ul class="steps-list">
                    <li>Review order details in the Boss Dashboard</li>
                    <li>Prepare label bundles for shipping</li>
                    <li>Print shipping labels and package securely</li>
                    <li>Mark order as shipped in the system</li>
                    <li>Customer will receive automated shipping notification</li>
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>InstaLabel Admin</strong> - Order Management System</p>
            <div class="divider"></div>
            <p>This is an automated admin notification for new orders.</p>
            <p>Access the <a href="${process.env.NEXT_PUBLIC_APP_URL}/bossdashboard/orders">Boss Dashboard</a> to manage orders</p>
            <p style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
                © ${new Date().getFullYear()} InstaLabel. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`