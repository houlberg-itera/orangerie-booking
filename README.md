# Orangerie Booking System

A beautiful and modern web application for booking an orangerie venue for events, parties, and gatherings. Built with Next.js, TypeScript, and Tailwind CSS.

![Orangerie Booking Screenshot](https://via.placeholder.com/800x400/22c55e/ffffff?text=Orangerie+Booking+System)

## Features

- 🌟 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 📅 **Availability Calendar**: Interactive calendar showing available dates
- 📋 **Booking Form**: Comprehensive form for event reservations
- 📱 **Mobile Responsive**: Works perfectly on all devices
- ⚡ **Fast Performance**: Built with Next.js for optimal performance
- 🔒 **Type Safety**: Full TypeScript support
- 🚀 **API Routes**: Built-in backend with Next.js API routes

## Tech Stack

- **Frontend**: Next.js 12, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Deployment**: Ready for Vercel, Netlify, or any hosting platform

## Getting Started

### Prerequisites

- Node.js 12.22.0+ (recommended: Node.js 16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd orangerie-booking
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── pages/
│   ├── api/
│   │   └── bookings.ts       # API endpoint for booking management
│   ├── _app.tsx              # App wrapper component
│   ├── _document.tsx         # HTML document structure
│   └── index.tsx             # Homepage
├── src/
│   ├── app/
│   │   └── globals.css       # Global styles with Tailwind
│   └── components/
│       ├── AvailabilityCalendar.tsx  # Interactive calendar component
│       └── BookingForm.tsx           # Booking form component
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies and scripts
```

## Deployment Options

### 1. Vercel (Recommended - FREE)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Deploy with one click
4. Your app will be live with a free `.vercel.app` domain

### 2. Netlify (FREE)

1. Push your code to GitHub
2. Connect your repository to [Netlify](https://netlify.com)
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Deploy

### 3. Render (FREE)

1. Push your code to GitHub
2. Connect your repository to [Render](https://render.com)
3. Choose "Static Site" or "Web Service"
4. Set build command: `npm run build`
5. Deploy

### 4. GitHub Pages (for static export)

Add to package.json:
```json
"scripts": {
  "export": "next build && next export"
}
```

## Backend Integration

Currently, the app uses mock data and console logging. To integrate with a real backend:

### Option 1: Supabase (Recommended - FREE)

1. Create a [Supabase](https://supabase.com) account
2. Create a new project
3. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
4. Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
5. Update the API route to use Supabase

### Option 2: Firebase (FREE)

1. Create a [Firebase](https://firebase.google.com) project
2. Install Firebase:
   ```bash
   npm install firebase
   ```
3. Configure Firebase and update API routes

### Database Schema

```sql
-- Bookings table
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  event_type VARCHAR(50) NOT NULL,
  guest_count INTEGER NOT NULL,
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables

Create a `.env.local` file for production:

```env
# Database
DATABASE_URL=your_database_connection_string

# Email (for notifications)
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password

# App Settings
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Features to Add

- [ ] User authentication and accounts
- [ ] Admin dashboard for managing bookings
- [ ] Email notifications (confirmation, reminders)
- [ ] Payment integration (Stripe, PayPal)
- [ ] Calendar sync (Google Calendar, Outlook)
- [ ] Multiple venue support
- [ ] Photo gallery of the venue
- [ ] Customer testimonials
- [ ] Advanced availability rules
- [ ] Booking cancellation and rescheduling

## API Endpoints

### POST /api/bookings
Create a new booking request

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "eventType": "wedding",
  "guestCount": 50,
  "eventDate": "2025-12-25",
  "startTime": "14:00",
  "endTime": "22:00",
  "message": "Special requirements..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking request submitted successfully",
  "bookingId": "12345"
}
```

### GET /api/bookings
Get existing bookings (for availability checking)

**Response:**
```json
{
  "bookings": [
    {
      "id": "1",
      "date": "2025-09-15",
      "time": "14:00-18:00",
      "status": "confirmed"
    }
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions, suggestions, or support:
- Create an issue on GitHub
- Email: [your-email@example.com](mailto:your-email@example.com)

---

**Built with ❤️ for creating beautiful event experiences**
