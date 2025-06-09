export async function logAction(action: string, details: any = {}) {
  console.log("logAction triggered:", action, details)

  let userId: string | null = null

  if (typeof window !== "undefined") {
    userId = localStorage.getItem("userid")
  } else {
    userId = "system" // or null if you want to skip logging on server
  }

  if (!userId) {
    console.warn("logAction skipped: userid missing")
    return
  }

  // No parsing to int, just use userId string
  try {
    console.log("Sending log to /api/logs", {
      user_id: userId,
      action,
      details,
    })

    const res = await fetch(
      typeof window === "undefined"
        ? `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/logs`
        : "/api/logs",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          action,
          details,
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
