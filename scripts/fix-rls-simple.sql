-- Simple RLS fix for user creation (performance optimized)
-- Run this in your Supabase SQL Editor

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create simple, efficient policies for users table
-- These policies are simple enough that auth.uid() performance is not an issue
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- For other tables, use the performance-optimized version from fix-rls.sql
-- The users table policies above are simple and efficient
-- The complex tables (patients, exercise_sessions, etc.) should use the full fix-rls.sql script

-- Verify the users table policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname; 