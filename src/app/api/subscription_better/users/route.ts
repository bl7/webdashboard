import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';

export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
      SELECT u.user_id, u.company_name, s.plan_name, s.status, s.current_period_end, s.trial_end, s.pending_plan_change, s.pending_plan_change_effective, s.created_at
      FROM user_profiles u
      LEFT JOIN subscription_better s ON u.user_id::text = s.user_id::text
    `);
    client.release();
    return NextResponse.json(rows);
  } catch (e) {
    console.error('Error fetching users:', e);
    return NextResponse.json({ error: 'Failed to fetch users data' }, { status: 500 });
  }
} 