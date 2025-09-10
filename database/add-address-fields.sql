-- Add address fields to bookings table
-- Run this script in your Supabase SQL editor to add required address fields

ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS street_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS street_number VARCHAR(20);

-- Update the table to make these fields required (set NOT NULL constraint)
-- Note: This will only work if the table is empty or all existing rows have values
-- If you have existing data, you'll need to add default values first

-- For existing installations with data, uncomment and run these lines first:
-- UPDATE bookings SET street_name = 'Unknown' WHERE street_name IS NULL;
-- UPDATE bookings SET street_number = '0' WHERE street_number IS NULL;

-- Then make the fields required:
ALTER TABLE bookings 
ALTER COLUMN street_name SET NOT NULL,
ALTER COLUMN street_number SET NOT NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
AND column_name IN ('street_name', 'street_number');
