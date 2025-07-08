import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req);
    if (role !== 'boss') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const client = await pool.connect();
    const { rows } = await client.query(`
      SELECT u.user_id, u.company_name, u.email, s.plan_name, s.status, s.current_period_end, s.trial_end, s.pending_plan_change, s.pending_plan_change_effective, s.created_at
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