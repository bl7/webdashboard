import { Pool } from "pg"

// Certificate verification stays off until PGSSL_CA is confirmed for this host.
// The pool does not read PGSSLMODE. Do not set rejectUnauthorized: true until
// production and local connectivity have been tested with the provider CA.
// Production may disable verification only while that follow-up is outstanding.
if (process.env.NODE_ENV === "production") {
  console.warn(
    "[pg] TLS certificate verification is disabled. Configure PGSSL_CA and enable verification after a connectivity test."
  )
}

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
})

export default pool // ✅ ESM-compatible
