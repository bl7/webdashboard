import { NextResponse } from 'next/server'
import pool from '@/lib/pg'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // await requireBossAuth(request)
  try {
    const { id } = await params
    const result = await pool.query('SELECT * FROM book_demo_requests WHERE id = $1', [id])
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch request' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // await requireBossAuth(request)
  try {
    const { id } = await params
    const { attended } = await request.json()
    const result = await pool.query('UPDATE book_demo_requests SET attended = $1 WHERE id = $2 RETURNING *', [attended, id])
    if (result.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(result.rows[0])
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update request' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // await requireBossAuth(request)
  try {
    const { id } = await params
    await pool.query('DELETE FROM book_demo_requests WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete request' }, { status: 500 })
  }
}