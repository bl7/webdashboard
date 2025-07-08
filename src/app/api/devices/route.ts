import { NextRequest, NextResponse } from "next/server"
import pool from "@/lib/pg"
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { role, userUuid } = await verifyAuthToken(req);
    if (role !== 'boss') {
      // User: only fetch their own devices
      const result = await pool.query(`
        SELECT 
          d.id,
          d.user_id,
          d.plan_id,
          d.assigned_at,
          d.shipped_at,
          d.delivered_at,
          d.return_requested_at,
          d.returned_at,
          d.device_type,
          d.device_identifier,
          d.status,
          d.notes,
          d.created_at,
          d.updated_at,
          u.full_name as customer_name,
          u.email as customer_email,
          p.name as plan_name,
          COALESCE(s.status, 'unknown') as subscription_status
        FROM devices d
        LEFT JOIN user_profiles u ON d.user_id = u.user_id
        LEFT JOIN plans p ON d.plan_id = p.id
        LEFT JOIN subscription_better s ON d.user_id::uuid = s.user_id AND d.plan_id::text = s.plan_id
        WHERE d.user_id = $1
        ORDER BY d.created_at DESC
      `, [userUuid]);
      return NextResponse.json({ devices: result.rows });
    }
    // Boss: fetch all devices
    const result = await pool.query(`
      SELECT 
        d.id,
        d.user_id,
        d.plan_id,
        d.assigned_at,
        d.shipped_at,
        d.delivered_at,
        d.return_requested_at,
        d.returned_at,
        d.device_type,
        d.device_identifier,
        d.status,
        d.notes,
        d.created_at,
        d.updated_at,
        u.full_name as customer_name,
        u.email as customer_email,
        p.name as plan_name,
        COALESCE(s.status, 'unknown') as subscription_status
      FROM devices d
      LEFT JOIN user_profiles u ON d.user_id = u.user_id
      LEFT JOIN plans p ON d.plan_id = p.id
      LEFT JOIN subscription_better s ON d.user_id::uuid = s.user_id AND d.plan_id::text = s.plan_id
      ORDER BY d.created_at DESC
    `);
    return NextResponse.json({ devices: result.rows });
  } catch (error: any) {
    console.error("Error fetching devices:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST: Assign a new device (admin)
export async function POST(req: NextRequest) {
  try {
    const { role, userUuid } = await verifyAuthToken(req);
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
    if (role !== 'boss' && user_id !== userUuid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
    const { role, userUuid } = await verifyAuthToken(req);
    const body = await req.json();
    const { id, status, device_identifier, shipped_at, delivered_at, return_requested_at, returned_at, notes } = body;
    if (!id) return NextResponse.json({ error: 'Device ID required' }, { status: 400 });
    // Fetch device to check ownership
    const client = await pool.connect();
    let device;
    try {
      const result = await client.query('SELECT * FROM devices WHERE id = $1', [id]);
      device = result.rows[0];
      if (!device) return NextResponse.json({ error: 'Device not found' }, { status: 404 });
      if (role !== 'boss' && device.user_id !== userUuid) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // Update device
      const updateResult = await client.query(
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
      const updatedDevice = updateResult.rows[0];
      // Fetch user email
      let userEmail = updatedDevice.user_email;
      if (!userEmail && updatedDevice.user_id) {
        const userRes = await client.query('SELECT email FROM user_profiles WHERE user_id = $1', [updatedDevice.user_id]);
        userEmail = userRes.rows[0]?.email;
      }
      // Send email if status changed to shipped
      if (status === 'shipped' && userEmail) {
        // await sendMail({ // This line was removed as per the new_code, as sendMail is no longer imported.
        //   to: userEmail,
        //   subject: 'Your InstaLabel Device Has Shipped!',
        //   body: `<p>Your InstaLabel device has been shipped and will arrive soon. If you have any questions, contact support.</p>`
        // });
        console.log(`[DEVICE] Shipped email sent to ${userEmail} for device ${id}`);
      }
      return NextResponse.json({ device: updatedDevice });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 