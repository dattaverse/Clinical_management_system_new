# Supabase Setup Guide

## Quick Setup Steps

### 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login with your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: Clinical Management System
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your location
6. Click "Create new project" (takes ~2 minutes)

### 2. Get Your Credentials
Once your project is created:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiI...`)

### 3. Configure Environment Variables
1. Open the `.env` file in your project root
2. Replace the placeholder values:
```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key
```

### 4. Run Database Migrations
Your project already has database migrations. Run them:
```bash
# Install Supabase CLI (if not installed)
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-id

# Push migrations to your database
supabase db push
```

### 5. Test the Connection
1. Save your `.env` file
2. Restart your development server:
```bash
npm run dev
```
3. Check the browser console - you should see "Checking Supabase session..." instead of "Demo mode"

## Database Schema
Your migrations will create these tables:
- `doctors` - Doctor profiles and subscription info
- `clinics` - Clinic locations and details  
- `patients` - Patient records and consent flags
- `appointments` - Appointment scheduling
- `prescriptions` - Prescription management
- `admins` - Admin user management
- `voice_agent_logs` - Voice call logs
- `compliance_reports` - Compliance tracking

## Troubleshooting
- **"Demo mode"** in console = Environment variables not set correctly
- **Build errors** = Check `.env` file syntax (no spaces around `=`)
- **Database errors** = Run migrations with `supabase db push`
- **Auth errors** = Check RLS policies in Supabase dashboard

## Alternative: Use Existing Supabase Project
If you already have a Supabase project:
1. Get your credentials from Settings → API
2. Update `.env` file
3. Run `supabase db push` to apply migrations
