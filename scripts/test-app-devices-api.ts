import "dotenv/config"
import pool from "../src/lib/pg"
import { createToken } from "../src/lib/auth"

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000"

async function main() {
  const userRes = await pool.query(
    `SELECT user_id, company_name, email FROM user_profiles ORDER BY created_at DESC NULLS LAST LIMIT 1`
  )
  if (!userRes.rows.length) {
    throw new Error("No users in user_profiles — cannot test heartbeat")
  }

  const user = userRes.rows[0]
  const userToken = await createToken({ uuid: user.user_id, email: user.email })
  const bossToken = await createToken({
    id: 1,
    role: "boss",
    email: "boss-test@instalabel.co",
    username: "boss-test",
  })

  const sampleDevices = [
    {
      deviceId: "samplehashgalaxytaba8abc12345",
      deviceModel: "Galaxy Tab A8",
      appVersion: "1.0.0-test",
    },
    {
      deviceId: "samplehashpixeltabletdef67890",
      deviceModel: "Pixel Tablet",
      appVersion: "1.0.0-test",
    },
  ]

  console.log("\n=== App devices API test ===")
  console.log(`User: ${user.company_name || user.email} (${user.user_id})`)
  console.log(`Base URL: ${BASE_URL}\n`)

  for (const device of sampleDevices) {
    const res = await fetch(`${BASE_URL}/api/app-devices/heartbeat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        deviceId: device.deviceId,
        platform: "mobile",
        deviceModel: device.deviceModel,
        appVersion: device.appVersion,
      }),
    })
    const body = await res.json()
    console.log(`POST heartbeat (${device.deviceModel}): ${res.status}`)
    console.log(JSON.stringify(body, null, 2))
    if (!res.ok) throw new Error(`Heartbeat failed for ${device.deviceModel}`)
  }

  const repeatRes = await fetch(`${BASE_URL}/api/app-devices/heartbeat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${userToken}`,
    },
    body: JSON.stringify({
      deviceId: sampleDevices[0].deviceId,
      platform: "mobile",
      deviceModel: "Galaxy Tab A8",
      appVersion: "1.0.1-test",
    }),
  })
  const repeatBody = await repeatRes.json()
  console.log(`\nPOST heartbeat repeat (same deviceId): ${repeatRes.status}`)
  console.log(JSON.stringify(repeatBody, null, 2))

  const summaryRes = await fetch(
    `${BASE_URL}/api/app-devices/summary/user/${user.user_id}`,
    {
      headers: { Authorization: `Bearer ${bossToken}` },
    }
  )
  const summaryBody = await summaryRes.json()
  console.log(`\nGET boss summary: ${summaryRes.status}`)
  console.log(JSON.stringify(summaryBody, null, 2))

  if (!summaryRes.ok) throw new Error("Boss summary failed")

  const countRes = await pool.query(
    `SELECT COUNT(*)::int AS count FROM user_app_devices WHERE user_id::text = $1`,
    [String(user.user_id)]
  )
  console.log(`\nDB row count for user: ${countRes.rows[0].count} (expected 2)`)

  if (Number(summaryBody.activeLast30Days) < 2) {
    throw new Error("Expected at least 2 devices in summary")
  }

  console.log("\n✅ API test passed\n")
}

main()
  .catch((err) => {
    console.error("\n❌ API test failed:", err.message || err)
    process.exit(1)
  })
  .finally(async () => {
    await pool.end()
  })
