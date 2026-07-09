import pool from "@/lib/pg"

export const DEFAULT_UPDATE_URL =
  "https://play.google.com/store/apps/details?id=com.instalabel.co.app"

export const DEFAULT_MESSAGE =
  "A new version of InstaLabel is available. Please update to continue."

export interface AppVersionConfig {
  platform: string
  minSupportedVersionCode: number
  minSupportedVersion: string | null
  latestVersionCode: number | null
  latestVersion: string | null
  updateUrl: string | null
  message: string | null
  updatedAt: string | null
}

function rowToConfig(row: Record<string, unknown>): AppVersionConfig {
  return {
    platform: String(row.platform),
    minSupportedVersionCode: Number(row.min_supported_version_code),
    minSupportedVersion: (row.min_supported_version as string) ?? null,
    latestVersionCode:
      row.latest_version_code != null ? Number(row.latest_version_code) : null,
    latestVersion: (row.latest_version as string) ?? null,
    updateUrl: (row.update_url as string) ?? null,
    message: (row.message as string) ?? null,
    updatedAt: row.updated_at ? String(row.updated_at) : null,
  }
}

export function toPublicResponse(config: AppVersionConfig): Record<string, string | number> {
  const response: Record<string, string | number> = {
    minSupportedVersionCode: config.minSupportedVersionCode,
  }

  if (config.minSupportedVersion) response.minSupportedVersion = config.minSupportedVersion
  if (config.latestVersionCode != null) response.latestVersionCode = config.latestVersionCode
  if (config.latestVersion) response.latestVersion = config.latestVersion
  if (config.updateUrl) response.updateUrl = config.updateUrl
  if (config.message) response.message = config.message

  return response
}

export async function getAppVersionConfig(platform: string): Promise<AppVersionConfig | null> {
  const result = await pool.query(
    `SELECT platform, min_supported_version_code, min_supported_version,
            latest_version_code, latest_version, update_url, message, updated_at
     FROM app_version_config
     WHERE platform = $1`,
    [platform]
  )

  if (result.rows.length === 0) return null
  return rowToConfig(result.rows[0])
}

export async function ensureMobileAppVersionConfig(): Promise<AppVersionConfig> {
  const existing = await getAppVersionConfig("mobile")
  if (existing) return existing

  const result = await pool.query(
    `INSERT INTO app_version_config (
       platform, min_supported_version_code, min_supported_version,
       latest_version_code, latest_version, update_url, message
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (platform) DO UPDATE SET platform = EXCLUDED.platform
     RETURNING platform, min_supported_version_code, min_supported_version,
               latest_version_code, latest_version, update_url, message, updated_at`,
    ["mobile", 8, "6.1.0", 8, "6.1.0", DEFAULT_UPDATE_URL, DEFAULT_MESSAGE]
  )

  return rowToConfig(result.rows[0])
}

export async function updateAppVersionConfig(
  platform: string,
  data: {
    minSupportedVersionCode: number
    minSupportedVersion?: string | null
    latestVersionCode?: number | null
    latestVersion?: string | null
    updateUrl?: string | null
    message?: string | null
  }
): Promise<AppVersionConfig> {
  const result = await pool.query(
    `INSERT INTO app_version_config (
       platform, min_supported_version_code, min_supported_version,
       latest_version_code, latest_version, update_url, message, updated_at
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
     ON CONFLICT (platform) DO UPDATE SET
       min_supported_version_code = EXCLUDED.min_supported_version_code,
       min_supported_version = EXCLUDED.min_supported_version,
       latest_version_code = EXCLUDED.latest_version_code,
       latest_version = EXCLUDED.latest_version,
       update_url = EXCLUDED.update_url,
       message = EXCLUDED.message,
       updated_at = NOW()
     RETURNING platform, min_supported_version_code, min_supported_version,
               latest_version_code, latest_version, update_url, message, updated_at`,
    [
      platform,
      data.minSupportedVersionCode,
      data.minSupportedVersion ?? null,
      data.latestVersionCode ?? null,
      data.latestVersion ?? null,
      data.updateUrl ?? DEFAULT_UPDATE_URL,
      data.message ?? DEFAULT_MESSAGE,
    ]
  )

  return rowToConfig(result.rows[0])
}
