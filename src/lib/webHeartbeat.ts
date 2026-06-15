import { getWebBrowserDeviceId, getWebBrowserLabel } from "@/lib/webBrowserId"

const HEARTBEAT_INTERVAL_MS = 15 * 60 * 1000

let intervalId: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null

async function sendWebHeartbeat(token: string) {
  const deviceId = getWebBrowserDeviceId()
  if (!deviceId) return

  try {
    await fetch("/api/app-devices/heartbeat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        deviceId,
        platform: "web",
        deviceModel: getWebBrowserLabel(),
        appVersion: "web-dashboard",
      }),
    })
  } catch {
    // Non-blocking — heartbeat failures should not affect the dashboard
  }
}

export function startWebHeartbeat(token: string) {
  stopWebHeartbeat()
  void sendWebHeartbeat(token)

  intervalId = setInterval(() => {
    const currentToken = localStorage.getItem("token")
    if (!currentToken) {
      stopWebHeartbeat()
      return
    }
    void sendWebHeartbeat(currentToken)
  }, HEARTBEAT_INTERVAL_MS)

  visibilityHandler = () => {
    if (document.visibilityState !== "visible") return
    const currentToken = localStorage.getItem("token")
    if (currentToken) void sendWebHeartbeat(currentToken)
  }
  document.addEventListener("visibilitychange", visibilityHandler)
}

export function stopWebHeartbeat() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  if (visibilityHandler) {
    document.removeEventListener("visibilitychange", visibilityHandler)
    visibilityHandler = null
  }
}
