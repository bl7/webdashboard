export function clearAuthSession() {
  if (typeof window === "undefined") return

  localStorage.clear()

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
