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
  clearAuthSession()
  window.location.replace("/login")
}
