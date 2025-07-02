import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';
import { sendMail } from '@/lib/mail';
import { labelOrderShippedEmail } from '@/components/templates/subscriptionEmails';

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  // Await params before using
  const params = await context.params;
  const orderId = params.id;

  if (!orderId) {
    return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
  }

  try {
    const result = await pool.query(
      `UPDATE label_orders SET status = 'shipped', shipped_at = NOW() WHERE id = $1 RETURNING *`,
      [orderId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = result.rows[0];

    const userRes = await pool.query(
      `SELECT full_name, email FROM user_profiles WHERE user_id = $1`,
      [order.user_id]
    );

    const user = userRes.rows[0];

    if (user && user.email) {
      console.log('[SHIP] Sending shipped email to user:', { to: user.email, orderId: order.id });
      await sendMail({
        to: user.email,
        subject: 'Your Label Order Has Shipped!',
        body: labelOrderShippedEmail({
          name: user.full_name || user.email,
          email: user.email,
          bundleCount: order.bundle_count,
          labelCount: order.label_count,
          amount: order.amount_cents,
          shippingAddress: order.shipping_address,
          orderId: order.id,
        }),
      });
      console.log('[SHIP] Sent shipped email to user:', { to: user.email, orderId: order.id });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Label order SHIP error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
