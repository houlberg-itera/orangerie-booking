import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useContent } from '../lib/useContent'

interface Booking {
  id: number
  name: string
  email: string
  phone?: string
  street_name?: string
  street_number?: string
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
  const [activeTab, setActiveTab] = useState<'bookings' | 'content'>('bookings')
  const { content, updateContent, refetch } = useContent()
  const [editingContent, setEditingContent] = useState<{ [key: string]: string }>({})
  const [contentSaving, setContentSaving] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/admin')
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
      } else {
        setError('Fejl ved hentning af bookinger')
      }
    } catch (err) {
      setError('Fejl ved hentning af bookinger')
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id: number, status: string) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        // Refresh bookings
        fetchBookings()
      } else {
        setError('Fejl ved opdatering af booking')
      }
    } catch (err) {
      setError('Fejl ved opdatering af booking')
    }
  }

  const deleteBooking = async (id: number) => {
    if (!confirm('Er du sikker på, at du vil slette denne booking?')) {
      return
    }

    try {
      const response = await fetch('/api/admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        // Refresh bookings
        fetchBookings()
      } else {
        setError('Fejl ved sletning af booking')
      }
    } catch (err) {
      setError('Fejl ved sletning af booking')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('da-DK', {
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

  const handleContentEdit = (key: string, value: string) => {
    setEditingContent(prev => ({ ...prev, [key]: value }))
  }

  const saveContent = async (key: string) => {
    const value = editingContent[key]
    if (value === undefined) return

    setContentSaving(prev => ({ ...prev, [key]: true }))
    
    const success = await updateContent(key, value)
    if (success) {
      setEditingContent(prev => {
        const newState = { ...prev }
        delete newState[key]
        return newState
      })
    } else {
      setError('Fejl ved opdatering af indhold')
    }
    
    setContentSaving(prev => ({ ...prev, [key]: false }))
  }

  const cancelContentEdit = (key: string) => {
    setEditingContent(prev => {
      const newState = { ...prev }
      delete newState[key]
      return newState
    })
  }

  return (
    <>
      <Head>
        <title>Admin - Orangeri Bookinger</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div style={{ fontFamily: 'Inter, sans-serif' }}>
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="container max-w-7xl mx-auto py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Orangeri Booking Admin
              </h1>
              <nav className="flex space-x-4">
                <a href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
                  ← Tilbage til Hjemmeside
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen bg-gray-50 py-8">
          <div className="container max-w-7xl mx-auto">
            {/* Tab Navigation */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'bookings'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Booking Administration
                  </button>
                  <button
                    onClick={() => setActiveTab('content')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'content'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Indholds Administration
                  </button>
                </nav>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Seneste Bookinger
                </h2>

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <p className="mt-2 text-gray-600">Indlæser bookinger...</p>
                  </div>
                )}

              {error && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Admin Opsætning Påkrævet
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>{error}</p>
                        <p className="mt-2">
                          For at aktivere fuld admin funktionalitet skal du:
                        </p>
                        <ul className="mt-2 list-disc list-inside">
                          <li>Tilføje autentificering (NextAuth.js eller Supabase Auth)</li>
                          <li>Oprette admin API endpoints</li>
                          <li>Opsætte korrekte tilladelser</li>
                        </ul>
                        <p className="mt-2">
                          Foreløbig kan du se bookinger direkte i dit Supabase dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!loading && !error && bookings.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Ingen bookinger fundet.</p>
                </div>
              )}

              {!loading && !error && bookings.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gæst
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Arrangement
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dato & Tid
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gæster
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Handlinger
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
                              {(booking.street_name && booking.street_number) && (
                                <div className="text-sm text-gray-500">
                                  {booking.street_name} {booking.street_number}
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
                            {booking.status === 'confirmed' ? (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Aflys
                                </button>
                                <button 
                                  onClick={() => deleteBooking(booking.id)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Slet
                                </button>
                              </div>
                            ) : booking.status === 'cancelled' ? (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Genaktivér
                                </button>
                                <button 
                                  onClick={() => deleteBooking(booking.id)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Slet
                                </button>
                              </div>
                            ) : (
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Bekræft
                                </button>
                                <button 
                                  onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Aflys
                                </button>
                                <button 
                                  onClick={() => deleteBooking(booking.id)}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Slet
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

                {/* Quick Stats for Bookings */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900">Samlede Bookinger</h3>
                    <p className="text-3xl font-bold text-primary-600 mt-2">
                      {bookings.length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900">Afventer</h3>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">
                      {bookings.filter(b => b.status === 'pending').length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900">Bekræftet</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {bookings.filter(b => b.status === 'confirmed').length}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900">Denne Måned</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {bookings.filter(b => 
                        new Date(b.event_date).getMonth() === new Date().getMonth()
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Content Management Tab */}
            {activeTab === 'content' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Indholds Administration
                </h2>
                <p className="text-gray-600 mb-6">
                  Rediger tekstindholdet, der vises på din hjemmeside. Ændringer vil være synlige med det samme efter gemning.
                </p>

                <div className="space-y-6">
                  {/* Hero Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Hero Sektion</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hovedtitel
                        </label>
                        {editingContent.hero_title !== undefined ? (
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              value={editingContent.hero_title}
                              onChange={(e) => handleContentEdit('hero_title', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                            <button
                              onClick={() => saveContent('hero_title')}
                              disabled={contentSaving.hero_title}
                              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                            >
                              {contentSaving.hero_title ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => cancelContentEdit('hero_title')}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-900">{content.hero_title}</span>
                            <button
                              onClick={() => handleContentEdit('hero_title', content.hero_title)}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subtitle
                        </label>
                        {editingContent.hero_subtitle !== undefined ? (
                          <div className="flex space-x-2">
                            <textarea
                              value={editingContent.hero_subtitle}
                              onChange={(e) => handleContentEdit('hero_subtitle', e.target.value)}
                              rows={3}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            />
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => saveContent('hero_subtitle')}
                                disabled={contentSaving.hero_subtitle}
                                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                              >
                                {contentSaving.hero_subtitle ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                onClick={() => cancelContentEdit('hero_subtitle')}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between p-3 bg-gray-50 rounded-md">
                            <span className="text-gray-900">{content.hero_subtitle}</span>
                            <button
                              onClick={() => handleContentEdit('hero_subtitle', content.hero_subtitle)}
                              className="text-primary-600 hover:text-primary-700 text-sm font-medium ml-4"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Features Section</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="space-y-4">
                          <h4 className="font-medium text-gray-900">Feature {num}</h4>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Title
                            </label>
                            {editingContent[`feature${num}_title`] !== undefined ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingContent[`feature${num}_title`]}
                                  onChange={(e) => handleContentEdit(`feature${num}_title`, e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => saveContent(`feature${num}_title`)}
                                    disabled={contentSaving[`feature${num}_title`]}
                                    className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
                                  >
                                    {contentSaving[`feature${num}_title`] ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={() => cancelContentEdit(`feature${num}_title`)}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-gray-900 text-sm">{content[`feature${num}_title`]}</span>
                                <button
                                  onClick={() => handleContentEdit(`feature${num}_title`, content[`feature${num}_title`])}
                                  className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Description
                            </label>
                            {editingContent[`feature${num}_description`] !== undefined ? (
                              <div className="space-y-2">
                                <textarea
                                  value={editingContent[`feature${num}_description`]}
                                  onChange={(e) => handleContentEdit(`feature${num}_description`, e.target.value)}
                                  rows={3}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => saveContent(`feature${num}_description`)}
                                    disabled={contentSaving[`feature${num}_description`]}
                                    className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 disabled:opacity-50"
                                  >
                                    {contentSaving[`feature${num}_description`] ? 'Saving...' : 'Save'}
                                  </button>
                                  <button
                                    onClick={() => cancelContentEdit(`feature${num}_description`)}
                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between p-2 bg-gray-50 rounded-md">
                                <span className="text-gray-900 text-sm">{content[`feature${num}_description`]}</span>
                                <button
                                  onClick={() => handleContentEdit(`feature${num}_description`, content[`feature${num}_description`])}
                                  className="text-primary-600 hover:text-primary-700 text-xs font-medium ml-2"
                                >
                                  Edit
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
