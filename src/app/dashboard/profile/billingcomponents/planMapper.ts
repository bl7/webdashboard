/**
 * Maps subscription plan names to internal plan identifiers
 * @param planName - The plan_name from subscription data
 * @returns Internal plan identifier (free, pro_kitchen, multi_site)
 */
export function mapPlanNameToIdentifier(planName: string): string {
  if (!planName) return "free"

  // Clean the plan name for consistent matching
  const cleaned = planName.toLowerCase().trim()
  console.log("🔍 Mapping plan name:", cleaned)

  // Extract price from plan name for price-based mapping
  const priceMatch = cleaned.match(/\$?(\d+)/)
  if (priceMatch) {
    const price = parseInt(priceMatch[1])
    console.log("💰 Found price in plan name:", price)

    const priceMapping: Record<number, string> = {
      270: "multi_site", // £270/yr = Multi-Site Mastery yearly
      25: "multi_site", // £25/mo = Multi-Site Mastery monthly
      216: "pro_kitchen", // £216/yr = Pro Kitchen yearly
      20: "pro_kitchen", // £20/mo = Pro Kitchen monthly
      0: "free", // Free plan
    }

    if (priceMapping[price]) {
      console.log("✅ Price-based mapping found:", priceMapping[price])
      return priceMapping[price]
    }
  }

  // Text-based mapping for plan names
  const textMapping: Record<string, string> = {
    // Free plan variations
    free: "free",
    "free plan": "free",
    starter: "free",
    "starter kitchen": "free",
    basic: "free",
    "basic plan": "free",

    // Pro Kitchen variations
    pro: "pro_kitchen",
    "pro kitchen": "pro_kitchen",
    "🧑‍🍳 pro kitchen": "pro_kitchen",
    professional: "pro_kitchen",
    "professional kitchen": "pro_kitchen",
    "pro plan": "pro_kitchen",

    // Multi-Site variations
    multi: "multi_site",
    "multi-site": "multi_site",
    "multi site": "multi_site",
    "multi-site mastery": "multi_site",
    multisite: "multi_site",
    enterprise: "multi_site",
    premium: "multi_site",
    "annual plan": "multi_site", // Based on your data showing "Annual Plan ($270)"
    "monthly plan": "multi_site",
  }

  // Check for exact matches first
  if (textMapping[cleaned]) {
    console.log("✅ Direct text mapping found:", textMapping[cleaned])
    return textMapping[cleaned]
  }

  // Check for partial matches
  for (const [key, value] of Object.entries(textMapping)) {
    if (cleaned.includes(key)) {
      console.log("✅ Partial text mapping found:", value, "for key:", key)
      return value
    }
  }

  // Default fallback
  console.log("⚠️ No mapping found, defaulting to free plan")
  return "free"
}

// Usage example with your subscription data:
/*
const subscription = {
  plan_name: "Annual Plan ($270)",
  // ... other subscription data
}

const planIdentifier = mapPlanNameToIdentifier(subscription.plan_name)
console.log(planIdentifier) // Output: "multi_site"
*/
