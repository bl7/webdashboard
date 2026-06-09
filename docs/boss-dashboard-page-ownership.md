# InstaLabel Boss Dashboard — Page Ownership & UI Reference

## Ownership rule

Each metric has **one primary home**. Other pages may only show small previews with links to the primary page.

| Page | Route | Role |
|------|-------|------|
| Dashboard | `/bossdashboard` | Daily Action Centre |
| Analytics | `/bossdashboard/analytics` | Growth & Performance |
| Users | `/bossdashboard/users` | Customer Investigation |
| Reports | `/bossdashboard/reports` | Export & Accounting |
| Devices | `/bossdashboard/devices` | Hardware Operations |
| Orders | `/bossdashboard/orders` | Label Order Operations |
| Notifications | `/bossdashboard/notifications` | Event Inbox |
| Waitlist | `/bossdashboard/waitlist` | Lead Pipeline |
| Cancellations | `/bossdashboard/cancellations` | Retention Workflow |
| Book Demo | `/bossdashboard/bookdemo` | Sales Pipeline |
| Plans | `/bossdashboard/plans` | Admin / config |
| Bosses | `/bossdashboard/bosses` | Admin / config |
| Label Products | `/bossdashboard/label-products` | Admin / config |
| Bulk Email | `/bossdashboard/bulk-email` | Admin / config (nav hidden) |

**Recharts:** only on Analytics.

**Removed duplicates:** Main dashboard no longer shows ARR, ARPU, churn, plan/status distribution, top customers, or analytics tabs. Users billing drawer uses lists/tables only (no Recharts).

---

## Global shell

### Sidebar navigation

| Label | Route |
|-------|-------|
| Dashboard | `/bossdashboard` |
| Users | `/bossdashboard/users` |
| Orders | `/bossdashboard/orders` |
| Analytics | `/bossdashboard/analytics` |
| Plans | `/bossdashboard/plans` |
| Bosses | `/bossdashboard/bosses` |
| Devices | `/bossdashboard/devices` |
| Notifications | `/bossdashboard/notifications` |
| Label Products | `/bossdashboard/label-products` |
| Demo Requests | `/bossdashboard/bookdemo` |
| Cancel Requests | `/bossdashboard/cancellations` |
| Reports | `/bossdashboard/reports` |
| Waitlist | `/bossdashboard/waitlist` |

Sidebar footer: **Admin User** / **Super Administrator**

### Header (all pages)

- Default title: **Dashboard**
- Notifications bell dropdown: **Notifications**, **Loading notifications…**, **No unread notifications**, **View all notifications**
- Dark mode toggle (sun/moon)
- User menu: **Logout**

---

## 1. Dashboard — `/bossdashboard`

**Role:** Daily Action Centre  
**Do not show here:** ARR, ARPU, churn, plan/status distribution, top customers, analytics tabs, revenue charts, customer growth charts.

### Page header

| Element | Text |
|---------|------|
| H1 | Daily Action Centre |
| Subtitle | What needs your attention today |
| Button | Full analytics → `/bossdashboard/analytics` |

### Section: Today's snapshot

| KPI title | Value | Subtext / link |
|-----------|-------|----------------|
| Total Users | `total` from analytics API | `{active} active` |
| MRR | `mrr` from analytics API | Link: **Revenue analytics →** → `/bossdashboard/analytics` |
| Prints Today | `/api/logs/summary?date={today}` | Link: **Usage trends →** → `/bossdashboard/analytics#platform-usage` |
| Prints This Week | `/api/logs/summary?date_from/weekTo` (Mon–Sun) | Link: **Usage trends →** → `/bossdashboard/analytics#platform-usage` |
| Pending Devices | count where `status === "pending"` | Link: **Device management →** → `/bossdashboard/devices` |

### Section: Needs attention

Section subtitle: `{N} item(s) may need action` or **Nothing urgent right now**

| Card title | Link label | Destination | Empty state |
|------------|------------|-------------|-------------|
| Failed Payments | All users | `/bossdashboard/users` | No failed payments. |
| Pending Device Shipments | Devices | `/bossdashboard/devices` | No devices awaiting shipment. |
| Devices Return Required | Devices | `/bossdashboard/devices` | No returns required. |
| Cancellation Requests | Cancellations | `/bossdashboard/cancellations` | No recent cancellations. |
| Demo Requests Waiting | All demos | `/bossdashboard/bookdemo` | No pending demo requests. |

### Section: Upcoming renewals

| Element | Text |
|---------|------|
| Section title | Upcoming renewals |
| Subtitle | Next 30 days |
| Empty | No renewals in the next 30 days. |

### Section: Recent signups

| Element | Text |
|---------|------|
| Section title | Recent signups |
| Subtitle | Last 30 days |
| Empty | No recent signups. |

### Section: Recent label orders

| Element | Text |
|---------|------|
| Section title | Recent label orders |
| Empty | No recent label orders. |

### Section: Pending plan changes

| Element | Text |
|---------|------|
| Section title | Pending plan changes |
| Empty | No pending plan changes. |

### Filters

None.

### Error / loading

- Loading: spinner
- Error: message + **Retry** button

---

## 2. Analytics — `/bossdashboard/analytics`

**Role:** Growth & Performance — **only page with Recharts**

### Page header

| Element | Text |
|---------|------|
| H1 | Analytics |

### Section: Executive KPIs

| KPI title | Subtitle | Tooltip | Trend label |
|-----------|----------|---------|-------------|
| MRR | `{ARR} ARR` | Monthly Recurring Revenue from all active subscriptions, normalised to a monthly value. | `±X.X% vs last month` |
| ARR | Based on active subscriptions | Annual Recurring Revenue — projected yearly revenue from current active subscriptions. | — |
| Active Customers | `{total} total accounts` | — | `±X.X% vs last month` |
| Trialing | Currently in free trial | — | — |
| Cancelled | `{cancelledThisMonth} this month` | — | `{N} cancelled this month` (inverted) |
| Churn Rate | `{canceled} cancelled total` | Percentage of all accounts that have cancelled. | — |
| ARPU | Avg. revenue per active user | Average Revenue Per User — MRR divided by active customers. | — |
| New This Month | Customer acquisitions | — | `+N this month` |
| Cancelled This Month | Lost customers | — | — |
| Trial Conversion | `{trialing} still trialing` | Share of trial + paid accounts that converted to paid or have since cancelled. | — |

### Section: Platform Usage

Section link: **Export label orders →** → `/bossdashboard/reports?tab=label_orders`  
Anchor: `#platform-usage`

| KPI title | Subtitle | Tooltip | Trend label |
|-----------|----------|---------|-------------|
| Labels This Month | Across all kitchens | — | `±X.X% vs this time last month` (MTD vs same calendar days prior month) |
| Labels Today | Printed today | — | — |
| Most Active Kitchen | `{N} labels this month` or **No print activity yet** | — | — |
| Avg Labels / Kitchen | Labels per active kitchen this month | — | — |
| Active Kitchens (30d) | `{N} kitchen(s) printed in the last 30 days` or **No print activity in the last 30 days**; optional `{X}% of active customers used printing` | Distinct customers with at least one print_label activity in the last 30 days. | — |

### Section: Revenue Analytics

Section link: **Export revenue report →** → `/bossdashboard/reports?tab=revenue`  
Anchor: `#revenue-analytics`

| Chart title | Description |
|-------------|-------------|
| Revenue Trend | `{growth}% growth vs last month` |
| MRR Trend | Monthly recurring revenue over the last 12 months |
| Revenue by Plan | MRR contribution by subscription plan |
| Revenue by Billing Cycle | MRR split between monthly and annual billing |

### Section: Customer Analytics

| Chart title | Description |
|-------------|-------------|
| Customer Growth | `{growth}% vs last month` |
| Customer Acquisition | New signups per month |
| Active vs Cancelled Trend | Monthly active paying customers vs cancellations |
| Subscription Growth | Net customer additions over time |

**Top Customers card**

- Rows: company name, amount/mo or /yr, total paid
- Link: **All users →** → `/bossdashboard/users`
- Row click → `/bossdashboard/users?q={company}`
- Empty: **No customer data yet.**

### Section: Distribution & Usage

Section link: **Device management →** → `/bossdashboard/devices`

| Chart title | Description / empty |
|-------------|---------------------|
| Plan Distribution | — |
| Status Distribution | — |
| Labels Printed Over Time | Last 30 days of platform print activity |
| Device Activity | Empty: **No devices registered yet.** |
| Device Shipments Over Time | (shown when shipment data exists) |

Chart empty default: **No data available for this period.**

### Filters

None.

### Error / loading

- Skeleton while loading
- Empty: **No analytics data available yet.**
- Error: message + **Check your connection and try refreshing the page.**

---

## 3. Users — `/bossdashboard/users`

**Role:** Customer Investigation  
**Do not show:** global business KPIs, Recharts

### Page header

| Element | Text |
|---------|------|
| H1 | Users Management |
| Subtitle | Manage your users and their subscriptions |

### Filters

| Filter | Options / placeholder |
|--------|----------------------|
| Search | Placeholder: **Search users…** — matches company, email, plan, status |
| Plan | **All Plans** + dynamic plan names |
| Billing | **All Billing**, **Monthly**, **Annual** |
| Status | **All Statuses** + dynamic statuses |
| URL param | `?q=` pre-fills search (from Analytics top-customer links) |

### Table: Users

Columns: **Company**, **Email**, **Plan**, **Billing**, **Status**, **Renewal**, **Trial End**, **Pending Change**, **Actions**

Row actions: **View**, **Extend Trial** (trialing only), **Cancel**, **Billing**, **Prints**

Pagination: **Previous**, page numbers, **Next** — **Showing X to Y of Z results**

### View User modal

Sections: **User Details**, **Subscription**, **Contact & Location**

Fields: Company, Plan, Status, Billing, Renewal Date, Trial End, Pending Change, Created At, Assigned Device, Name, Email, Phone, Country, City, State, Postcode, Address

### Extend Trial modal

Title: **Extend Trial — {company}**  
Fields: Days (number), Reason (optional)  
Buttons: **Close**, **Extend** / **Saving…**

### Cancel Subscription modal

Title: **Cancel Subscription — {company}**  
Type: **Immediate**, **End of billing period**  
Field: Reason (optional)  
Buttons: **Close**, **Confirm** / **Cancelling…**

### Billing drawer

Title: **Payments — {company}**  
Link: **Export invoices →** → `/bossdashboard/reports?tab=invoices`

Content: Total paid, payments-by-month list, invoice history  
Empty: **No paid invoices yet.** / **No billing data available.**  
Loading: **Loading payment history…**

### Prints drawer

Title: **Prints for {company}**  
Range tabs: **Today**, **Yesterday**, **This Week**, **This Month**, **All Time**  
Content: Total Prints, By Label Type, Recent Logs  
Empty: **No data** / **Loading…**

### Loading

**Loading users…**

---

## 4. Reports — `/bossdashboard/reports`

**Role:** Export & Accounting  
**Do not show:** charts

### Page header

| Element | Text |
|---------|------|
| H1 | Reports |

### Global filters

| Filter | Details |
|--------|---------|
| Tabs | Users, Subscriptions, Invoices, Cancellations, Revenue, Devices, Label Orders |
| URL param | `?tab=` (e.g. `revenue`, `label_orders`, `invoices`) |
| Date range | **From** / **To** date inputs (required for most tabs) |
| Export | **Download CSV**, **Download Excel** |
| Pagination | **Prev**, **Next**, **Page X of Y** |

### Tab: Users

**Title:** User Report ({dateFrom} to {dateTo})  
**API filter:** `created_at` between dates  
**Columns:** User ID, Company, Email, Plan, Status, Signup

### Tab: Subscriptions

**Title:** Subscription Report  
**Columns:** User ID, Company, Email, Plan, Status, Billing, Amount, Signup

### Tab: Invoices

**Title:** Invoice Report ({dateFrom} to {dateTo})  
**Columns:** Invoice #, Company, Email, Plan, Description, Amount, Status, Created  
**Empty:** No invoices found for this date range.

### Tab: Cancellations

**Title:** Cancellation Report ({dateFrom} to {dateTo})  
**Columns:** User ID, Subscription ID, Reason, Cancelled At

### Tab: Revenue

**Title:** Revenue Report  
**Note:** Export summary for the selected date range. For charts and trends, see Analytics.

| KPI | Source |
|-----|--------|
| MRR | analytics API |
| ARR | analytics API |
| ARPU | analytics API |
| Churn Rate | analytics API |
| Trial Conversion | analytics API |
| Active Subs | analytics API |
| Canceled Subs | analytics API |
| Total Subs | analytics API |

### Tab: Devices

**Title:** Device Report  
**Extra filters:** Search (**Search by user, plan, device, …**), Status (**All Statuses** + dynamic)  
**Columns:** Device ID, User, Plan, Type, Identifier, Status, Assigned, Shipped, Delivered, Returned, Notes  
**Empty:** No device data.

### Tab: Label Orders

**Title:** Label Order Report  
**Extra filters:** Search (**Search by user, status, …**), Status filter  
**Columns:** Order ID, User, Bundles, Labels, Amount, Status, Shipping Address, Created, Paid, Shipped  
**Empty:** No label order data.

### Empty / loading

- **Select a date range to view reports.**
- **Loading…**

---

## 5. Devices — `/bossdashboard/devices`

**Role:** Hardware Operations

### Page header

| Element | Text |
|---------|------|
| H2 | Device Management |

### KPI cards

| Title | Value |
|-------|-------|
| Total Devices | `stats.total` |
| Pending Shipment | `stats.pending` |
| In Transit | `stats.shipped` |
| Return Required | `stats.return_requested` |

### Filters

| Filter | Options |
|--------|---------|
| Search | **Search by customer name, email, device ID, or device identifier…** |
| Status | **All Statuses**, **Pending**, **Shipped**, **Delivered**, **Return Required**, **Returned**, **Lost** |

### Table: Device Inventory

Columns: **Device ID**, **Device Identifier**, **Customer**, **Plan**, **Status**, **Assigned**, **Actions**

Status badges: PENDING, SHIPPED, DELIVERED, RETURN REQUESTED, RETURNED, LOST

Row actions: **Details**, status change dropdown  
Button: **Export CSV**

### Device Details modal

Section: **Device Timeline**  
Fields: Device ID, Device Type, Device Identifier, Status, Customer Name, Customer Email, Plan, Subscription Status, Assigned At, Shipped At, Delivered At, Return Requested At, Returned At, Created At, Notes  
Edit placeholders: e.g. Mobile Device…, SN123456789…, Add any notes…  
Read-only fallbacks: **Not specified**, **N/A**, **No notes added**  
Buttons: **Edit**, **Cancel**, **Save** / **Saving…**

### Confirm Status Change modal

**Are you sure you want to change the status of device {id} from {CURRENT} to {NEW}?**  
Buttons: **Cancel**, **Confirm** / **Updating…**

### Empty

**No devices found matching your criteria.**

---

## 6. Orders — `/bossdashboard/orders`

**Role:** Label Order Operations

### Page header

| Element | Text |
|---------|------|
| H2 | All Label Orders |

### Filters

| Filter | Options |
|--------|---------|
| Status | **All**, **Pending**, **Paid**, **Shipped** |
| Search | **Search by user, email, or order #** |

### Table: Label Orders

Columns: **Order #**, **Label Ordered**, **User**, **Email**, **Bundles**, **Labels**, **Amount**, **Status**, **Shipping Address**, **Ordered**, **Paid**, **Shipped**, **Action**

Status badges: Shipped, Paid, Pending

Row actions: **Mark as Shipped** (paid only), copy address (**Copy address**)

### Order Details modal

Fields: User, Bundles, Labels, Amount, Status, Shipping Address, Ordered, Paid, Shipped, Label Ordered, Rolls per bundle, Labels per roll, **View in Stripe** link

### Mark as Shipped modal

**Are you sure you want to mark order #{id} as shipped?**  
Buttons: **Yes, Mark as Shipped**, **Cancel**, **Close**

### Empty / fallbacks

**No orders found.** / **N/A** / **-**

---

## 7. Notifications — `/bossdashboard/notifications`

**Role:** Event Inbox

### Page header

| Element | Text |
|---------|------|
| H2 | Admin Notifications |

### KPI cards

| Title | Counts |
|-------|--------|
| Total | all notifications |
| Unread | unread count |
| New Signups | type `new_signup` |
| Upgrades | type `upgrade` |
| Device Events | device_* types |
| Label Orders | label_order_* types |

### Filters

| Filter | Options |
|--------|---------|
| Search | **Search notifications…** |
| Type | All Types, New Signups, Upgrades, Device Shipped/Delivered/Return Requested/Returned, Cancellations, Payment Failed/Recovered, Plan Renewed, Label Order Placed/Paid/Shipped/Delivered/Cancelled |
| Read status | **All**, **Unread**, **Read** |

Button: **Mark All as Read**

### Table: Notifications

Columns: **Type**, **Title**, **Message**, **Date**, **Status**, **Actions**

Row status: **Read** / **Unread**  
Row actions: view, mark read, delete

### Notification Detail modal

Sections (conditional): **Customer Information**, **Order Details**, **Device Information**, **Payment Information**, **Raw Data**  
Button: **Close**

### Empty

**No notifications found matching your criteria.**

---

## 8. Waitlist — `/bossdashboard/waitlist`

**Role:** Lead Pipeline

### Page header

| Element | Text |
|---------|------|
| H1 | Waitlist Management |
| Subtitle | Manage and track waitlist entries |

### KPI cards

| Title | Value |
|-------|-------|
| Total Entries | all |
| Pending | status `pending` |
| Contacted | status `contacted` |
| Converted | status `converted` |

### Filters

| Filter | Options |
|--------|---------|
| Search | **Search by name, email, or company…** |
| Status | **All Status**, **Pending**, **Contacted**, **Converted**, **Rejected** |

Button: **Export CSV**

### Table: Waitlist Entries

Columns: **Name**, **Email**, **Company**, **Phone**, **Status**, **Joined**, **Actions**

Status values: pending, contacted, converted, rejected

### Edit Waitlist Entry modal

Fields: Status, Notes (**Add notes about this entry…**), Contacted Date, Contacted By (**Who contacted this person?**)  
Buttons: **Update Entry**, **Cancel**

### Loading / empty

**Loading waitlist…** / **-**

---

## 9. Cancellations — `/bossdashboard/cancellations`

**Role:** Retention Workflow

### Page header

| Element | Text |
|---------|------|
| H1 | Subscription Cancellations |

### Filters

| Filter | Details |
|--------|---------|
| Search | **Search by user, subscription, reason, or email…** (debounced 400ms) |
| Result count | `{total} result(s)` |
| Pagination | server-side page + pageSize |

### Table: Cancellations

Columns: **User ID**, **Email**, **Company**, **Subscription ID**, **Reason**, **Cancelled At**

### Cancellation Details modal

Fields: Email, Company, Created At, Reason (full text)

### Empty / loading

**Loading…** / **No cancellations found.** / **N/A**

---

## 10. Book Demo — `/bossdashboard/bookdemo`

**Role:** Sales Pipeline

### Page header

| Element | Text |
|---------|------|
| H1 | Book Demo Requests |

### Filters

None.

### Table: Demo Requests

Columns: **Name**, **Email**, **Company**, **Role**, **Source**, **Message**, **Date**, **Attended**, **Actions**

Attended actions: **Mark Attended**, **Reschedule**, **…**  
Row action: **Delete** / **Deleting…**

### Demo Request Details modal

Fields: Name, Email, Company, Role, Source, Message, Date, Attended (Yes/No)

### Mark Attended / Reschedule modal

Title varies: **Mark as Attended & Optionally Send Email** / **Reschedule Demo**  
Fields: Name, Email, Company, Demo Time (datetime-local)  
Checkbox: **Send thank you/demo scheduled email**  
Buttons: **Cancel**, **Confirm** / **Confirm & Send Email** / **Reschedule & Send Email** / **Processing…**

Delete confirm: **Delete this request?**

### Empty / loading

**Loading…** / **No demo requests yet.** / **N/A**

---

## 11. Plans — `/bossdashboard/plans`

**Role:** Admin / config — CRUD only, no business KPIs

### Page header

| Element | Text |
|---------|------|
| H1 | Plans Management |

### Filters

| Filter | Options |
|--------|---------|
| Search | **Search plans…** |
| Status | **All Statuses**, **Active**, **Inactive** |

Button: **+ Add Plan**

### Table: Plans

Columns: **Name**, **Monthly**, **Yearly**, **Tier**, **Stripe Monthly**, **Stripe Yearly**, **Stripe Product**, **Description**, **Features**, **Includes Device**, **Status**, **Actions**

Badges: Active/Inactive, Includes Device Yes/No

### Add/Edit Plan modal

Fields: Name*, Monthly Price (£)*, Yearly Price (£)*, Tier*, Stripe Price IDs, Stripe Product ID, Description, Features (comma separated), Active, Includes Device, Best Seller  
Buttons: **Cancel**, **Add Plan** / **Update Plan**

### Delete Plan modal

**Delete Plan** — **This action cannot be undone.**  
Buttons: **Cancel**, **Delete Plan**

### Empty / loading

**Loading plans…**

---

## 12. Bosses — `/bossdashboard/bosses`

**Role:** Admin / config

### Page header

| Element | Text |
|---------|------|
| H1 | Add Boss |

### Filters

Search: **Search bosses…**

### Table: Bosses

Columns: **ID**, **Username**, **Email**, **Password** (edit mode), **Actions**

Form placeholders: **Username**, **Email**, **Password** — button **Add Boss**  
Row: **Edit**, **Delete**, **Save**, **Cancel**  
Delete confirm: **Are you sure you want to delete this boss?**

---

## 13. Label Products — `/bossdashboard/label-products`

**Role:** Admin / config

### Page header

Card title: **Label Products**

### Table: Label Products

Columns: **Name**, **Price**, **Rolls/Bundle**, **Labels/Roll**, actions

Button: **Add Product**  
Row: **Edit**, **Delete**

### Add/Edit modal

Fields: Name, Price (pence), Rolls per bundle, Labels per roll  
Buttons: **Save Changes** / **Add Product**, **Cancel**

Delete confirm: **Delete this label product?**

### Messages

**Loading…** / **Failed to fetch label products** / **Product updated!** / **Product added!** / **Product deleted!**

---

## 14. Bulk Email — `/bossdashboard/bulk-email`

**Role:** Admin / config (sidebar nav commented out)

### Page header

| Element | Text |
|---------|------|
| H1 | Bulk Email |
| Subtitle | Upload an Excel/CSV, map columns, fill template, preview and send via Zoho. |

### Sections

**1) Upload list** — file input (`.xlsx`, `.xls`, `.csv`), email/name column dropdowns, **Valid recipients: {N}**

**2) Template content** — template select: **Informational (current)**, **Limited-time Offer**, **Coupon + CTA**

Template fields vary: Email Subject, Preview Name, Subheading, offer/coupon fields, feature bullets, CTAs, testimonial, phone mockup URL

**Preview:** Desktop (600px) iframe + **Log**

Buttons: **Send test**, **Send bulk**

Default presets include subject **Label smarter. Waste less. Stay compliant.** and offer code **SAVE20**.

---

## Metric ownership quick reference

| Metric | Primary home | Allowed elsewhere |
|--------|--------------|-------------------|
| MRR / ARR / ARPU / churn / trial conversion | Analytics | Dashboard: MRR snapshot only; Reports: revenue export summary |
| Customer counts / growth charts | Analytics | Dashboard: total users + active subtext |
| Top customers | Analytics | Users: per-user billing only |
| Print usage / trends | Analytics | Dashboard: prints today/week snapshot |
| Per-user billing / invoices / prints | Users | Reports: export tables |
| Device inventory / status | Devices | Dashboard: pending/return queues; Analytics: device charts |
| Label orders | Orders | Dashboard: recent orders; Reports: export |
| Notifications | Notifications | Header bell preview |
| Waitlist | Waitlist | — |
| Cancellations | Cancellations | Dashboard: recent list |
| Demo requests | Book Demo | Dashboard: pending list |
| Plans / bosses / label products | Respective admin pages | — |
