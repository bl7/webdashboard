import { NextRequest, NextResponse } from 'next/server'
import  pool  from '@/lib/pg'
import { verifyAuthToken } from '@/lib/auth'
import { sendMail } from '@/lib/mail'
import { formatEmailBody, renderInstaLabelEmail } from '@/lib/instalabel-email'

const CONTACT_BCC = 'contact@instalabel.co'

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

    try {
      const subject = 'Thanks for requesting an InstaLabel demo'
      const bodyText = [
        'Thanks for requesting a demo of InstaLabel.',
        company
          ? `We've received your request for ${company} and our team will get back to you shortly to schedule a time that works for you.`
          : "We've received your request and our team will get back to you shortly to schedule a time that works for you.",
        message ? `Your message:\n${message}` : '',
        'In the meantime, feel free to reply to this email if you have any questions.',
      ]
        .filter(Boolean)
        .join('\n\n')

      await sendMail({
        to: email,
        subject,
        body: renderInstaLabelEmail({
          subject,
          recipientName: name,
          bodyHtml: formatEmailBody(bodyText),
        }),
        bcc: CONTACT_BCC,
      })
    } catch (mailErr) {
      console.error('BookDemo confirmation email error:', mailErr)
    }

    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error('BookDemo POST error:', err)
    return NextResponse.json({ error: 'Failed to submit demo request.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { role } = await verifyAuthToken(req)
    if (role !== 'boss') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const result = await pool.query('SELECT * FROM book_demo_requests ORDER BY created_at DESC')
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('BookDemo GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch demo requests.' }, { status: 500 })
  }
} 