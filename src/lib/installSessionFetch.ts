import { browserNodeUrl } from "@/lib/nodeProxy"

function isAppApi(url: string): boolean {
  if (url.startsWith("/api/")) return true
  if (typeof window !== "undefined" && url.startsWith(`${window.location.origin}/api/`)) return true
  return false
}

export function installSessionFetch() {
  if (typeof window === "undefined") return
  const host = window as Window & { __instalabelSessionFetch?: boolean }
  if (host.__instalabelSessionFetch) return
  host.__instalabelSessionFetch = true

  try {
    localStorage.removeItem("token")
    localStorage.removeItem("bossToken")
  } catch {
    // Storage can be blocked. The cookie is still the session.
  }

  const original = window.fetch.bind(window)
  const apiBase = process.env.NEXT_PUBLIC_API_URL

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" || input instanceof URL ? String(input) : input.url
    if (typeof input !== "string" && !(input instanceof URL)) {
      return original(input, init)
    }

    const proxied = browserNodeUrl(url, apiBase)
    const sameOriginApi = isAppApi(url)
    if (!proxied && !sameOriginApi) return original(input, init)

    const headers = new Headers(init?.headers)
    headers.delete("Authorization")
    if (sameOriginApi && window.location.pathname.startsWith("/boss")) {
      headers.set("X-Session-Role", "boss")
    }
    return original(proxied || url, {
      ...init,
      headers,
      credentials: "include",
    })
  }
}

installSessionFetch()
