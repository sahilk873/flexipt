# Signup Fix Documentation

## Problem
When users (both patients and healthcare providers) signed up on the website, they were being added to the Supabase `auth.users` table but not to their respective role-specific tables (`provider_profiles` for providers, `patients` for patients).

## Root Cause
1. **Missing RLS Policies**: The `provider_profiles` table didn't have Row Level Security enabled, and there were missing INSERT policies for the `patients` table.
2. **Incomplete Signup Logic**: The signup process only created records in the `users` table but didn't create the corresponding role-specific records.
3. **Provider ID Requirement**: The `patients` table requires a `provider_id`, which created a chicken-and-egg problem during signup.

## Solution

### 1. Fixed Signup Logic (`hooks/use-auth.ts`)
- **Providers**: Now creates both a `users` record and a `provider_profiles` record during signup
- **Patients**: Only creates a `users` record during signup. The `patients` record is created when they connect to a provider.

### 2. Added RLS Policies (`scripts/fix-signup-rls.sql`)
- Enabled RLS on `provider_profiles` table
- Added policies to allow providers to insert/update their own profiles
- Added policies to allow patients to insert/update their own records
- Added policies to allow patients to view provider profiles (for provider search)

### 3. Improved Error Handling
- Better error logging and debugging information
- Graceful handling of patient record creation failures

## Files Modified
1. `hooks/use-auth.ts` - Updated signup logic
2. `scripts/fix-signup-rls.sql` - Added RLS policies
3. `scripts/test-signup.js` - Test script to verify functionality

## How to Apply the Fix

### Step 1: Run the RLS Fix Script
Execute the following SQL in your Supabase SQL Editor:
```sql
-- Run the contents of scripts/fix-signup-rls.sql
```

### Step 2: Test the Fix
Run the test script to verify everything works:
```bash
node scripts/test-signup.js
```

### Step 3: Verify in Your Application
1. Sign up as a provider - should create both `users` and `provider_profiles` records
2. Sign up as a patient - should only create a `users` record
3. Connect a patient to a provider - should create a `patients` record

## Expected Behavior After Fix

### Provider Signup
1. User signs up as provider
2. Record created in `auth.users` (Supabase Auth)
3. Record created in `users` table
4. Record created in `provider_profiles` table

### Patient Signup
1. User signs up as patient
2. Record created in `auth.users` (Supabase Auth)
3. Record created in `users` table
4. **No record created in `patients` table yet**
5. When patient connects to a provider, record is created in `patients` table

## Troubleshooting

### If Provider Profiles Still Aren't Created
1. Check that RLS is enabled on `provider_profiles` table
2. Verify the INSERT policy exists for providers
3. Check browser console for error messages

### If Patient Records Still Aren't Created
1. Check that RLS policies exist for `patients` table
2. Verify the patient is connecting to a valid provider
3. Check browser console for error messages

### Common RLS Errors
- "new row violates row-level security policy" - Missing INSERT policy
- "relation does not exist" - Table not created
- "duplicate key value" - User already exists 