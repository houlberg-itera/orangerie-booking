# Deployment Guide for Orangerie Booking System

This guide covers how to deploy your Orangerie Booking System to various free hosting platforms.

## 🚀 Option 1: Vercel (Recommended)

Vercel is the best choice for Next.js applications and offers excellent free hosting.

### Steps:

1. **Prepare your repository:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Vercel will automatically detect Next.js and configure deployment
   - Click "Deploy"

3. **Your app will be live at:** `https://your-project-name.vercel.app`

### Benefits:
- ✅ Free forever
- ✅ Automatic deployments from GitHub
- ✅ Built-in CDN and edge functions
- ✅ Perfect Next.js integration

---

## 🌐 Option 2: Netlify

Great for static sites and serverless functions.

### Steps:

1. **Build your app:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Choose your repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

3. **Your app will be live at:** `https://random-name.netlify.app`

### Benefits:
- ✅ Free hosting
- ✅ Form handling
- ✅ Easy custom domains

---

## 🔧 Option 3: Render

Good for both static sites and web services.

### Steps:

1. **Deploy to Render:**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Click "New +" → "Static Site"
   - Connect your repository
   - Settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Create Static Site"

2. **Your app will be live at:** `https://your-app-name.onrender.com`

### Benefits:
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Git-based deployments

---

## 📱 Option 4: GitHub Pages (Static Export)

For a completely static version (no API routes).

### Steps:

1. **Add export script to package.json:**
   ```json
   {
     "scripts": {
       "export": "next build && next export"
     }
   }
   ```

2. **Export static files:**
   ```bash
   npm run export
   ```

3. **Deploy to GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages"
   - Source: "Deploy from a branch"
   - Branch: `gh-pages` or `main`
   - Folder: `/out` (or root)

4. **Your app will be live at:** `https://username.github.io/repository-name`

### Note:
- ❌ No API routes (backend functionality will be disabled)
- ✅ Completely free
- ✅ Fast CDN delivery

---

## 🔒 Environment Variables

For production deployments, you'll need to set environment variables:

### Vercel:
1. Go to your project dashboard
2. Settings → Environment Variables
3. Add your variables:
   ```
   DATABASE_URL=your_database_url
   SMTP_HOST=your_email_host
   SMTP_USER=your_email_user
   SMTP_PASS=your_email_password
   ```

### Netlify:
1. Site settings → Environment variables
2. Add your variables

### Render:
1. Dashboard → Environment
2. Add environment variables

---

## 📧 Adding Email Notifications

To enable email notifications, you can use:

### 1. EmailJS (Easiest - Frontend only)
```bash
npm install emailjs-com
```

### 2. SendGrid (Backend)
```bash
npm install @sendgrid/mail
```

### 3. Nodemailer (Backend)
```bash
npm install nodemailer
```

---

## 🗄️ Adding a Database

### Supabase (Recommended - Free)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and create your tables:
   ```sql
   CREATE TABLE bookings (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(255) NOT NULL,
     event_date DATE NOT NULL,
     status VARCHAR(20) DEFAULT 'pending',
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```
4. Get your connection details and add to environment variables

### PlanetScale (Free MySQL)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a database
3. Get connection string

### MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create a cluster
3. Get connection string

---

## 🔍 Monitoring and Analytics

### Free Options:

1. **Vercel Analytics** (if using Vercel)
2. **Google Analytics** - Add to `_document.tsx`
3. **Plausible** - Privacy-friendly alternative

---

## 🚀 Performance Tips

1. **Optimize images:** Use Next.js Image component
2. **Bundle analysis:** `npm install @next/bundle-analyzer`
3. **Lighthouse scores:** Test with Chrome DevTools

---

## 📞 Support

If you need help with deployment:

1. Check the platform's documentation
2. Look at the deployment logs
3. Ensure all dependencies are in `package.json`
4. Verify Node.js version compatibility

Happy deploying! 🎉
