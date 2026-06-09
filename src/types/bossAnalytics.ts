export interface SubscriptionRow {
  user_id: string
  company_name?: string
  stripe_customer_id?: string | null
  totalPaid?: number
  plan_id?: string
  plan_name?: string
  status: string
  billing_interval?: string
  amount?: number
  current_period_end?: string
  trial_end?: string
  pending_plan_change?: string | null
  pending_plan_change_effective?: string | null
  created_at?: string
  updated_at?: string
  cancel_at?: string | null
}

export interface CancellationRow {
  user_id: string
  cancelled_at: string
}

export interface ChartPoint {
  name: string
  value: number
}

export interface TrendPoint {
  month: string
  label: string
  mrr: number
  revenue: number
  newCustomers: number
  cancelled: number
  active: number
  totalCustomers: number
}

export interface RevenueByPlan {
  name: string
  revenue: number
  count: number
}

export interface RevenueByBillingCycle {
  name: string
  revenue: number
  count: number
}

export interface PrintsTrendPoint {
  date: string
  label: string
  prints: number
}

export interface OperationalMetrics {
  labelsPrintedToday: number
  labelsPrintedThisMonth: number
  labelsPrintedLastMonthToDate: number
  mostActiveKitchen: string | null
  mostActiveKitchenPrints: number
  avgLabelsPerCustomer: number
  activeKitchensLast30Days: number
  activeKitchensUsagePercent: number
  printsTrend: PrintsTrendPoint[]
}

export interface BossAnalyticsData {
  total: number
  active: number
  trialing: number
  monthlyActive: number
  annualActive: number
  canceled: number
  mrr: number
  arr: number
  arpu: number
  churnRate: number
  trialConversion: number
  newCustomersThisMonth: number
  cancelledThisMonth: number
  revenueGrowthPercent: number
  customerGrowthPercent: number
  planDistribution: ChartPoint[]
  statusDistribution: ChartPoint[]
  revenueByPlan: RevenueByPlan[]
  revenueByBillingCycle: RevenueByBillingCycle[]
  revenueTrend: TrendPoint[]
  customerGrowth: TrendPoint[]
  activeVsCancelled: TrendPoint[]
  subscriptionGrowth: TrendPoint[]
  recentSignups: SubscriptionRow[]
  topCustomers: SubscriptionRow[]
  upcomingRenewals: SubscriptionRow[]
  pendingChanges: SubscriptionRow[]
  failedPayments: SubscriptionRow[]
  operational: OperationalMetrics
}

export type TrendDirection = "up" | "down" | "neutral"

export interface KpiTrend {
  direction: TrendDirection
  label: string
}
