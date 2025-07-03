import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';
import { verifyAuthToken } from '@/lib/auth';

const TOGETHER_API_KEY = 'd7b1fd6c5b4e675fca070223224ef43114589d3229fa49e0787dfb129a716449';

function formatOrderHistory(orders: any[]): string {
  if (!orders.length) return 'No order history.';
  const header = 'Date,Bundles,Labels,Amount($),Status';
  const rows = orders.map((o: any) => [
    new Date(o.created_at).toLocaleDateString('en-GB'),
    o.bundle_count,
    o.label_count,
    (Number(o.amount_cents) / 100).toFixed(2),
    o.status
  ].join(','));
  return [header, ...rows].join('\n');
}

function formatUsageHistory(usages: any[]): string {
  if (!usages.length) return 'No usage history.';
  const header = 'Date,Labels Printed';
  // Group by date
  const usageByDate = usages.reduce((acc: any, u: any) => {
    const date = new Date(u.timestamp).toLocaleDateString('en-GB');
    const qty = Number(u.details?.quantity) || 1;
    acc[date] = (acc[date] || 0) + qty;
    return acc;
  }, {});
  const rows = Object.entries(usageByDate)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([date, qty]) => `${date},${qty}`);
  return [header, ...rows].join('\n');
}

// Helper: Simulate label depletion after each order to estimate run-out dates
function calculateOrderAnalytics(orders: any[], usages: any[]): { analyticsTable: string, summary: string, projectedRunOut: string, recommendedOrderDate: string } {
  if (!orders.length || !usages.length) return { analyticsTable: 'No analytics available.', summary: '', projectedRunOut: '', recommendedOrderDate: '' };
  // Sort orders by created_at ascending
  const sortedOrders = [...orders].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  // Group usage by date ascending
  const usageByDate: Record<string, number> = usages.reduce((acc: any, u: any) => {
    const date = new Date(u.timestamp).toISOString().split('T')[0];
    const qty = Number(u.details?.quantity) || 1;
    acc[date] = (acc[date] || 0) + qty;
    return acc;
  }, {});
  const usageDates = Object.keys(usageByDate).sort();
  let analyticsRows: string[] = [];
  let summary = '';
  let lastRunOutDate = '';
  let lastOrderDate = '';
  let lastLabelsOrdered = 0;
  let ranOutEarlyCount = 0;
  let excessCount = 0;
  let totalDaysCovered = 0;
  let orderIntervals: number[] = [];
  // For each order, simulate depletion
  for (let i = 0; i < sortedOrders.length; i++) {
    const order = sortedOrders[i];
    const orderDate = new Date(order.created_at).toISOString().split('T')[0];
    const labelsOrdered = Number(order.label_count);
    let labelsLeft = labelsOrdered;
    let runOutDate = '';
    let daysCovered = 0;
    // Find usage after this order (until next order or end)
    let nextOrderDate = i < sortedOrders.length - 1 ? new Date(sortedOrders[i + 1].created_at).toISOString().split('T')[0] : null;
    for (const usageDate of usageDates) {
      if (usageDate < orderDate) continue;
      if (nextOrderDate && usageDate >= nextOrderDate) break;
      const used = usageByDate[usageDate];
      if (labelsLeft > 0) {
        labelsLeft -= used;
        daysCovered++;
        if (labelsLeft <= 0) {
          runOutDate = usageDate;
          break;
        }
      }
    }
    if (!runOutDate && nextOrderDate) runOutDate = nextOrderDate; // If not depleted, set to next order
    if (!runOutDate && !nextOrderDate) runOutDate = usageDates[usageDates.length - 1] || orderDate;
    // Days between this order and next
    let daysToNextOrder = nextOrderDate ? Math.ceil((new Date(nextOrderDate).getTime() - new Date(orderDate).getTime()) / (1000 * 60 * 60 * 24)) : null;
    // Did user run out before next order?
    let ranOutEarly = false;
    if (nextOrderDate && runOutDate < nextOrderDate) ranOutEarly = true;
    if (ranOutEarly) ranOutEarlyCount++;
    else excessCount++;
    totalDaysCovered += daysCovered;
    if (lastOrderDate) {
      orderIntervals.push(Math.ceil((new Date(orderDate).getTime() - new Date(lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)));
    }
    analyticsRows.push([
      orderDate,
      labelsOrdered,
      runOutDate,
      daysCovered,
      nextOrderDate || '-',
      daysToNextOrder !== null ? daysToNextOrder : '-',
      ranOutEarly ? 'Yes' : 'No'
    ].join(','));
    lastRunOutDate = runOutDate;
    lastOrderDate = orderDate;
    lastLabelsOrdered = labelsOrdered;
  }
  // Project run-out for most recent order
  const recentUsage = usageDates.slice(-14).map(d => usageByDate[d]);
  const avgDaily = recentUsage.length ? recentUsage.reduce((a, b) => a + b, 0) / recentUsage.length : 0;
  let projectedRunOut = '';
  let recommendedOrderDate = '';
  if (avgDaily > 0) {
    let labelsLeft = lastLabelsOrdered;
    let lastUsageDate = usageDates[usageDates.length - 1];
    let days = 0;
    while (labelsLeft > 0) {
      labelsLeft -= avgDaily;
      days++;
    }
    const runOut = new Date(new Date(lastOrderDate).getTime() + days * 24 * 60 * 60 * 1000);
    projectedRunOut = runOut.toISOString().split('T')[0];
    // Recommend ordering 5 days before run-out
    const reorder = new Date(runOut.getTime() - 5 * 24 * 60 * 60 * 1000);
    recommendedOrderDate = reorder.toISOString().split('T')[0];
  }
  // Summary
  summary = `In the last ${sortedOrders.length} orders, the user ran out of labels before the next order ${ranOutEarlyCount} times and had excess ${excessCount} times. Average days covered per order: ${Math.round(totalDaysCovered / sortedOrders.length)}. Average days between orders: ${orderIntervals.length ? Math.round(orderIntervals.reduce((a, b) => a + b, 0) / orderIntervals.length) : '-'} days.`;
  // Table header
  const analyticsTable = [
    'Order Date,Labels Ordered,Run-out Date,Days Covered,Next Order,Days to Next,Out Before Next?'.replace(/,/g, ','),
    ...analyticsRows
  ].join('\n');
  return { analyticsTable, summary, projectedRunOut, recommendedOrderDate };
}

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const { userUuid } = await verifyAuthToken(req);
    const { usageData, goal } = await req.json();
    const { labelsPerDay, labelsPerRoll, days } = usageData || {};
    if (!labelsPerDay || !labelsPerRoll || !days || !goal) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Fetch ALL order history
    const orderRes = await pool.query(
      `SELECT created_at, bundle_count, label_count, amount_cents, status
       FROM label_orders WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userUuid]
    );
    // Fetch ALL usage history
    const usageRes = await pool.query(
      `SELECT timestamp, details
       FROM activity_logs
       WHERE user_id = $1 AND action = 'print_label'
       ORDER BY timestamp DESC`,
      [userUuid]
    );
    // Parse details JSON if needed
    const usages = usageRes.rows.map((row: any) => ({
      ...row,
      details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details
    }));
    // Format histories
    const orderHistory = formatOrderHistory(orderRes.rows);
    const usageHistory = formatUsageHistory(usages);
    // --- New analytics ---
    const { analyticsTable, summary, projectedRunOut, recommendedOrderDate } = calculateOrderAnalytics(orderRes.rows, usages);
    // Build upgraded analytics prompt
    const today = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
    const prompt = `You are a label ordering assistant for a kitchen label printing SaaS.\n\nThe user wants their next order to last for ${days} days.\n\nBelow is the user's full label order and usage history.\n\nOrder Analytics Table:\n${analyticsTable}\n\nSummary:\n${summary}\n\nProjected run-out date for the most recent order: ${projectedRunOut}. Recommend the user place their next order by ${recommendedOrderDate} to avoid running out.\n\nOrder History (all available):\n${orderHistory}\n\nLabel Usage History (all available):\n${usageHistory}\n\nThe user prints about ${labelsPerDay} labels per day and usually orders rolls with ${labelsPerRoll} labels per roll. Today is ${today}.\n\nFirst, analyze the analytics table and history for trends:\n- Is the user's label usage increasing, decreasing, or stable?\n- Are there any recent spikes or drops in usage?\n- Has the user run out of labels before their next order, or had excess left over?\n- Are orders becoming more or less frequent?\n\nSummarize your findings in 2-3 sentences.\n\nThen, based on your analysis, recommend how many rolls to order for the next ${days} days. If usage is rising, suggest a buffer. If it's falling, suggest a lower amount. If the user often runs out, recommend extra. If they have excess, suggest less.\n\nAdditionally, if the user orders X rolls (where X is the current order quantity), forecast how long this order will last based on their real usage patterns (including weekends, trends, and anomalies). Provide your reasoning and calculations.\n\nYour answer should include:\n- A summary of trends and insights.\n- A clear, actionable recommendation (number of rolls and when to order).\n- How long the current order will last at the current usage rate, based on real data.\n- Reasoning for your recommendation.\n`;
    // Call Together AI
    const togetherRes = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 512,
      }),
    });
    if (!togetherRes.ok) {
      const err = await togetherRes.text();
      return NextResponse.json({ error: 'Together AI API error', details: err }, { status: 500 });
    }
    const data = await togetherRes.json();
    const suggestion = data.choices?.[0]?.message?.content || 'No suggestion returned.';
    return NextResponse.json({ suggestion });
  } catch (e) {
    return NextResponse.json({ error: 'Server error', details: e?.toString() }, { status: 500 });
  }
} 