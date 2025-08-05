# 🔧 Supabase Setup & Troubleshooting Guide

## Current Issue
The application is failing to create user accounts due to email validation and RLS policy issues in Supabase.

## Step 1: Fix Email Validation Settings

### Option A: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Scroll down to **Email Auth**
5. **Uncheck** "Enable email confirmations"
6. Click **Save**

### Option B: Allow Test Emails

1. In the same **Authentication** → **Settings** page
2. Scroll down to **Email Templates**
3. Click on **Confirm signup** template
4. Make sure the template is properly configured
5. Or add `example.com` to allowed email domains

## Step 2: Fix RLS Policies

The Row Level Security policies need to be updated to allow user creation. You have two options:

### Option A: Simple Fix (Recommended for Quick Testing)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `scripts/fix-rls-simple.sql`
5. Click **Run**

This fixes only the users table policies, which is sufficient for basic authentication.

### Option B: Complete Fix (Recommended for Production)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Create a new query
4. Copy and paste the contents of `scripts/fix-rls.sql`
5. Click **Run**

This fixes all table policies with performance optimizations.

## Step 3: Test the Fix

After making these changes, test the application:

```bash
# Test Supabase connection
npm run test-supabase

# Test user creation
npm run test-user-creation

# Check table structure and RLS
npm run check-table
```

## Step 4: Test in the Application

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000/signup

3. Try creating an account with a real email address

## Performance Optimization

The updated RLS policies include performance optimizations:

- **Simple policies**: For the users table, simple `auth.uid() = id` policies are efficient
- **Complex policies**: For other tables, subqueries `(SELECT auth.uid())` prevent re-evaluation
- **Minimal impact**: The performance warning should be resolved

## Alternative: Quick Fix for Development

If you want to quickly test the application without email confirmation:

1. **Disable email confirmation** in Supabase Auth settings
2. **Run the simple RLS fix** (`scripts/fix-rls-simple.sql`)
3. **Test user creation** with the test script

## Production Considerations

For production, you should:

1. **Enable email confirmation** for security
2. **Configure proper email templates**
3. **Set up a real email service** (SendGrid, etc.)
4. **Use the complete RLS fix** (`scripts/fix-rls.sql`)
5. **Test the full authentication flow**

## Troubleshooting

### If you still get "Email is invalid" errors:

1. Check your Supabase project's email settings
2. Make sure you're using a real email domain
3. Try with a Gmail or other common email address

### If you get RLS policy errors:

1. Run the RLS fix script again
2. Check that all policies were created successfully
3. Verify the user has the correct permissions

### If you get performance warnings:

1. The updated scripts should resolve performance issues
2. Simple policies for users table are efficient
3. Complex policies use subqueries to prevent re-evaluation

### If the application still doesn't work:

1. Check the browser console for specific errors
2. Run the test scripts to isolate the issue
3. Check Supabase logs in the dashboard

## Next Steps

Once authentication is working:

1. **Test the full flow**: Signup → Login → Dashboard
2. **Create test data**: Add some patients and exercises
3. **Test the dashboards**: Verify patient and provider views work
4. **Customize the application**: Modify for your specific needs

## Need Help?

- Check the Supabase documentation: https://supabase.com/docs
- Look at the application logs in the browser console
- Run the test scripts to identify specific issues
- Check the Supabase dashboard for error logs 