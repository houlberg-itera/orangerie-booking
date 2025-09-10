-- Make email, phone, and guest_count optional in bookings table
-- Run this script in your Supabase SQL editor

-- Make email optional (allow NULL)
ALTER TABLE bookings 
ALTER COLUMN email DROP NOT NULL;

-- Make phone optional (already nullable, but ensure it)
ALTER TABLE bookings 
ALTER COLUMN phone DROP NOT NULL;

-- Make guest_count optional (allow NULL)
ALTER TABLE bookings 
ALTER COLUMN guest_count DROP NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('email', 'phone', 'guest_count')
ORDER BY column_name;
