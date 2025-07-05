import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    let where = ''
    let values: any[] = []
    if (dateFrom && dateTo) {
      where = 'WHERE s.created_at BETWEEN $1 AND $2'
      values = [dateFrom, dateTo]
    }
    const client = await pool.connect();
    // Join user_profiles and subscription_better
    const { rows } = await client.query(`
      SELECT u.user_id, u.company_name, s.plan_id, s.plan_name, s.status, s.billing_interval, s.amount, s.current_period_end, s.trial_end, s.pending_plan_change, s.pending_plan_change_effective, s.created_at
      FROM user_profiles u
      INNER JOIN subscription_better s ON u.user_id::text = s.user_id::text
      ${where}
    `, values);
    client.release();
    const subs = rows;
    // Aggregate metrics
    const total = subs.length;
    const active = subs.filter((s: any) => s.status === 'active').length;
    const trialing = subs.filter((s: any) => s.status === 'trialing').length;
    const canceled = subs.filter((s: any) => s.status === 'canceled').length;
    const mrr = subs.filter((s: any) => s.status === 'active' && s.billing_interval === 'month').reduce((sum: any, s: any) => sum + ((s.amount || 0) / 100), 0) + subs.filter((s: any) => s.status === 'active' && s.billing_interval === 'year').reduce((sum: any, s: any) => sum + (((s.amount || 0) / 100) / 12), 0);
    const arr = subs.filter((s: any) => s.status === 'active' && s.billing_interval === 'year').reduce((sum: any, s: any) => sum + ((s.amount || 0) / 100), 0) + subs.filter((s: any) => s.status === 'active' && s.billing_interval === 'month').reduce((sum: any, s: any) => sum + (((s.amount || 0) / 100) * 12), 0);
    const arpu = active > 0 ? mrr / active : 0;
    const churnRate = total > 0 ? canceled / total : 0;
    const trialConversion = (trialing + active + canceled) > 0 ? (active + canceled) / (trialing + active + canceled) : 0;
    // Plan distribution
    const planMap: Record<string, number> = {};
    subs.forEach((s: any) => { if (s.plan_name) planMap[s.plan_name] = (planMap[s.plan_name] || 0) + 1; });
    const planDistribution = Object.entries(planMap).map(([name, value]) => ({ name, value }));
    // Status distribution
    const statusMap: Record<string, number> = {};
    subs.forEach((s: any) => { if (s.status) statusMap[s.status] = (statusMap[s.status] || 0) + 1; });
    const statusDistribution = Object.entries(statusMap).map(([name, value]) => ({ name, value }));
    // Recent signups (last 30 days)
    const now = new Date();
    const recentSignups = subs.filter((s: any) => s.created_at && (now.getTime() - new Date(s.created_at).getTime()) < 30 * 24 * 60 * 60 * 1000).slice(0, 10);
    // Top customers (by amount)
    const topCustomers = [...subs].sort((a: any, b: any) => ((b.amount || 0) / 100) - ((a.amount || 0) / 100)).slice(0, 10);
    // Upcoming renewals (next 30 days)
    const upcomingRenewals = subs.filter((s: any) => s.current_period_end && (new Date(s.current_period_end).getTime() - now.getTime()) < 30 * 24 * 60 * 60 * 1000 && (new Date(s.current_period_end).getTime() - now.getTime()) > 0).slice(0, 10);
    // Pending plan changes
    const pendingChanges = subs.filter((s: any) => s.pending_plan_change);
    // Failed payments (status = past_due or unpaid)
    const failedPayments = subs.filter((s: any) => s.status === 'past_due' || s.status === 'unpaid');
    return NextResponse.json({ total, active, trialing, canceled, mrr, arr, arpu, churnRate, trialConversion, planDistribution, statusDistribution, recentSignups, topCustomers, upcomingRenewals, pendingChanges, failedPayments });
  } catch (e) {
    console.error('Error fetching analytics:', e);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
} 