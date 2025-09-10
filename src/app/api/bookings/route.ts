import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const booking = await request.json()
    
    // Basic validation
    if (!booking.name || !booking.email || !booking.eventDate || !booking.eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(booking.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate date is in the future
    const eventDate = new Date(booking.eventDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (eventDate < today) {
      return NextResponse.json(
        { error: 'Event date must be in the future' },
        { status: 400 }
      )
    }

    // In a real application, you would:
    // 1. Save to database (Supabase, PostgreSQL, etc.)
    // 2. Send confirmation email
    // 3. Check for conflicts with existing bookings
    // 4. Generate booking reference number
    
    // For now, just log the booking and return success
    console.log('New booking request:', {
      id: Date.now().toString(),
      ...booking,
      status: 'pending',
      createdAt: new Date().toISOString()
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: 'Booking request submitted successfully',
      bookingId: Date.now().toString()
    })

  } catch (error) {
    console.error('Booking submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // This could return booking availability or existing bookings
  // For now, return mock availability data
  
  const mockBookings = [
    {
      id: '1',
      date: '2025-09-15',
      time: '14:00-18:00',
      status: 'confirmed'
    },
    {
      id: '2', 
      date: '2025-09-22',
      time: '10:00-16:00',
      status: 'confirmed'
    }
  ]

  return NextResponse.json({
    bookings: mockBookings
  })
}
