import { getWebBrowserDeviceId, getWebBrowserLabel } from "@/lib/webBrowserId"

const HEARTBEAT_INTERVAL_MS = 15 * 60 * 1000

let intervalId: ReturnType<typeof setInterval> | null = null
let visibilityHandler: (() => void) | null = null

async function sendWebHeartbeat() {
  const deviceId = getWebBrowserDeviceId()
  if (!deviceId) return

  try {
    await fetch("/api/app-devices/heartbeat", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
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

export function startWebHeartbeat() {
  stopWebHeartbeat()
  void sendWebHeartbeat()

  intervalId = setInterval(() => {
    if (!localStorage.getItem("userid")) {
      stopWebHeartbeat()
      return
    }
    void sendWebHeartbeat()
  }, HEARTBEAT_INTERVAL_MS)

  visibilityHandler = () => {
    if (document.visibilityState !== "visible") return
    if (localStorage.getItem("userid")) void sendWebHeartbeat()
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
