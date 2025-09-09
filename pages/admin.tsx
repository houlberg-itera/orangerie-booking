import { useState, useEffect } from 'react'
import Head from 'next/head'

interface Booking {
  id: number
  name: string
  email: string
  phone?: string
  event_type: string
  guest_count: number
  event_date: string
  start_time: string
  end_time: string
  message?: string
  status: string
  created_at: string
}

export default function AdminPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      // We'll need to create a separate admin API endpoint
      // For now, this is a placeholder
      setError('Admin functionality requires additional setup. See SETUP-GUIDE.md for details.')
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch bookings')
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-800 bg-green-100'
      case 'pending': return 'text-yellow-800 bg-yellow-100'
      case 'cancelled': return 'text-red-800 bg-red-100'
      default: return 'text-gray-800 bg-gray-100'
    }
  }

  return (
    <>
      <Head>
        <title>Admin - Orangerie Bookings</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container max-w-7xl mx-auto py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Orangerie Booking Admin
              </h1>
              <nav className="flex space-x-4">
                <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  ← Back to Site
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Bookings
              </h2>

              {loading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-2 text-gray-600">Loading bookings...</p>
                </div>
              )}

              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Admin Setup Required
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>{error}</p>
                        <p className="mt-2">
                          To enable full admin functionality, you'll need to:
                        </p>
                        <ul className="mt-2 list-disc list-inside">
                          <li>Add authentication (NextAuth.js or Supabase Auth)</li>
                          <li>Create admin API endpoints</li>
                          <li>Set up proper permissions</li>
                        </ul>
                        <p className="mt-2">
                          For now, you can view bookings directly in your Supabase dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && bookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No bookings found.</p>
                </div>
              )}

              {!loading && !error && bookings.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Guests
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {bookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {booking.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {booking.email}
                              </div>
                              {booking.phone && (
                                <div className="text-sm text-gray-500">
                                  {booking.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 capitalize">
                              {booking.event_type.replace('_', ' ')}
                            </div>
                            {booking.message && (
                              <div className="text-sm text-gray-500 max-w-xs truncate">
                                {booking.message}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {formatDate(booking.event_date)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.start_time} - {booking.end_time}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.guest_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900 mr-3">
                              View
                            </button>
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              Approve
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Total Bookings</h3>
                <p className="text-3xl font-bold text-primary-600 mt-2">
                  {bookings.length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Pending</h3>
                <p className="text-3xl font-bold text-yellow-600 mt-2">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Confirmed</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">This Month</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {bookings.filter(b => 
                    new Date(b.event_date).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
