const PUBLIC_NODE_ROOTS = new Set([
  "register",
  "login",
  "resend-verification",
  "forgot-password",
  "verify-pin",
  "reset-password",
  "resend-reset-pin",
])

export function browserNodeUrl(url: string, apiBase: string | undefined): string | null {
  if (!apiBase) return null
  const base = apiBase.replace(/\/$/, "")
  if (!url.startsWith(`${base}/`)) return null
  const rest = url.slice(base.length + 1)
  const root = rest.split("?")[0].split("/")[0]
  if (!root || PUBLIC_NODE_ROOTS.has(root)) return null
  return `/api/node/${rest}`
}

export function buildNodeTarget(base: string, parts: string[], search: string): string | null {
  if (!base || parts.length === 0) return null
  if (
    parts.some(
      (part) =>
        !part ||
        part === "." ||
        part === ".." ||
        part.includes("/") ||
        part.includes("\\") ||
        part.includes(":")
    )
  ) {
    return null
  }

  let root: URL
  try {
    root = new URL(base.endsWith("/") ? base : `${base}/`)
  } catch {
    return null
  }

  let target: URL
  try {
    target = new URL(`${parts.map((part) => encodeURIComponent(part)).join("/")}${search || ""}`, root)
  } catch {
    return null
  }

  if (target.origin !== root.origin) return null
  const rootPath = root.pathname.endsWith("/") ? root.pathname : `${root.pathname}/`
  if (!target.pathname.startsWith(rootPath)) return null
  return target.toString()
}
