import { NextRequest, NextResponse } from 'next/server'
import  pool  from '@/lib/pg'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  // await requireBossAuth(req)
  try {
    const { id } = params
    const result = await pool.query('SELECT * FROM book_demo_requests WHERE id = $1', [id])
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  // await requireBossAuth(req)
  try {
    const { id } = params
    const { attended } = await req.json()
    const result = await pool.query('UPDATE book_demo_requests SET attended = $1 WHERE id = $2 RETURNING *', [attended, id])
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  // await requireBossAuth(req)
  try {
    const { id } = params
    await pool.query('DELETE FROM book_demo_requests WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 })
  }
} 