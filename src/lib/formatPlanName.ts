// utils/formatPlanName.ts
// Plan price ID to user-friendly name mapping
const PLAN_NAME_MAP: Record<string, string> = {
  'price_1RZnHW6acbqNMwXigvqDdo8I': '🧑‍🍳 Pro Kitchen (Monthly)',
  'price_1RZnI76acbqNMwXiW5y61Vfl': '🧑‍🍳 Pro Kitchen (Yearly)',
  'price_1RZnIb6acbqNMwXiSMZnDKvH': 'Multi-Site Mastery (Monthly)',
  'price_1RZnIv6acbqNMwXi4cEZhKU8': 'Multi-Site Mastery (Yearly)',
}

export function getPlanNameFromPriceId(priceId: string | null | undefined): string {
  if (!priceId) return 'Unknown Plan'
  return PLAN_NAME_MAP[priceId] || priceId
}
