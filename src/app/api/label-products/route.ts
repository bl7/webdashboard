import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/pg';

// GET: List all label products
export async function GET(req: NextRequest) {
  try {
    const result = await db.query('SELECT * FROM label_products ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch label products', details: error }, { status: 500 });
  }
}

// POST: Create a new label product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, price_cents, rolls_per_bundle, labels_per_roll } = data;
    if (
      typeof name !== "string" ||
      isNaN(Number(price_cents)) ||
      isNaN(Number(rolls_per_bundle)) ||
      isNaN(Number(labels_per_roll))
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const result = await db.query(
      'INSERT INTO label_products (name, price_cents, rolls_per_bundle, labels_per_roll) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, Number(price_cents), Number(rolls_per_bundle), Number(labels_per_roll)]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Label Products POST error:", error);
    return NextResponse.json({ error: 'Failed to create label product', details: error }, { status: 500 });
  }
}

// PUT: Update a label product (expects id in body)
export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { id, name, price_cents, rolls_per_bundle, labels_per_roll } = data;
    if (
      isNaN(Number(id)) ||
      typeof name !== "string" ||
      isNaN(Number(price_cents)) ||
      isNaN(Number(rolls_per_bundle)) ||
      isNaN(Number(labels_per_roll))
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const result = await db.query(
      'UPDATE label_products SET name = $2, price_cents = $3, rolls_per_bundle = $4, labels_per_roll = $5 WHERE id = $1 RETURNING *',
      [Number(id), name, Number(price_cents), Number(rolls_per_bundle), Number(labels_per_roll)]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Label Products PUT error:", error);
    return NextResponse.json({ error: 'Failed to update label product', details: error }, { status: 500 });
  }
}

// DELETE: Delete a label product (expects id in body)
export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const { id } = data;
    await db.query('DELETE FROM label_products WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete label product', details: error }, { status: 500 });
  }
} 