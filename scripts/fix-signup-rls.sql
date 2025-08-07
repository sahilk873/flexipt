-- Fix RLS policies for user signup
-- Run this in your Supabase SQL Editor

-- Enable RLS on provider_profiles table (if not already enabled)
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for provider_profiles (if any)
DROP POLICY IF EXISTS "Providers can view their own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can update their own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Providers can insert their own profile" ON public.provider_profiles;
DROP POLICY IF EXISTS "Patients can view provider profiles" ON public.provider_profiles;

-- Create RLS Policies for provider_profiles
CREATE POLICY "Providers can view their own profile" ON public.provider_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Providers can update their own profile" ON public.provider_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers can insert their own profile" ON public.provider_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow patients to view provider profiles (for provider search)
CREATE POLICY "Patients can view provider profiles" ON public.provider_profiles
  FOR SELECT USING (true);

-- Add missing policies for patients table
-- Allow patients to insert their own record when connecting to a provider
CREATE POLICY "Patients can insert their own record" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow patients to view their own record
CREATE POLICY "Patients can view their own record" ON public.patients
  FOR SELECT USING (auth.uid() = user_id);

-- Allow patients to update their own record
CREATE POLICY "Patients can update their own record" ON public.patients
  FOR UPDATE USING (auth.uid() = user_id);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('provider_profiles', 'patients')
ORDER BY tablename, policyname; 