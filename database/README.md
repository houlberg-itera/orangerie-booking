# Database Setup for Orangerie Booking System

## Files in this directory:

### `setup.sql`
Complete database setup script for new installations. Includes:
- Creates `bookings` table for reservation data
- Creates `site_content` table for editable homepage content
- Sets up proper Row Level Security (RLS) policies
- Adds default content values
- Creates indexes for performance

### `fix-rls.sql`
Quick fix script for existing databases showing "unrestricted" warnings:
- Removes overly permissive policies
- Adds specific, secure policies for each operation
- Verifies RLS configuration

## How to use:

### For new setup:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire contents of `setup.sql`
4. Click "Run"

### For fixing "unrestricted" warnings:
1. Go to your Supabase dashboard
2. Navigate to SQL Editor  
3. Copy and paste the entire contents of `fix-rls.sql`
4. Click "Run"

## Security Policies Explained:

### Bookings Table:
- **Public can create bookings** - Allows website visitors to submit bookings
- **Public can read bookings** - Needed for availability checking
- **Admin can update/delete** - Allows admin management (currently unrestricted, should be limited to authenticated admins in production)

### Site Content Table:
- **Public can read content** - Allows website to display editable content
- **Admin can update content** - Allows content management (currently unrestricted, should be limited to authenticated admins in production)

## Production Security Note:
For production use, you should implement proper authentication and restrict admin operations to authenticated admin users only. The current setup allows any API call to perform admin operations, which is suitable for development but not for production.

## Troubleshooting:

If you see "unrestricted" warnings in Supabase:
1. Run the `fix-rls.sql` script
2. Check that RLS is enabled on both tables
3. Verify policies are properly created

If the application stops working after applying security policies:
1. Check the API error logs in Vercel
2. Ensure all required policies are in place
3. Test the `/api/health` endpoint to verify database connectivity
