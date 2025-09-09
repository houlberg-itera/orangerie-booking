# 🚀 Complete Setup Guide for Orangerie Booking System

## Step 1: Set Up Supabase Database (FREE)

### 1.1 Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended)

### 1.2 Create New Project
1. Click "New project"
2. Choose your organization
3. Fill in project details:
   - **Name**: `orangerie-booking`
   - **Database Password**: (save this password!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for setup to complete

### 1.3 Set Up Database Tables
1. In your Supabase dashboard, go to "SQL Editor"
2. Click "New query"
3. Copy and paste the contents of `database/setup.sql`
4. Click "Run" to create your tables

### 1.4 Get Your Credentials
1. Go to Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Public anon key**: `eyJhbGc...`

## Step 2: Configure Your App

### 2.1 Create Environment File
1. Copy `.env.example` to `.env.local`:
   ```bash
   copy .env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 2.2 Test Local Setup
1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Try submitting a booking to test database connection

## Step 3: Deploy to Vercel (FREE)

### 3.1 Prepare for Deployment
1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Push to GitHub:
   ```bash
   # Create repository on GitHub first, then:
   git remote add origin https://github.com/yourusername/orangerie-booking.git
   git branch -M main
   git push -u origin main
   ```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3.3 Add Environment Variables in Vercel
1. In project settings, go to "Environment Variables"
2. Add your environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
   ```
3. Deploy the project

## Step 4: Test Your Live Site

### 4.1 Verify Functionality
1. Visit your Vercel URL (e.g., `https://orangerie-booking.vercel.app`)
2. Test the booking form
3. Check calendar availability
4. Verify bookings appear in Supabase dashboard

### 4.2 Check Supabase Data
1. Go to Supabase → Table Editor → `bookings`
2. Verify new bookings appear here

## Step 5: Optional Enhancements

### 5.1 Custom Domain (Optional)
1. In Vercel project settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions

### 5.2 Email Notifications (Optional)
1. Install Nodemailer:
   ```bash
   npm install nodemailer @types/nodemailer
   ```

2. Add SMTP settings to your environment variables
3. Update API to send confirmation emails

### 5.3 Admin Dashboard (Future Enhancement)
- View all bookings
- Approve/reject requests
- Manage calendar availability

## 🎯 You're Done!

Your Orangerie booking system is now:
- ✅ **Live on the internet** (free hosting)
- ✅ **Connected to a real database** (free PostgreSQL)
- ✅ **Accepting real bookings**
- ✅ **Mobile responsive**
- ✅ **Professional looking**

## 📞 Support

If you encounter any issues:

1. **Database not connecting**: Check environment variables
2. **Build failing**: Check for TypeScript errors
3. **Deployment issues**: Check Vercel deployment logs
4. **General help**: Check the README.md file

## 🔗 Important URLs

- **Your live site**: `https://your-project.vercel.app`
- **Supabase dashboard**: `https://app.supabase.com`
- **Vercel dashboard**: `https://vercel.com/dashboard`
- **GitHub repository**: `https://github.com/yourusername/orangerie-booking`

## 🎉 What's Next?

1. Share your booking site with potential customers
2. Customize the design and content
3. Add more features like photo galleries
4. Set up Google Analytics for visitor tracking
5. Consider adding payment integration

**Congratulations! You now have a professional booking system running completely for free!** 🎊
