// utils/formatPlanName.ts
const PLAN_NAME_MAP: { [key: string]: string } = {
  price_123: "Free Plan",
  price_456: "Pro Plan",
  price_789: "Multi-Site Mastery",
}

export function formatPlanName(priceId: string | null | undefined): string {
  if (!priceId) return "Unknown Plan"
  return PLAN_NAME_MAP[priceId] || "Custom Plan"
}
