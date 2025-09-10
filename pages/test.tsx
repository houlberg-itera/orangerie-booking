import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Head>
        <title>Orangerie Booking System - Test</title>
        <meta name="description" content="Beautiful orangerie booking system for events and parties" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-emerald-800 mb-4">
            🍊 The Orangerie
          </h1>
          <p className="text-xl text-emerald-600 max-w-2xl mx-auto">
            Beautiful venue for weddings, parties, and special events
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ✅ System Status Test
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Next.js Application: Running</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-green-500 mr-2">✅</span>
              <span>Tailwind CSS: Working</span>
            </div>
            
            <div className="flex items-center">
              <span className="text-blue-500 mr-2">🔄</span>
              <span>Testing Supabase Connection...</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">
              <strong>Next Step:</strong> If this page loads correctly, we can test the database connection.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
