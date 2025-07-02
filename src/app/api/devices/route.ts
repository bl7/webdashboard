import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';
import { sendMail } from '@/lib/mail';

// GET: List all devices (admin)
export async function GET(req: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT d.*, u.email AS user_email, p.name AS plan_name
      FROM devices d
      LEFT JOIN user_profiles u ON d.user_id = u.user_id
      LEFT JOIN plans p ON d.plan_id = p.id
      ORDER BY d.created_at DESC
    `);
    return NextResponse.json({ devices: result.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Assign a new device (admin)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      user_id,
      plan_id,
      device_type,
      device_identifier,
      status = 'pending',
      notes
    } = body;
    if (!user_id || !plan_id || !device_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const result = await pool.query(
      `INSERT INTO devices (user_id, plan_id, device_type, device_identifier, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, plan_id, device_type, device_identifier || null, status, notes || null]
    );
    return NextResponse.json({ device: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update device status/info (admin)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, device_identifier, shipped_at, delivered_at, return_requested_at, returned_at, notes } = body;
    if (!id) return NextResponse.json({ error: 'Device ID required' }, { status: 400 });
    const client = await pool.connect();
    try {
      // Update device
      const result = await client.query(
        `UPDATE devices SET
          status = COALESCE($2, status),
          device_identifier = COALESCE($3, device_identifier),
          shipped_at = COALESCE($4, shipped_at),
          delivered_at = COALESCE($5, delivered_at),
          return_requested_at = COALESCE($6, return_requested_at),
          returned_at = COALESCE($7, returned_at),
          notes = COALESCE($8, notes),
          updated_at = NOW()
        WHERE id = $1
        RETURNING *`,
        [id, status, device_identifier, shipped_at, delivered_at, return_requested_at, returned_at, notes]
      );
      const device = result.rows[0];
      // Fetch user email
      let userEmail = device.user_email;
      if (!userEmail && device.user_id) {
        const userRes = await client.query('SELECT email FROM user_profiles WHERE user_id = $1', [device.user_id]);
        userEmail = userRes.rows[0]?.email;
      }
      // Send email if status changed to shipped
      if (status === 'shipped' && userEmail) {
        await sendMail({
          to: userEmail,
          subject: 'Your InstaLabel Device Has Shipped!',
          body: `<p>Your InstaLabel device has been shipped and will arrive soon. If you have any questions, contact support.</p>`
        });
        console.log(`[DEVICE] Shipped email sent to ${userEmail} for device ${id}`);
      }
      return NextResponse.json({ device });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 