# InstaLabel Boss Dashboard — Page Ownership (One Page)

**Rule:** Each metric has one primary home. Other pages show previews + links only.

| Page | Role | Primary metrics |
|------|------|-----------------|
| **Dashboard** `/bossdashboard` | Daily Action Centre | Total users, MRR snapshot, prints today/week, pending devices, action queues (failed payments, signups, renewals, plan changes, label orders, demos, cancellations, devices) |
| **Analytics** `/bossdashboard/analytics` | Growth & Performance | MRR, ARR, ARPU, churn, trial conversion, customer counts, all revenue/customer/usage **charts** (Recharts only here), top customers |
| **Users** `/bossdashboard/users` | Customer investigation | Per-user plan, billing, payments, invoices, prints, device |
| **Reports** `/bossdashboard/reports` | Export & accounting | Date-filtered tables + revenue export summary (no charts) |
| **Devices** | Hardware ops | Device counts + inventory table |
| **Orders** | Label order ops | Orders table |
| **Notifications** | Event inbox | Notification counts + inbox |
| **Waitlist** | Lead pipeline | Waitlist KPIs + table |
| **Cancellations** | Retention workflow | Cancellation table |
| **Book Demo** | Sales pipeline | Demo request table |
| **Plans / Bosses / Label Products / Bulk Email** | Admin/config tools | CRUD only — no business KPIs |

**Removed duplicates:** Main dashboard no longer shows ARR, ARPU, churn, plan/status distribution, top customers, or analytics tab. Users billing drawer uses lists (no Recharts).

*Print: Cmd/Ctrl+P*
