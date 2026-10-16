import pool from "@/lib/pg"

export type FlyerLocation = {
  id: string
  name: string
  createdAt: string
  visits: number
  people: number
}

async function ensureFlyerTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flyer_locations (
      id text PRIMARY KEY,
      name text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS flyer_visits (
      id bigserial PRIMARY KEY,
      location_id text NOT NULL REFERENCES flyer_locations(id),
      visitor_id text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW()
    )
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS flyer_visits_location_id_idx ON flyer_visits (location_id)
  `)
}

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
}

export function flyerPath(id: string) {
  return `/go/${id}`
}

export async function listFlyerLocations(): Promise<FlyerLocation[]> {
  await ensureFlyerTables()
  const result = await pool.query(`
    SELECT
      l.id,
      l.name,
      l.created_at,
      COUNT(v.id)::int AS visits,
      COUNT(DISTINCT v.visitor_id)::int AS people
    FROM flyer_locations l
    LEFT JOIN flyer_visits v ON v.location_id = l.id
    GROUP BY l.id
    ORDER BY l.created_at DESC
  `)
  return result.rows.map((row: { id: string; name: string; created_at: string; visits: number; people: number }) => ({
    id: row.id,
    name: row.name,
    createdAt: String(row.created_at),
    visits: row.visits,
    people: row.people,
  }))
}

export async function createFlyerLocation(name: string): Promise<FlyerLocation> {
  const clean = name.trim()
  if (!clean || clean.length > 80) {
    throw new Error("Enter a location name.")
  }
  const base = slugify(clean)
  if (!base) throw new Error("Use a name with letters or numbers.")

  await ensureFlyerTables()
  let id = base
  for (let n = 2; n < 100; n++) {
    const existing = await pool.query(`SELECT 1 FROM flyer_locations WHERE id = $1`, [id])
    if (existing.rows.length === 0) break
    id = `${base.slice(0, 36)}-${n}`
  }

  const result = await pool.query(
    `INSERT INTO flyer_locations (id, name) VALUES ($1, $2) RETURNING id, name, created_at`,
    [id, clean]
  )
  const row = result.rows[0] as { id: string; name: string; created_at: string }
  return {
    id: row.id,
    name: row.name,
    createdAt: String(row.created_at),
    visits: 0,
    people: 0,
  }
}

export async function flyerLocationExists(id: string) {
  if (!/^[a-z0-9-]{1,64}$/.test(id)) return false
  await ensureFlyerTables()
  const result = await pool.query(`SELECT 1 FROM flyer_locations WHERE id = $1`, [id])
  return result.rows.length > 0
}

export async function deleteFlyerLocation(id: string) {
  if (!/^[a-z0-9-]{1,64}$/.test(id)) return false
  await ensureFlyerTables()
  await pool.query(`DELETE FROM flyer_visits WHERE location_id = $1`, [id])
  const result = await pool.query(`DELETE FROM flyer_locations WHERE id = $1`, [id])
  return (result.rowCount ?? 0) > 0
}

export async function recordFlyerVisit(id: string, visitorId: string) {
  await pool.query(`INSERT INTO flyer_visits (location_id, visitor_id) VALUES ($1, $2)`, [
    id,
    visitorId,
  ])
}
