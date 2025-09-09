-- Supabase database setup for Orangerie Booking System
-- Run this in your Supabase SQL editor

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  event_type VARCHAR(50) NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site_content table for editable content
CREATE TABLE IF NOT EXISTS site_content (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on event_date for faster availability queries
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);

-- Create an index on status for filtering
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column for bookings
CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON bookings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Create a trigger to automatically update the updated_at column for site_content
CREATE TRIGGER update_site_content_updated_at 
  BEFORE UPDATE ON site_content 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations for now
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations on bookings" ON bookings
  FOR ALL USING (true);

CREATE POLICY "Allow all operations on site_content" ON site_content
  FOR ALL USING (true);

-- Insert default content values
INSERT INTO site_content (key, value) VALUES
  ('hero_title', 'Book Your Perfect Event'),
  ('hero_subtitle', 'Reserve our beautiful orangerie for your special occasions, parties, and gatherings. A stunning venue surrounded by nature.'),
  ('feature1_title', 'Beautiful Venue'),
  ('feature1_description', 'A stunning glass orangerie perfect for weddings, parties, and corporate events.'),
  ('feature2_title', 'Easy Booking'),
  ('feature2_description', 'Simple online booking system with real-time availability checking.'),
  ('feature3_title', 'Full Service'),
  ('feature3_description', 'Complete event support with catering options and event planning assistance.')
ON CONFLICT (key) DO NOTHING;

-- Insert some sample data (optional)
INSERT INTO bookings (name, email, phone, event_type, guest_count, event_date, start_time, end_time, message, status) VALUES
  ('John Doe', 'john@example.com', '+1234567890', 'wedding', 50, '2025-10-15', '14:00', '22:00', 'Wedding reception for 50 guests', 'confirmed'),
  ('Jane Smith', 'jane@example.com', '+1987654321', 'birthday', 25, '2025-09-22', '16:00', '20:00', 'Birthday party celebration', 'confirmed'),
  ('Mike Johnson', 'mike@example.com', NULL, 'corporate', 30, '2025-11-05', '09:00', '17:00', 'Corporate team building event', 'pending');

-- View the table structure
SELECT * FROM bookings LIMIT 5;
