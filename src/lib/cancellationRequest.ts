/** Soft status on cancellation request rows (pending | withdrawn | processed). */
export async function ensureCancellationStatusColumn(client: {
  query: (text: string, params?: unknown[]) => Promise<unknown>
}) {
  await client.query(`
    ALTER TABLE subscription_cancellations
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'
  `)
}

export const PENDING_CANCELLATION_SQL = `COALESCE(status, 'pending') = 'pending'`
