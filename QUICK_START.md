# 🚀 Quick Start - Cine Repara Local Testing

## TL;DR - 5 Minutes to Running App

```bash
# 1. Install dependencies
npm install

# 2. Setup environment (edit with your database credentials)
cp .env.example .env.local
nano .env.local  # Add your Vercel Postgres credentials

# 3. Run database migrations
npm run db:migrate

# 4. Start development server
npm run dev

# 5. Open browser
open http://localhost:3000
```

## 📋 Prerequisites

- **Node.js** 20+ installed
- **npm** or **yarn**
- **Vercel Postgres** database (or local PostgreSQL)
- **Code editor** (VS Code recommended)

## 🎯 Step-by-Step Setup

### Step 1: Get Vercel Postgres Database

**Option A - Vercel Cloud (Easiest)**

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose "Europe" region
5. Copy the connection strings

You'll get something like:
```bash
POSTGRES_URL="postgres://default:xxx@xxx-pooler.postgres.vercel-storage.com:5432/verceldb"
```

**Option B - Local PostgreSQL**

```bash
# Install PostgreSQL
brew install postgresql@15  # macOS
sudo apt install postgresql # Linux

# Start PostgreSQL
brew services start postgresql  # macOS

# Create database
createdb cine_repara

# Connection string
POSTGRES_URL="postgresql://localhost:5432/cine_repara"
```

### Step 2: Configure Environment

Edit `.env.local`:

```bash
# From Vercel Dashboard → Storage → Your Database → .env.local tab
POSTGRES_URL="your-pooled-connection-string"
POSTGRES_PRISMA_URL="your-prisma-connection-string"
POSTGRES_URL_NON_POOLING="your-direct-connection-string"

# Authentication (generate secret with: openssl rand -base64 32)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-here"

# File storage (optional for local dev)
BLOB_READ_WRITE_TOKEN=""

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Step 3: Initialize Database

```bash
# Run all migrations in correct order
npm run db:migrate
```

Expected output:
```
🚀 Starting database migrations...

📄 Running: 001_initial_schema.sql
✅ Completed: 001_initial_schema.sql

📄 Running: 002_seed_categories.sql
✅ Completed: 002_seed_categories.sql

📄 Running: 003_seed_locations.sql
✅ Completed: 003_seed_locations.sql

🎉 All migrations completed successfully!
```

### Step 4: Start Development Server

```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.1.1 (Turbopack)
- Local:        http://localhost:3000
- Environments: .env.local

✓ Starting...
✓ Ready in 1234ms
```

### Step 5: Test in Browser

Open **http://localhost:3000**

You should see:
- ✅ Homepage with "Cine Repara" title
- ✅ "Găsește Instalatori" button
- ✅ "Înregistrare Instalator" button
- ✅ Clean, responsive layout

## 🧪 Quick Test Scenario

### 1. Create Installer Account

1. Click "Înregistrare Instalator"
2. Fill form:
   ```
   Nume: Test Instalator
   Email: test@installer.com
   Password: TestPass123
   Confirm: TestPass123
   Phone: 0712345678
   ```
3. Click "Înregistrare"
4. You're logged in → Dashboard

### 2. Complete Installer Profile

**Step 1 - Business Info**:
```
Business Name: Instalații Profesionale SRL
Bio: Specialist instalații termice și sanitare cu 15 ani experiență
Years: 15
Hourly Rate Min: 150
Hourly Rate Max: 250
```

**Step 2 - Services**:
- ✅ Select "Instalații Termice"
- ✅ Select "Instalații Sanitare"

**Step 3 - Service Areas**:
- Region: București
- Cities: Sector 1, Sector 2, Sector 3

**Step 4 - Review & Submit**:
- ✅ Check "Sunt de acord..."
- Click "Publică Profil"

### 3. View Public Profile

1. Go to http://localhost:3000/instalatori
2. You should see your installer card
3. Click on card → Public profile page
4. Verify all info displays correctly

### 4. Create Customer & Review

1. Logout
2. Register as customer:
   ```
   Nume: Test Client
   Email: test@customer.com
   Password: TestPass123
   ```
3. Go to installer profile
4. Leave a review:
   ```
   Rating: 5 stars
   Title: Excelent!
   Comment: Foarte profesionist și prompt.
   Service: Instalații Termice
   Date: 2024-12-01
   ```

## 🎯 Feature Testing Checklist

Quick checklist to verify everything works:

```bash
# Homepage
✅ http://localhost:3000

# Auth
✅ /login - Login page
✅ /register/customer - Customer registration
✅ /register/installer - Installer registration

# Dashboards (require login)
✅ /dashboard/customer - Customer dashboard
✅ /dashboard/installer - Installer dashboard
✅ /dashboard/installer/profile - Profile wizard

# Public pages
✅ /instalatori - Browse installers
✅ /instalatori/[slug] - Installer profile
✅ /servicii/instalatii-termice - Service category

# Special pages
✅ /sitemap.xml - Dynamic sitemap
✅ /robots.txt - Robots file
✅ /random-404 - 404 page
```

## 🧪 Run Tests

```bash
# Unit tests (should pass 69/69)
npm test -- --run

# UI dashboard (interactive)
npm run test:ui

# Coverage report
npm run test:coverage
open coverage/index.html
```

## 🐛 Troubleshooting

### Problem: Database connection errors

**Check**:
```bash
# Verify .env.local exists and has correct credentials
cat .env.local | grep POSTGRES_URL

# Test connection by running migrations again
npm run db:migrate
```

### Problem: Port 3000 already in use

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Or use different port
PORT=3001 npm run dev
```

### Problem: "Module not found" errors

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json .next
npm install
```

### Problem: Migrations fail

**Solution**:
```bash
# Verify database is accessible
psql $POSTGRES_URL -c "SELECT 1;"

# Drop and recreate database (WARNING: loses data)
# Then run migrations again
npm run db:migrate
```

## 📚 Additional Resources

- **Full Testing Checklist**: See `LOCAL_TESTING_CHECKLIST.md`
- **Testing Guide**: See `TESTING.md`
- **Project Documentation**: See `CLAUDE.md`
- **Phase Summaries**: See `PHASE*.md` files

## 🎉 Success!

If you can:
- ✅ Create installer and customer accounts
- ✅ Complete installer profile (4-step wizard)
- ✅ See installer in browse page
- ✅ Leave a review as customer
- ✅ All 69 tests passing

**Your local environment is working perfectly!** 🚀

## 🚢 Next Steps

1. **Explore Features**: Test search, filters, different service categories
2. **Add More Data**: Create multiple installers, reviews
3. **Customize**: Modify UI, add features
4. **Deploy**: Push to Vercel for production
5. **Share**: Get feedback from real users

---

**Need Help?**
- Check `LOCAL_TESTING_CHECKLIST.md` for detailed testing scenarios
- Review `TESTING.md` for testing best practices
- Open an issue if you find bugs

**Happy Coding!** 💻✨
