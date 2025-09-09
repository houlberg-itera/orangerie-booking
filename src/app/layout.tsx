import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Orangerie Booking',
  description: 'Book your perfect event space in our beautiful orangerie',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
          {children}
        </main>
        
        <footer className="bg-white border-t border-gray-200">
          <div className="container max-w-7xl mx-auto py-8">
            <div className="text-center text-gray-600">
              <p>&copy; 2025 Orangerie Booking. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
