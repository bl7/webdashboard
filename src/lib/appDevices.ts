export const APP_DEVICE_ACTIVE_WINDOW_MINUTES = 30
export const APP_DEVICE_RECENT_WINDOW_DAYS = 30

export interface AppDeviceSummaryCounts {
  activeNow: number
  activeLast30Days: number
  totalRegistered: number
}

export interface AppDeviceRow {
  id: number
  deviceId: string
  platform: string
  deviceModel: string | null
  appVersion: string | null
  firstSeenAt: string
  lastSeenAt: string
  isActiveNow: boolean
}
