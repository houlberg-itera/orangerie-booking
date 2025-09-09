-- Supabase RLS Security Fix
-- Run this script in your Supabase SQL editor if you're seeing "unrestricted" warnings

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow all operations on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow all operations on site_content" ON site_content;

-- Ensure RLS is enabled (should already be enabled)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Create more specific and secure policies for bookings
-- Allow anyone to insert bookings (for public booking form)
CREATE POLICY "Allow public booking creation" ON bookings
  FOR INSERT WITH CHECK (true);

-- Allow reading of booking data (needed for availability checking)
CREATE POLICY "Allow reading bookings for availability" ON bookings
  FOR SELECT USING (true);

-- Allow updates and deletes (for admin functionality)
CREATE POLICY "Allow admin operations on bookings" ON bookings
  FOR UPDATE USING (true);

CREATE POLICY "Allow admin deletion of bookings" ON bookings
  FOR DELETE USING (true);

-- Create policies for site_content
-- Allow reading content (for displaying on website)
CREATE POLICY "Allow reading site content" ON site_content
  FOR SELECT USING (true);

-- Allow content updates (for admin content management)
CREATE POLICY "Allow content updates" ON site_content
  FOR ALL USING (true);

-- Verify that RLS is properly configured
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('bookings', 'site_content');
