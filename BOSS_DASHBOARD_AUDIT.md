# InstaLabel Boss Dashboard — Audit (Phase 1)

**Date:** 2026-06-08 · **Scope:** All `/bossdashboard/*` routes

## Summary

| Page | Compliance | Priority |
|------|------------|----------|
| Dashboard | Mostly compliant; needs section grouping + Needs Attention panel | P1 |
| Analytics | Compliant; missing Active Kitchens (30d), drill-down links | P1 |
| Users | Compliant; missing URL search param, assigned device | P2 |
| Reports | Compliant; missing `?tab=` URL support | P2 |
| Devices / Orders / Notifications / Waitlist / Cancellations / Book Demo | Compliant | P3 |
| Plans / Bosses / Label Products / Bulk Email | Compliant (CRUD only) | — |

**Recharts:** Only `/bossdashboard/analytics` (verified).

---

## 1. Dashboard — `/bossdashboard`

| | |
|---|---|
| **Role** | Daily Action Centre |
| **APIs** | `subscription_better/analytics`, `devices`, `label-orders/all`, `bookdemo`, `subscription_better/cancel`, `logs/summary` |

### Current metrics
Total users, MRR snapshot, prints today, prints week, pending devices, devices need action (duplicate count), 8 action list panels.

### Current charts
None ✓

### Belongs here
All current metrics ✓

### Remove / avoid
ARR, ARPU, churn, plan/status distribution, top customers, analytics tab, Recharts — **already removed** ✓

### Gaps (Phase 3)
- [x] Group into: Snapshot → Needs Attention → Renewals → Signups → Label Orders → Plan Changes
- [x] Remove duplicate “Devices Need Action” from snapshot row (keep in Needs Attention)
- [x] Print cards link to Analytics usage section
- [x] Richer list rows (plan, amount where API provides)

### Reusable components
`ActionList` card pattern (inline in page)

---

## 2. Analytics — `/bossdashboard/analytics`

| | |
|---|---|
| **Role** | Growth & Performance (only Recharts page) |
| **APIs** | `subscription_better/analytics`, `devices` |

### Current metrics
10 executive KPIs, 4 platform usage KPIs, 13 charts, top customers list.

### Gaps (Phase 4–5)
- [x] Active Kitchens Last 30 Days + usage % of active subscribers
- [x] Section drill-down links (Revenue → Reports, Devices → Devices page, Top Customers → Users)
- [x] Anchor IDs for dashboard deep links (`#platform-usage`, `#revenue-analytics`)

### Reusable components
`KpiCard`, `ChartCard`, `AnalyticsSkeleton`, `bossAnalytics` lib

---

## 3. Users — `/bossdashboard/users`

| | |
|---|---|
| **Role** | Customer Investigation |
| **APIs** | `subscription_better/users`, `logs/summary/user/[id]`, `subscription_better/invoices`, `devices` |

### Current
Per-user table, view modal (plan/billing/renewal/trial/pending change), billing drawer (list), prints drawer.

### Gaps
- [x] `?q=` URL search from Analytics top customers
- [x] Assigned device in view modal
- [x] Billing → Reports export link
- [x] Remove `console.log` on fetch

### Remove
No global MRR/ARR/churn — **none present** ✓

---

## 4. Reports — `/bossdashboard/reports`

| | |
|---|---|
| **Role** | Export & Accounting |
| **APIs** | Multiple `subscription_better/*`, `devices`, `label-orders/all` |

### Current
7 tabs, date filters, revenue summary cards (no charts), export CSV/Excel.

### Gaps
- [x] `?tab=revenue` (and other tabs) from URL

### Remove
Full analytics charts — **none present** ✓

---

## 5–14. Other pages

**Devices, Orders, Notifications, Waitlist, Cancellations, Book Demo** — metrics match ownership; no cross-page revenue duplication found.

**Plans, Bosses, Label Products, Bulk Email** — CRUD/admin only; no business KPI cards.

---

## Implementation priority

1. **P1** — Dashboard section layout, Analytics Active Kitchens + links, API metric
2. **P2** — Users `?q=`, device in modal, Reports `?tab=`
3. **P3** — Doc sync, minor polish
