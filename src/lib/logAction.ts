export type PrintPlatform = "web" | "mobile"
export type PrintPlatformBucket = PrintPlatform | "unknown"

export function normalizePrintPlatform(value: unknown): PrintPlatformBucket {
  if (value === "web" || value === "mobile") return value
  return "unknown"
}

export function formatPrintPlatform(value: unknown): string {
  const platform = normalizePrintPlatform(value)
  if (platform === "web") return "Web"
  if (platform === "mobile") return "Mobile"
  return "Unknown"
}

export async function logAction(action: string, details: any = {}) {
  const payload =
    action === "print_label"
      ? { ...details, platform: (details?.platform as PrintPlatform) || "web" }
      : details

  console.log("logAction triggered:", action, payload)

  let token: string | null = null

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token")
  } else {
    // For server-side logging, we might need a different approach
    console.warn("logAction on server side - token not available")
    return
  }

  if (!token) {
    console.warn("logAction skipped: token missing")
    return
  }

  try {
    console.log("Sending log to /api/logs", {
      action,
      details: payload,
    })

    const res = await fetch(
      typeof window === "undefined"
        ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/logs`
        : "/api/logs",
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          details: payload,
        }),
      }
    )

    const text = await res.text()
    console.log("logAction response:", res.status, text)

    if (!res.ok) {
      console.error("logAction failed:", res.status, text)
    }
  } catch (err) {
    console.error("Failed to log action:", err)
  }
}
