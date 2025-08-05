# 🚀 FlexiPT Setup Guide

## Current Issue
The application is trying to connect to a placeholder Supabase URL, which is causing connection errors. You need to set up a real Supabase project.

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `flexipt-platform` (or any name you prefer)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (2-3 minutes)

## Step 2: Get Your API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Create Environment File

Create a file called `.env.local` in the `flexipt-platform` directory:

```bash
# In the flexipt-platform directory
touch .env.local
```

Add the following content to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace the placeholder values with your actual Supabase credentials.**

## Step 4: Set Up Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL

This will create:
- Users table
- Patients table  
- Exercises table
- Exercise sessions table
- Progress tracking table
- Row Level Security policies
- Sample exercise data

## Step 5: Test the Application

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Visit [http://localhost:3000](http://localhost:3000)

3. Try creating an account:
   - Go to `/signup`
   - Create a test account
   - Verify it works without errors

## Troubleshooting

### If you still get connection errors:

1. **Check your .env.local file**:
   ```bash
   cat .env.local
   ```
   Make sure the URL and key are correct.

2. **Verify Supabase project is active**:
   - Go to your Supabase dashboard
   - Make sure the project status is "Active"

3. **Check the database schema**:
   - Go to **Table Editor** in Supabase
   - You should see tables: `users`, `patients`, `exercises`, etc.

4. **Test the connection**:
   ```bash
   npm run setup
   ```

## Example .env.local file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNjQ5NjAwMCwiZXhwIjoxOTUyMDcyMDAwfQ.example
```

## Next Steps

Once Supabase is configured:

1. **Test Authentication**: Create accounts and log in
2. **Explore Dashboards**: Check out patient and provider views
3. **Add Real Data**: Create patients and assign exercises
4. **Customize**: Modify the application for your needs

## Need Help?

- Check the [README.md](README.md) for more details
- Run `npm run setup` to verify your configuration
- Check the browser console for specific error messages 