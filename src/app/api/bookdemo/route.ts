import { NextRequest, NextResponse } from 'next/server'
import  pool  from '@/lib/pg'


export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, role, message, source } = await req.json()
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 })
    }
    const result = await pool.query(
      `INSERT INTO book_demo_requests (name, email, phone, company, role, message, source) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, email, phone, company, role, message, source]
    )
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error('BookDemo POST error:', err)
    return NextResponse.json({ error: 'Failed to submit demo request.' }, { status: 500 })
  }
}

export async function GET() {
  // await requireBossAuth(req)
  try {
    const result = await pool.query('SELECT * FROM book_demo_requests ORDER BY created_at DESC')
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('BookDemo GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch demo requests.' }, { status: 500 })
  }
} 