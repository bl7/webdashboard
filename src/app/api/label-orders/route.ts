import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';
import { verifyAuthToken } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import Stripe from 'stripe';

// POST: Create a new label order and Stripe Checkout session
// GET: List user's label orders

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    const { userUuid } = await verifyAuthToken(req);
    const body = await req.json();
    const { bundle_count, shipping_address, label_product_id } = body;
    if (!bundle_count || !shipping_address || !label_product_id) {
      return NextResponse.json({ error: 'Missing bundle_count, shipping_address, or label_product_id' }, { status: 400 });
    }
    if (bundle_count < 1) {
      return NextResponse.json({ error: 'Bundle count must be at least 1' }, { status: 400 });
    }
    // Fetch user profile for email
    const profileRes = await pool.query(
      `SELECT email FROM user_profiles WHERE user_id = $1`,
      [userUuid]
    );
    if (profileRes.rowCount === 0) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    const email = profileRes.rows[0].email;
    // Fetch label product details
    const productRes = await pool.query(
      `SELECT * FROM label_products WHERE id = $1`,
      [label_product_id]
    );
    if (productRes.rowCount === 0) {
      return NextResponse.json({ error: 'Label product not found' }, { status: 404 });
    }
    const product = productRes.rows[0];
    const rollsPerBundle = product.rolls_per_bundle;
    const labelsPerRoll = product.labels_per_roll;
    const priceCents = product.price_cents;
    // Calculate label count and amount
    const label_count = bundle_count * rollsPerBundle * labelsPerRoll;
    const amount_cents = bundle_count * priceCents;
    // Insert order with status 'pending' and label_product_id
    const orderRes = await pool.query(
      `INSERT INTO label_orders (user_id, bundle_count, label_count, amount_cents, status, shipping_address, label_product_id)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6)
       RETURNING id`,
      [userUuid, bundle_count, label_count, amount_cents, shipping_address, label_product_id]
    );
    const orderId = orderRes.rows[0].id;
    
    // Create admin notification for new order
    await pool.query(
      `SELECT notify_new_label_order($1, $2, $3, $4, $5, $6, $7)`,
      [orderId, userUuid, bundle_count, label_count, amount_cents, label_product_id, shipping_address]
    );
    // Find or create Stripe customer
    let customer;
    const customers = await stripe.customers.list({ limit: 100 });
    const found = customers.data.find((c) => c.email === email);
    if (found) {
      customer = found;
      if (customer.metadata?.user_id !== userUuid) {
        await stripe.customers.update(customer.id, { metadata: { user_id: String(userUuid) } });
      }
    } else {
      customer = await stripe.customers.create({ email, metadata: { user_id: String(userUuid) } }) as any;
    }
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Label Bundle',
              description: `${bundle_count} bundle(s) of 5 labels each`,
            },
            unit_amount: priceCents,
          },
          quantity: bundle_count,
        },
      ],
      metadata: {
        user_id: String(userUuid),
        order_id: String(orderId),
        bundle_count: String(bundle_count),
        label_count: String(label_count),
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile?order_success=true&order_id=${orderId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/profile?order_canceled=true&order_id=${orderId}`,
      billing_address_collection: 'auto',
    });
    // Update order with Stripe payment intent/session id
    await pool.query(
      `UPDATE label_orders SET stripe_payment_intent_id = $1 WHERE id = $2`,
      [session.payment_intent || session.id, orderId]
    );
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Label order POST error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userUuid, role } = await verifyAuthToken(req);
    let result;
    if (role === 'boss') {
      result = await pool.query(
        `SELECT id, user_id, bundle_count, label_count, amount_cents, status, stripe_payment_intent_id, shipping_address, created_at, paid_at, shipped_at
         FROM label_orders ORDER BY created_at DESC`
      );
    } else {
      result = await pool.query(
        `SELECT id, user_id, bundle_count, label_count, amount_cents, status, stripe_payment_intent_id, shipping_address, created_at, paid_at, shipped_at
         FROM label_orders WHERE user_id = $1 ORDER BY created_at DESC`,
        [userUuid]
      );
    }
    const orders = result.rows;
    console.log('[LABEL ORDERS] Raw orders:', orders);
    // For each paid order, fetch the Stripe receipt_url
    const ordersWithReceipts = await Promise.all(
      orders.map(async (order: any) => {
        let receipt_url = null;
        if ((order.status === 'paid' || order.status === 'shipped') && order.stripe_payment_intent_id) {
          try {
            // Fetch PaymentIntent from Stripe, expanding charges
            const pi = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id, { expand: ['charges'] }) as any as Stripe.PaymentIntent & { charges: { data: Stripe.Charge[] } };
            console.log('[LABEL ORDERS] PaymentIntent:', JSON.stringify(pi, null, 2));
            if (!pi.charges || !pi.charges.data || pi.charges.data.length === 0) {
              console.log('[LABEL ORDERS] No charges found for PaymentIntent:', order.stripe_payment_intent_id);
            }
            // Get the first charge (should always exist for paid orders)
            const chargeId = pi.charges?.data?.[0]?.id;
            if (chargeId) {
              const charge = await stripe.charges.retrieve(chargeId);
              console.log('[LABEL ORDERS] Charge:', JSON.stringify(charge, null, 2));
              receipt_url = charge.receipt_url;
            }
          } catch (err) {
            console.error('[LABEL ORDERS] Error fetching PaymentIntent or Charge for order', order.id, order.stripe_payment_intent_id, err);
          }
        }
        return { ...order, receipt_url };
      })
    );
    console.log('[LABEL ORDERS] Orders with receipts:', ordersWithReceipts);
    return NextResponse.json({ orders: ordersWithReceipts });
  } catch (error: any) {
    console.error('Label order GET error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 