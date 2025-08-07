-- Fix Users Table INSERT Policy
-- Run this in your Supabase SQL Editor to allow users to create their own profiles

-- Add INSERT policy for users table
CREATE POLICY IF NOT EXISTS "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users' AND policyname = 'Users can insert their own profile';
