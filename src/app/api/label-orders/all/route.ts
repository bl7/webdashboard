import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';

export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(
      `SELECT o.id, o.user_id, u.full_name, u.email, o.bundle_count, o.label_count, o.amount_cents, o.status, o.stripe_payment_intent_id, o.shipping_address, o.created_at, o.paid_at, o.shipped_at, o.label_product_id, p.name AS product_name, p.price_cents AS product_price_cents, p.rolls_per_bundle, p.labels_per_roll
       FROM label_orders o
       LEFT JOIN user_profiles u ON o.user_id = u.user_id
       LEFT JOIN label_products p ON o.label_product_id = p.id
       ORDER BY o.created_at DESC`
    );
    return NextResponse.json({ orders: result.rows });
  } catch (error: any) {
    console.error('Label order ALL GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 