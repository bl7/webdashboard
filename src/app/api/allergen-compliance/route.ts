import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, businessName, businessType, locations } = body

    // Validate required fields
    if (!email || !businessName || !businessType || !locations) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Here you would typically:
    // 1. Save to your database
    // 2. Send to your email marketing service (Mailchimp, ConvertKit, etc.)
    // 3. Send welcome email with download link
    // 4. Add to your CRM

    // For now, we'll just log the data
    console.log('Allergen Compliance Lead:', {
      email,
      businessName,
      businessType,
      locations,
      timestamp: new Date().toISOString(),
      source: 'allergen-compliance-page'
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you! Your allergen compliance toolkit is being prepared.',
        downloadUrl: '/downloads/allergen-compliance-toolkit.pdf' // This would be a real download link
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing allergen compliance lead:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 