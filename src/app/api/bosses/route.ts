import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/pg';
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT id, username, email FROM bossess');
    console.log("Bosses API response:", rows);
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching bosses:', error);
    return NextResponse.json({ error: 'Failed to fetch bosses data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();
    const hash = await bcrypt.hash(password, 12)
    const client = await pool.connect();
    await client.query('INSERT INTO bossess (username, email, password_hash) VALUES ($1, $2, $3)', [username, email, hash]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error adding boss:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, username, email, password } = await request.json();
    const client = await pool.connect();
    if (password) {
      const hash = await bcrypt.hash(password, 12);
      await client.query('UPDATE bossess SET username = $1, email = $2, password_hash = $3 WHERE id = $4', [username, email, hash, id]);
    } else {
      await client.query('UPDATE bossess SET username = $1, email = $2 WHERE id = $3', [username, email, id]);
    }
    client.release();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating boss:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const client = await pool.connect();
    await client.query('DELETE FROM bossess WHERE id = $1', [id]);
    client.release();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting boss:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
} 