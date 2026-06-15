const BROWSER_ID_KEY = "instalabel_browser_id"

function randomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, "")
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 18)}`
}

/** Stable per-browser profile id — survives logout, not cleared on session end. */
export function getWebBrowserDeviceId(): string {
  if (typeof window === "undefined") return ""

  const existing = localStorage.getItem(BROWSER_ID_KEY)
  if (existing && /^[a-zA-Z0-9_-]{16,128}$/.test(existing)) {
    return existing
  }

  const id = randomId()
  localStorage.setItem(BROWSER_ID_KEY, id)
  return id
}

export function getWebBrowserLabel(): string {
  if (typeof navigator === "undefined") return "Web browser"

  const ua = navigator.userAgent
  let browser = "Web browser"
  if (ua.includes("Edg/")) browser = "Edge"
  else if (ua.includes("Chrome/")) browser = "Chrome"
  else if (ua.includes("Firefox/")) browser = "Firefox"
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari"

  const platform = navigator.platform || "Unknown OS"
  return `${browser} (${platform})`
}

export { BROWSER_ID_KEY }
