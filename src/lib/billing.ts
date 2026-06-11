export type BillingCycle = "monthly" | "yearly"

/** Normalize Stripe/DB billing interval values to monthly | yearly */
export function normalizeBillingInterval(interval?: string | null): BillingCycle {
  if (!interval) return "monthly"
  const v = interval.toLowerCase()
  if (v === "year" || v === "yearly" || v === "annual") return "yearly"
  return "monthly"
}

export function isMonthlyBilling(interval?: string | null): boolean {
  return normalizeBillingInterval(interval) === "monthly"
}

export function formatMoney(cents?: number | null, currency = "gbp"): string {
  const amount = (cents ?? 0) / 100
  const code = (currency || "gbp").toLowerCase()
  if (code === "gbp") return `£${amount.toFixed(2)}`
  if (code === "usd") return `$${amount.toFixed(2)}`
  return `${code.toUpperCase()} ${amount.toFixed(2)}`
}

export function billingCycleLabel(cycle: BillingCycle): string {
  return cycle === "monthly" ? "Monthly" : "Annual"
}

export function formatInvoiceStatus(status?: string): string {
  if (!status) return "Unknown"
  const map: Record<string, string> = {
    paid: "Paid",
    open: "Open",
    draft: "Draft",
    void: "Void",
    uncollectible: "Uncollectible",
  }
  return map[status] ?? status.charAt(0).toUpperCase() + status.slice(1)
}
