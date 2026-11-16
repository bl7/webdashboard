import { BROWSER_ID_KEY } from "@/lib/webBrowserId"

export function clearAuthSession() {
  if (typeof window === "undefined") return

  const browserId = localStorage.getItem(BROWSER_ID_KEY)
  localStorage.clear()
  if (browserId) localStorage.setItem(BROWSER_ID_KEY, browserId)

  const expired = "expires=Thu, 01 Jan 1970 00:00:00 GMT"
  document.cookie = `token=; path=/; ${expired}; SameSite=Lax`
  if (window.location.protocol === "https:") {
    document.cookie = `token=; path=/; ${expired}; SameSite=Lax; Secure`
  }
}

export function logoutToLogin() {
  void fetch("/api/session/logout", { method: "POST", credentials: "include", keepalive: true })
  clearAuthSession()
  window.location.replace("/login")
}

export function logoutBoss() {
  void fetch("/api/session/boss-logout", { method: "POST", credentials: "include", keepalive: true })
  try {
    localStorage.removeItem("bossAuthed")
    localStorage.removeItem("bossToken")
  } catch {
    // The HttpOnly cookie is cleared by the request above.
  }
}
