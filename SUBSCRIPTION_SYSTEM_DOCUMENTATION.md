# InstaLabel Subscription System - Comprehensive Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Database Schema](#database-schema)
3. [API Endpoints](#api-endpoints)
4. [Frontend Components](#frontend-components)
5. [Business Logic & Workflows](#business-logic--workflows)
6. [Stripe Integration](#stripe-integration)
7. [Email Templates](#email-templates)
8. [Admin Notifications](#admin-notifications)
9. [Type Definitions](#type-definitions)
10. [Error Handling](#error-handling)
11. [Security Considerations](#security-considerations)

## System Overview

The InstaLabel subscription system is a comprehensive SaaS billing solution built on Next.js with Stripe as the payment processor. It handles subscription management, plan changes, billing cycles, trials, cancellations, and admin notifications.

### Key Features

- **Multi-tier subscription plans** with monthly/yearly billing
- **14-day free trials** for new users
- **Plan upgrades/downgrades** with proration
- **Scheduled cancellations** at period end
- **Admin dashboard** for subscription management
- **Email notifications** for all subscription events
- **Device management** integration for hardware plans
- **Analytics and reporting** for business insights

## Database Schema

### Core Tables

#### `subscription_better` Table

Primary subscription data storage:

```sql
-- Key fields from the subscription_better table
user_id: TEXT (Primary Key)
stripe_customer_id: TEXT
stripe_subscription_id: TEXT
plan_id: TEXT
plan_name: TEXT
status: TEXT (active, trialing, canceled, past_due, etc.)
trial_start: TIMESTAMP
trial_end: TIMESTAMP
current_period_start: TIMESTAMP
current_period_end: TIMESTAMP
billing_interval: TEXT (monthly, yearly)
amount: DECIMAL (in cents)
currency: TEXT (default: gbp)
cancel_at_period_end: BOOLEAN
cancel_at: TIMESTAMP
pending_plan_change: TEXT
pending_plan_change_effective: TIMESTAMP
pending_price_id: TEXT
pending_plan_interval: TEXT
pending_plan_name: TEXT
card_brand: TEXT
card_last4: TEXT
card_exp_month: INTEGER
card_exp_year: INTEGER
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### `plans` Table

Subscription plan definitions:

```sql
-- Key fields from the plans table
id: SERIAL PRIMARY KEY
name: TEXT
price_monthly: INTEGER (in cents)
price_yearly: INTEGER (in cents)
stripe_price_id_monthly: TEXT
stripe_price_id_yearly: TEXT
stripe_product_id: TEXT
description: TEXT
features: JSONB
is_active: BOOLEAN
tier: INTEGER
highlight: BOOLEAN
include_device: BOOLEAN
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### `subscription_cancellations` Table

Tracks cancellation reasons and metadata:

```sql
id: SERIAL PRIMARY KEY
user_id: TEXT
subscription_id: TEXT
reason: TEXT
cancelled_at: TIMESTAMP
```

#### `admin_notifications` Table

System notifications for admin dashboard:

```sql
id: SERIAL PRIMARY KEY
type: VARCHAR(50) (new_signup, upgrade, cancellation, etc.)
title: VARCHAR(255)
message: TEXT
timestamp: TIMESTAMP
read: BOOLEAN
data: JSONB
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

## API Endpoints

### Subscription Management

#### `GET /api/subscription_better/status`

**Purpose**: Get current subscription status for authenticated user
**Authentication**: JWT token required
**Response**:

```json
{
  "subscription": {
    "user_id": "uuid",
    "status": "active|trialing|canceled|past_due",
    "plan_name": "Pro Kitchen",
    "billing_interval": "monthly|yearly",
    "amount": 9999,
    "current_period_end": "2024-01-15T00:00:00Z",
    "trial_end": "2024-01-10T00:00:00Z",
    "cancel_at_period_end": false,
    "pending_plan_change": null
  }
}
```

#### `POST /api/subscription_better/create-checkout-session`

**Purpose**: Create Stripe checkout session for new subscriptions
**Body**:

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "plan_id": "1",
  "price_id": "price_1234567890"
}
```

**Response**:

```json
{
  "url": "https://checkout.stripe.com/c/pay/cs_..."
}
```

#### `POST /api/subscription_better/change-plan`

**Purpose**: Change subscription plan (upgrade/downgrade/billing change)
**Body**:

```json
{
  "user_id": "uuid",
  "plan_id": "2",
  "price_id": "price_0987654321"
}
```

**Business Logic**:

- **Upgrades**: Immediate change with proration
- **Downgrades**: Scheduled for end of billing period
- **Billing changes**: Monthly→Yearly immediate, Yearly→Monthly scheduled
- **Trial users**: Any change ends trial immediately

#### `POST /api/subscription_better/cancel`

**Purpose**: Cancel subscription with different policies
**Body**:

```json
{
  "user_id": "uuid",
  "immediate": false,
  "reason": "Business closure"
}
```

**Cancellation Policies**:

- **Trial users**: Immediate cancellation
- **All paid plans**: Cancel at end of current billing period

#### `POST /api/subscription_better/reactivate`

**Purpose**: Reactivate a scheduled cancellation
**Body**:

```json
{
  "user_id": "uuid"
}
```

### Plan Management

#### `GET /api/plans/secure`

**Purpose**: Get available subscription plans for authenticated users
**Response**:

```json
[
  {
    "id": "1",
    "name": "Pro Kitchen",
    "price_monthly": 9999,
    "price_yearly": 99999,
    "price_id_monthly": "price_1234567890",
    "price_id_yearly": "price_0987654321",
    "description": "Perfect for professional kitchens",
    "features": ["Unlimited labels", "Priority support"],
    "tier": 2,
    "highlight": true,
    "include_device": true
  }
]
```

#### `GET /api/plans` (Boss only)

**Purpose**: Get all plans for admin management
**Authentication**: Boss role required

#### `POST /api/plans` (Boss only)

**Purpose**: Create new subscription plan
**Authentication**: Boss role required

### Analytics & Reporting

#### `GET /api/subscription_better/analytics`

**Purpose**: Get subscription analytics and metrics
**Authentication**: JWT token required
**Response**:

```json
{
  "total": 150,
  "active": 120,
  "trialing": 15,
  "canceled": 15,
  "mrr": 12500.00,
  "arr": 150000.00,
  "arpu": 104.17,
  "churnRate": 0.10,
  "trialConversion": 0.85,
  "planDistribution": [...],
  "statusDistribution": [...],
  "recentSignups": [...],
  "topCustomers": [...],
  "upcomingRenewals": [...],
  "pendingChanges": [...],
  "failedPayments": [...]
}
```

#### `GET /api/subscription_better/users` (Boss only)

**Purpose**: Get all users with subscription data
**Authentication**: Boss role required

### Invoice Management

#### `GET /api/subscription_better/invoices`

**Purpose**: Get invoice history for user
**Query Parameters**:

- `user_id`: User ID (required for users, optional for bosses)
- `date_from`: Start date filter
- `date_to`: End date filter

## Frontend Components

### Core Components

#### `Billing.tsx`

**Location**: `src/app/dashboard/profile/Billing.tsx`
**Purpose**: Main billing dashboard component
**Features**:

- Trial banner display
- Subscription info card
- Plan renewal information
- Payment method management
- Invoice history
- Billing address management
- Cancellation scheduling banner

#### `SubscriptionInfo.tsx`

**Location**: `src/app/dashboard/profile/billingcomponents/subscriptionInfo.tsx`
**Purpose**: Display current subscription details
**Features**:

- Plan name and pricing
- Billing interval
- Trial status indicator
- Change plan button
- Reactivate button for scheduled cancellations

#### `PlanSelectionModal.tsx`

**Location**: `src/app/dashboard/profile/billingcomponents/planSelectionModal.tsx`
**Purpose**: Comprehensive plan selection interface
**Features**:

- Plan comparison grid
- Billing period toggle (monthly/yearly)
- Upgrade/downgrade indicators
- Change confirmation with impact details
- Cancellation workflow
- Pending change notifications

#### `UpgradePlanModal.tsx`

**Location**: `src/app/dashboard/profile/billingcomponents/UpgradePlanModal.tsx`
**Purpose**: Specialized upgrade interface for scheduled cancellations
**Features**:

- Filtered upgrade options only
- Reactivation option
- Immediate upgrade processing

### Supporting Components

#### `useBillingData.ts`

**Location**: `src/app/dashboard/profile/hooks/useBillingData.ts`
**Purpose**: Custom hook for subscription data management
**Features**:

- Subscription data fetching
- Profile data management
- Invoice history loading
- Refresh functions
- Error handling

#### `PaymentMethod.tsx`

**Location**: `src/app/dashboard/profile/billingcomponents/paymentMethod.tsx`
**Purpose**: Display and manage payment methods
**Features**:

- Card information display
- Update payment method
- Billing address management

#### `invoicesList.tsx`

**Location**: `src/app/dashboard/profile/billingcomponents/invoicesList.tsx`
**Purpose**: Display invoice history
**Features**:

- Paginated invoice list
- Download PDF functionality
- Status indicators
- Amount formatting

## Business Logic & Workflows

### Subscription Lifecycle

#### 1. New User Signup

```
User Registration → Plan Selection → Stripe Checkout → Webhook Processing → Database Update → Welcome Email
```

**Trial Eligibility**:

- First-time users get 14-day free trial
- Trial starts immediately upon subscription creation
- No payment required during trial

#### 2. Plan Changes

**Upgrade Workflow**:

1. User selects higher-tier plan
2. Immediate Stripe subscription update with proration
3. Database update with new plan details
4. Confirmation email sent
5. Admin notification created

**Downgrade Workflow**:

1. User selects lower-tier plan
2. Pending change scheduled for period end
3. Database updated with pending change details
4. Confirmation email with effective date
5. Change applied at period end via webhook

**Billing Period Changes**:

- Monthly → Yearly: Immediate with proration
- Yearly → Monthly: Scheduled for period end

#### 3. Cancellation Workflow

**Trial Cancellation**:

1. Immediate Stripe cancellation
2. Database status update to 'canceled'
3. Access revoked immediately
4. Cancellation email sent

**All Plan Cancellations**:

1. Cancel at end of current billing period
2. User retains access until period end
3. No refunds provided for unused time
4. Cancellation email with end date

#### 4. Payment Failure Handling

**Past Due Status**:

1. Stripe webhook triggers payment failure
2. Database status updated to 'past_due'
3. Admin notification created
4. User email notification sent
5. Grace period before service suspension

**Payment Recovery**:

1. Successful payment webhook received
2. Status updated to 'active'
3. Admin notification for recovery
4. User confirmation email

### Trial Management

**Trial Features**:

- 14-day duration for new users
- Full feature access during trial
- Automatic conversion to paid plan
- Trial extension not supported
- Immediate conversion on plan changes

**Trial End Handling**:

1. Stripe webhook for trial end
2. Automatic payment attempt
3. Success: Status to 'active'
4. Failure: Status to 'past_due'
5. Email notifications sent

## Stripe Integration

### Configuration

**File**: `src/lib/stripe.ts`

```typescript
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
})
```

### Webhook Handling

**File**: `src/app/api/subscription_better/webhook/route.ts`

**Supported Events**:

- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.trial_will_end`

**Webhook Security**:

- Signature verification using `STRIPE_WEBHOOK_SECRET`
- Event deduplication
- Error handling and logging

### Checkout Sessions

**Features**:

- Trial period for eligible users
- Promotion code support
- Billing address collection
- Success/cancel URL handling
- Metadata for plan tracking

## Email Templates

### Template System

**File**: `src/components/templates/subscriptionEmails.ts`

**Available Templates**:

1. `newSubscriptionEmail` - Welcome email for new subscribers
2. `planChangeEmail` - Plan upgrade/downgrade notifications
3. `cancellationEmail` - Cancellation confirmations
4. `expiringSoonEmail` - Trial ending soon warnings
5. `renewalReminderEmail` - Billing reminders
6. `renewalConfirmationEmail` - Successful renewal confirmations
7. `paymentFailedEmail` - Payment failure notifications
8. `trialEndingSoonEmail` - Trial expiration warnings

### Email Features

- Responsive HTML design
- Branded styling with InstaLabel colors
- Dynamic content based on subscription details
- Call-to-action buttons
- Support contact information

## Admin Notifications

### Notification System

**File**: `setup_admin_notifications_complete.sql`

**Notification Types**:

- `new_signup` - New customer registrations
- `upgrade` - Plan upgrades
- `cancellation` - Subscription cancellations
- `payment_failed` - Payment failures
- `payment_recovered` - Payment recoveries
- `plan_renewal` - Plan renewals
- `device_shipped` - Device shipments
- `device_delivered` - Device deliveries
- `label_order_placed` - New label orders
- `label_order_paid` - Order payments
- `label_order_shipped` - Order shipments

### Database Triggers

**Automatic Notifications**:

- New subscription creation
- Plan changes
- Subscription cancellations
- Device status changes
- Label order status changes

**Manual Notifications**:

- Payment failures (from webhooks)
- Payment recoveries (from webhooks)
- Plan renewals (from webhooks)

## Type Definitions

### Core Types

#### Subscription Interface

```typescript
interface Subscription {
  id?: string
  user_id: string
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  plan_id?: string | null
  plan_name?: string | null
  status: string
  trial_start?: string | null
  trial_end?: string | null
  current_period_start?: string | null
  current_period_end?: string | null
  billing_interval?: string | null
  amount?: number | null
  currency?: string | null
  cancel_at_period_end?: boolean | null
  pending_plan_change?: string | null
  pending_plan_change_effective?: string | null
  pending_plan_interval?: string | null
  pending_plan_name?: string | null
  card_brand?: string | null
  card_last4?: string | null
  card_exp_month?: number | null
  card_exp_year?: number | null
  created_at?: string
  updated_at?: string
  cancel_at?: string | null
}
```

#### Plan Interface

```typescript
interface Plan {
  id: string
  name: string
  price_monthly: number
  price_yearly: number
  price_id_monthly: string
  price_id_yearly: string
  description: string
  features: string[]
  tier: number
  highlight: boolean
  include_device: boolean
}
```

#### Invoice Interface

```typescript
interface Invoice {
  id: string
  total: number
  status: string
  created: number
  invoice_pdf?: string
  description?: string
  lines?: {
    data: InvoiceLine[]
  }
  metadata?: Record<string, any>
}
```

### Status Types

```typescript
type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "trialing"
  | "incomplete"
  | "incomplete_expired"
  | "unpaid"

type BillingPeriod = "monthly" | "yearly"

type ChangeType = "upgrade" | "downgrade" | "same" | "billing_change"
```

## Error Handling

### API Error Responses

**Standard Format**:

```json
{
  "error": "Error message",
  "status": 400
}
```

**Common Error Scenarios**:

- Missing authentication token
- Invalid plan selection
- Stripe API failures
- Database connection issues
- Webhook signature verification failures

### Frontend Error Handling

- Loading states for all async operations
- Error boundaries for component failures
- User-friendly error messages
- Retry mechanisms for failed requests
- Fallback UI for critical failures

### Logging

- Comprehensive webhook event logging
- API request/response logging
- Error tracking with stack traces
- Performance monitoring
- User action tracking

## Security Considerations

### Authentication

- JWT token-based authentication
- Role-based access control (user/boss)
- Token expiration handling
- Secure token storage

### Data Protection

- Stripe webhook signature verification
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### API Security

- Rate limiting (implemented via middleware)
- CORS configuration
- Request validation
- Error message sanitization
- Audit logging

### Payment Security

- PCI compliance via Stripe
- No card data storage
- Secure webhook handling
- Payment method validation
- Fraud detection integration

## Performance Optimizations

### Database

- Indexed queries for subscription lookups
- Connection pooling
- Query optimization
- Caching strategies

### Frontend

- Lazy loading of components
- Optimized re-renders
- Memoization of expensive calculations
- Efficient state management

### API

- Parallel data fetching
- Response caching
- Pagination for large datasets
- Optimized database queries

## Monitoring & Analytics

### Business Metrics

- Monthly Recurring Revenue (MRR)
- Annual Recurring Revenue (ARR)
- Customer Lifetime Value (CLV)
- Churn rate
- Trial conversion rate
- Average Revenue Per User (ARPU)

### Technical Metrics

- API response times
- Error rates
- Webhook processing times
- Database query performance
- User engagement metrics

### Alerting

- Payment failure notifications
- System error alerts
- Performance degradation warnings
- Security incident notifications

## Future Enhancements

### Planned Features

- Proration calculations for mid-cycle changes
- Multiple payment methods per customer
- Subscription pausing functionality
- Advanced analytics dashboard
- Automated dunning management
- Multi-currency support
- Enterprise billing features

### Technical Improvements

- GraphQL API implementation
- Real-time subscription updates
- Advanced caching strategies
- Microservices architecture
- Enhanced monitoring and observability
- Automated testing coverage

---

_This documentation covers the complete InstaLabel subscription system as of the current codebase analysis. For specific implementation details, refer to the individual source files mentioned throughout this document._
