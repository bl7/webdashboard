import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';

export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();
    const { rows } = await client.query(`
      SELECT u.user_id, u.company_name, s.plan_name, s.status, s.current_period_end, s.trial_end, s.pending_plan_change, s.pending_plan_change_effective, s.created_at
      FROM user_profiles u
      LEFT JOIN subscription_better s ON u.user_id = s.user_id
    `);
    client.release();
    return NextResponse.json(rows);
  } catch (e) {
    // Fallback mock data
    return NextResponse.json([
      {
        user_id: 'demo1',
        company_name: 'Acme Co',
        plan_name: 'Pro Kitchen (Monthly)',
        status: 'active',
        current_period_end: '2025-07-01',
        trial_end: null,
        pending_plan_change: null,
        pending_plan_change_effective: null,
        created_at: '2024-06-01',
      },
      {
        user_id: 'demo2',
        company_name: 'Beta Foods',
        plan_name: 'Multi-Site Mastery (Yearly)',
        status: 'trialing',
        current_period_end: '2025-07-10',
        trial_end: '2024-07-10',
        pending_plan_change: 'Pro Kitchen (Monthly)',
        pending_plan_change_effective: '2024-07-10',
        created_at: '2024-06-15',
      },
    ]);
  }
} 