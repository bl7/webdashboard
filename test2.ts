import "dotenv/config"
import pool from "./src/lib/pg"

async function testRetrieveLogs() {
  const userId = 1 // Change this to the user_id you want to test

  try {
    const result = await pool.query(
      `SELECT id, user_id, action, details, timestamp
       FROM activity_logs
       WHERE user_id = $1
       ORDER BY timestamp DESC`,
      [userId]
    )

    console.log(`✅ Retrieved logs for user_id=${userId}:`)
    console.log(result.rows)
  } catch (error) {
    console.error("❌ Error retrieving logs:", error)
  } finally {
    await pool.end()
  }
}

testRetrieveLogs()
