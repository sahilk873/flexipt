-- Fix RLS policies for user creation with performance optimizations
-- Run this in your Supabase SQL Editor

-- First, let's check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'users';

-- Drop existing policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.users;

-- Create new policies with performance optimizations
-- Use subqueries to avoid re-evaluating auth.uid() for each row
CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Fix the patients table policies with performance optimizations
DROP POLICY IF EXISTS "Providers can view their patients" ON public.patients;
DROP POLICY IF EXISTS "Providers can manage their patients" ON public.patients;

CREATE POLICY "Providers can view their patients" ON public.patients
  FOR SELECT USING (
    (SELECT auth.uid()) = provider_id OR 
    (SELECT auth.uid()) = user_id
  );

CREATE POLICY "Providers can manage their patients" ON public.patients
  FOR ALL USING ((SELECT auth.uid()) = provider_id);

-- Fix exercise sessions policies with performance optimizations
DROP POLICY IF EXISTS "Users can view their own sessions" ON public.exercise_sessions;
DROP POLICY IF EXISTS "Patients can create their own sessions" ON public.exercise_sessions;

CREATE POLICY "Users can view their own sessions" ON public.exercise_sessions
  FOR SELECT USING (
    (SELECT auth.uid()) = (SELECT user_id FROM public.patients WHERE id = patient_id) OR
    (SELECT auth.uid()) = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

CREATE POLICY "Patients can create their own sessions" ON public.exercise_sessions
  FOR INSERT WITH CHECK (
    (SELECT auth.uid()) = (SELECT user_id FROM public.patients WHERE id = patient_id)
  );

-- Fix progress policies with performance optimizations
DROP POLICY IF EXISTS "Users can view their own progress" ON public.progress;
DROP POLICY IF EXISTS "Providers can manage progress" ON public.progress;

CREATE POLICY "Users can view their own progress" ON public.progress
  FOR SELECT USING (
    (SELECT auth.uid()) = (SELECT user_id FROM public.patients WHERE id = patient_id) OR
    (SELECT auth.uid()) = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

CREATE POLICY "Providers can manage progress" ON public.progress
  FOR ALL USING (
    (SELECT auth.uid()) = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

-- Fix patient_exercises policies with performance optimizations
DROP POLICY IF EXISTS "Users can view their assigned exercises" ON public.patient_exercises;
DROP POLICY IF EXISTS "Providers can manage patient exercises" ON public.patient_exercises;

CREATE POLICY "Users can view their assigned exercises" ON public.patient_exercises
  FOR SELECT USING (
    (SELECT auth.uid()) = (SELECT user_id FROM public.patients WHERE id = patient_id) OR
    (SELECT auth.uid()) = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

CREATE POLICY "Providers can manage patient exercises" ON public.patient_exercises
  FOR ALL USING (
    (SELECT auth.uid()) = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename IN ('users', 'patients', 'exercise_sessions', 'progress', 'patient_exercises')
ORDER BY tablename, policyname; 