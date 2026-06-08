# InstaLabel Boss Dashboard — One-Page Summary

**Base URL:** `/bossdashboard` · **Theme:** Dark UI, purple branding · **Auth:** Boss token required

---

## Page Index

| Page | Route | KPIs / Metrics | Charts & Lists | Primary APIs |
|------|-------|----------------|----------------|--------------|
| **Dashboard** | `/bossdashboard` | Total Users, MRR, ARPU, Prints (today/yesterday/week), Churn Rate, Pending Devices, Recent Label Orders | Tabs: Plan & Status distribution; Recent Signups; Top Customers, Renewals, Pending Changes, Failed Payments | `subscription_better/analytics`, `devices`, `label-orders/all`, `logs/summary` |
| **Analytics** | `/bossdashboard/analytics` | **Executive:** MRR, ARR, Active/Trialing/Cancelled, Churn, ARPU, New/Cancelled this month, Trial conversion · **Usage:** Labels month/today, Most active kitchen, Avg labels/kitchen | Revenue & MRR trends, Revenue by plan/cycle, Customer growth/acquisition, Active vs cancelled, Subscription growth, Plan/Status pies, Labels over time, Device activity/shipments, **Top Customers** (by total paid) | `subscription_better/analytics`, `devices` |
| **Users** | `/bossdashboard/users` | Per-user **Billing:** total paid, payments-over-time chart, invoice list · **Prints:** total, by label type, recent logs | Users table: company, email, plan, billing, status, renewal, trial, pending change | `subscription_better/users`, `subscription_better/invoices`, `logs/summary/user/{id}` |
| **Orders** | `/bossdashboard/orders` | — | Label orders table: order #, product, user, bundles, labels, amount, status, dates | `label-orders/all` |
| **Plans** | `/bossdashboard/plans` | — | Plans CRUD table: prices, tier, Stripe IDs, features, device flag | `plans` |
| **Bosses** | `/bossdashboard/bosses` | — | Admin accounts table | `bosses` |
| **Devices** | `/bossdashboard/devices` | Total, Pending, In Transit, Return Required | Device inventory table + CSV export | `devices` |
| **Notifications** | `/bossdashboard/notifications` | Total, Unread, New Signups, Upgrades, Device Events, Label Orders | Notifications inbox table | `admin-notifications` |
| **Label Products** | `/bossdashboard/label-products` | — | Product catalog table | `label-products` |
| **Demo Requests** | `/bossdashboard/bookdemo` | — | Demo bookings table | `bookdemo` |
| **Cancel Requests** | `/bossdashboard/cancellations` | Result count | Cancellations table: user, email, company, reason, date | `subscription_better/cancel` |
| **Reports** | `/bossdashboard/reports` | Revenue tab: MRR, ARR, ARPU, Churn, Trial conversion, Active/Canceled/Total subs | 7 exportable tabs (Users, Subscriptions, Invoices, Cancellations, Revenue, Devices, Label Orders) with date range | Multiple `subscription_better/*`, `devices`, `label-orders/all` |
| **Waitlist** | `/bossdashboard/waitlist` | Total, Pending, Contacted, Converted | Waitlist entries table + CSV | `waitlist` |
| **Bulk Email** | `/bossdashboard/bulk-email` *(hidden from nav)* | Valid recipient count | Email composer + send log | `bulk-email/send` |

---

## Key Metric Definitions

| Metric | Calculation |
|--------|-------------|
| **MRR** | Sum of active subscription amounts normalised to monthly (£) |
| **ARR** | Annualised revenue from active subscriptions |
| **ARPU** | MRR ÷ active customers |
| **Churn Rate** | Cancelled ÷ total accounts |
| **Trial Conversion** | (Active + cancelled) ÷ (trialing + active + cancelled) |
| **Prints** | Sum of `quantity` from `activity_logs` where `action = print_label` |
| **Avg Labels / Customer** | Labels this month ÷ distinct kitchens that printed this month |
| **Top Customers** | All customers with Stripe ID → sum paid invoice `amount_paid` → **rank by total paid** (top 10) |

---

## Analytics-Heavy vs Admin Pages

**Metrics & charts:** Dashboard · Analytics · Reports · Devices (stats) · Notifications (stats) · Waitlist (stats)

**CRUD / operations:** Users · Orders · Plans · Bosses · Label Products · Demo · Cancellations · Bulk Email

*Only `/bossdashboard/analytics` uses Recharts. Main dashboard uses list-style widgets.*

---

*Generated for InstaLabel internal use. Print via browser (Cmd/Ctrl+P) — fits one page at ~10pt.*
