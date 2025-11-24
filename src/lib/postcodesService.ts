/**
 * Postcodes.io service layer
 * Provides autocomplete and lookup functionality for UK postcodes
 * Can be swapped with other providers without touching UI
 */

interface PostcodeSuggestion {
  postcode: string // Formatted for display
  originalPostcode: string // Original from API for lookup
}

interface PostcodeLookupResult {
  postcode: string
  country: string
  admin_district?: string
  admin_county?: string
  region?: string
  parish?: string
}

interface CachedLookup {
  result: PostcodeLookupResult
  timestamp: number
}

// In-memory cache with 24-hour TTL
const lookupCache = new Map<string, CachedLookup>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Normalize postcode: strip spaces and uppercase
 */
function normalizePostcode(postcode: string): string {
  return postcode.replace(/\s+/g, "").toUpperCase()
}

/**
 * Format postcode with standard UK spacing (e.g., "SW1A 1AA")
 * UK postcodes typically have a space before the last 3 characters
 */
function formatPostcode(postcode: string): string {
  // If already has a space in the right place, return as is
  const trimmed = postcode.trim()
  if (/^[A-Z]{1,2}\d{1,2}\s\d[A-Z]{2}$/i.test(trimmed)) {
    return trimmed.toUpperCase()
  }
  
  const normalized = normalizePostcode(postcode)
  // UK postcode format: space before last 3 chars (outward + inward)
  // Pattern: 1-2 letters, 1-2 digits, space, 1 digit, 2 letters
  if (normalized.length >= 5 && normalized.length <= 7) {
    // Most UK postcodes: space before last 3 characters
    const lastThree = normalized.slice(-3)
    const firstPart = normalized.slice(0, -3)
    return `${firstPart} ${lastThree}`.toUpperCase()
  }
  return normalized
}

/**
 * Get cached lookup result if still valid
 */
function getCachedLookup(postcode: string): PostcodeLookupResult | null {
  const normalized = normalizePostcode(postcode)
  const cached = lookupCache.get(normalized)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.result
  }
  if (cached) {
    lookupCache.delete(normalized)
  }
  return null
}

/**
 * Cache lookup result
 */
function cacheLookup(postcode: string, result: PostcodeLookupResult): void {
  const normalized = normalizePostcode(postcode)
  lookupCache.set(normalized, {
    result,
    timestamp: Date.now(),
  })
}

/**
 * Search for postcode suggestions (autocomplete)
 * GET https://api.postcodes.io/postcodes?query={partial}
 */
export async function searchPostcodes(
  query: string
): Promise<PostcodeSuggestion[]> {
  if (!query || query.length < 2) {
    return []
  }

  const normalized = normalizePostcode(query)

  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes?query=${encodeURIComponent(normalized)}`
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    if (data.status === 200 && data.result) {
      // Return top 10 suggestions
      // Store both formatted (for display) and original (for lookup)
      return data.result
        .slice(0, 10)
        .map((item: { postcode: string }) => ({
          postcode: formatPostcode(item.postcode),
          originalPostcode: item.postcode, // Keep original for reliable lookup
        }))
    }

    return []
  } catch (error) {
    console.error("Error searching postcodes:", error)
    return []
  }
}

/**
 * Lookup full postcode details
 * GET https://api.postcodes.io/postcodes/{postcode}
 */
export async function lookupPostcode(
  postcode: string
): Promise<PostcodeLookupResult | null> {
  if (!postcode) {
    return null
  }

  const normalized = normalizePostcode(postcode)

  // Check cache first
  const cached = getCachedLookup(normalized)
  if (cached) {
    return cached
  }

  try {
    const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(normalized)}`
    const response = await fetch(url)

    const data = await response.json()
    
    // Check if the API returned an error status
    if (data.status !== 200) {
      console.warn("Postcodes.io API returned non-200 status:", data.status, "Error:", data.error || "Unknown error")
      return null
    }

    // Check if result exists
    if (!data.result) {
      console.warn("Postcodes.io API returned 200 but no result for postcode:", normalized)
      return null
    }

    const result: PostcodeLookupResult = {
      postcode: formatPostcode(data.result.postcode),
      country: data.result.country || "",
      admin_district: data.result.admin_district,
      admin_county: data.result.admin_county,
      region: data.result.region,
      parish: data.result.parish,
    }

    // Cache the result
    cacheLookup(normalized, result)

    return result
  } catch (error) {
    console.error("Error looking up postcode:", error, "Postcode:", normalized)
    return null
  }
}

/**
 * Format postcode for display
 */
export function formatPostcodeForDisplay(postcode: string): string {
  return formatPostcode(postcode)
}

