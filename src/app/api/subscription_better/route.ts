import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const dateFrom = searchParams.get('date_from')
  const dateTo = searchParams.get('date_to')
  let where = ''
  let values: any[] = []
  if (dateFrom && dateTo) {
    where = 'WHERE s.created_at BETWEEN $1 AND $2'
    values = [dateFrom, dateTo]
  }
  const query = `
    SELECT s.*, u.company_name, u.email
    FROM subscription_better s
    LEFT JOIN user_profiles u ON s.user_id::text = u.user_id::text
    ${where}
    ORDER BY s.created_at DESC
  `
  const client = await pool.connect()
  try {
    const { rows } = await client.query(query, values)
    return NextResponse.json({ subscriptions: rows })
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 })
  } finally {
    client.release()
  }
} 