import { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  // Forward the request to our subscription_better webhook handler
  const response = await fetch(new URL('/api/subscription_better/webhook', req.url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'stripe-signature': req.headers.get('stripe-signature') || '',
    },
    body: await req.text()
  })

  return response
} 