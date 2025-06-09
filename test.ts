import "dotenv/config"

import pool from "./src/lib/pg"

async function testDB() {
  try {
    await pool.query(`INSERT INTO activity_logs (user_id, action, details) VALUES ($1, $2, $3)`, [
      1,
      "Test from test.ts",
      { note: "Testing DB connection" },
    ])
    console.log("✅ Dummy log inserted successfully!")
  } catch (error) {
    console.error("❌ Error inserting log:", error)
  } finally {
    await pool.end()
  }
}

testDB()
