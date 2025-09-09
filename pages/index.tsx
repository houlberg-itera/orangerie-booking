import Head from 'next/head'
import BookingForm from '../src/components/BookingForm'
import AvailabilityCalendar from '../src/components/AvailabilityCalendar'
import { useContent } from '../lib/useContent'

export default function HomePage() {
  const { content } = useContent()

  return (
    <>
      <Head>
        <title>Orangerie Booking</title>
        <meta name="description" content="Book your perfect event space in our beautiful orangerie" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍊</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container max-w-7xl mx-auto py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Orangerie Booking
              </h1>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Home
                </a>
                <a href="/bookings" className="text-gray-700 hover:text-primary-600 transition-colors">
                  My Bookings
                </a>
                <a href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Contact
                </a>
              </nav>
            </div>
          </div>
        </header>
        
        <main className="min-h-screen bg-gray-50">
          <div className="container max-w-7xl mx-auto py-8">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {content.hero_title}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {content.hero_subtitle}
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.feature1_title}</h3>
                <p className="text-gray-600">
                  {content.feature1_description}
                </p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.feature2_title}</h3>
                <p className="text-gray-600">
                  {content.feature2_description}
                </p>
              </div>
              
              <div className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{content.feature3_title}</h3>
                <p className="text-gray-600">
                  {content.feature3_description}
                </p>
              </div>
            </div>

            {/* Booking Section */}
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Check Availability</h2>
                <AvailabilityCalendar />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Make a Reservation</h2>
                <BookingForm />
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-white border-t border-gray-200">
          <div className="container max-w-7xl mx-auto py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 Orangerie Booking. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
