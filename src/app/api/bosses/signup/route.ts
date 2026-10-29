import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json({ message: "Boss signup is closed." }, { status: 403 })
}
