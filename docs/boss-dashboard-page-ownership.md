# InstaLabel Boss Dashboard — Page Ownership

Rule:
Each metric has one primary home. Other pages may only show small previews with links to the primary page.

Page ownership:

1. Dashboard `/bossdashboard`
   Role: Daily Action Centre

Primary metrics:

* Total users
* MRR snapshot
* Prints today
* Prints this week
* Pending devices
* Action queues:

  * Failed payments
  * Recent signups
  * Upcoming renewals
  * Pending plan changes
  * Recent label orders
  * Demo requests waiting
  * Cancellation requests waiting
  * Devices requiring action

Do not show:

* ARR
* ARPU
* Churn
* Plan distribution
* Status distribution
* Top customers
* Analytics tabs
* Revenue charts
* Customer growth charts

2. Analytics `/bossdashboard/analytics`
   Role: Growth & Performance

Primary metrics:

* MRR
* ARR
* ARPU
* Churn
* Trial conversion
* Customer counts
* All revenue charts
* All customer charts
* All usage charts
* Plan distribution
* Status distribution
* Top customers

Only this page should use Recharts.

3. Users `/bossdashboard/users`
   Role: Customer Investigation

Primary metrics:

* Per-user plan
* Per-user billing
* Per-user payments
* Per-user invoices
* Per-user prints
* Per-user device

No global business KPIs.
No Recharts.

4. Reports `/bossdashboard/reports`
   Role: Export & Accounting

Primary content:

* Date-filtered tables
* Revenue export summary
* Exportable users
* Exportable subscriptions
* Exportable invoices
* Exportable cancellations
* Exportable devices
* Exportable label orders

No charts.

5. Devices `/bossdashboard/devices`
   Role: Hardware Operations

Primary content:

* Device counts
* Device inventory table
* Device status
* Assigned customer
* Shipment/return status

No business KPIs.

6. Orders `/bossdashboard/orders`
   Role: Label Order Operations

Primary content:

* Orders table only

7. Notifications `/bossdashboard/notifications`
   Role: Event Inbox

Primary content:

* Notification counts
* Notification inbox

8. Waitlist `/bossdashboard/waitlist`
   Role: Lead Pipeline

Primary content:

* Waitlist KPIs
* Waitlist table

9. Cancellations `/bossdashboard/cancellations`
   Role: Retention Workflow

Primary content:

* Cancellation table

10. Book Demo `/bossdashboard/bookdemo`
    Role: Sales Pipeline

Primary content:

* Demo request table

11. Plans / Bosses / Label Products / Bulk Email
    Role: Admin/config tools

Primary content:

* CRUD only
* No business KPI cards

Removed duplicates:

* Main dashboard no longer shows ARR, ARPU, churn, plan/status distribution, top customers, or analytics tabs.
* Users billing drawer uses lists/tables only, no Recharts.
