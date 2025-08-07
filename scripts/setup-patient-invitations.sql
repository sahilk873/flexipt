-- Patient Invitations Setup Script
-- Run this in your Supabase SQL Editor to add patient invitation functionality

-- Create patient_invitations table
CREATE TABLE IF NOT EXISTS public.patient_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT,
  program_name TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'expired')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for patient_invitations
CREATE POLICY IF NOT EXISTS "Providers can create invitations" ON public.patient_invitations
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY IF NOT EXISTS "Providers can view their invitations" ON public.patient_invitations
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY IF NOT EXISTS "Providers can update their invitations" ON public.patient_invitations
  FOR UPDATE USING (auth.uid() = provider_id);

-- Enable RLS on patient_invitations table
ALTER TABLE public.patient_invitations ENABLE ROW LEVEL SECURITY;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_patient_invitations_provider_id ON public.patient_invitations(provider_id);
CREATE INDEX IF NOT EXISTS idx_patient_invitations_status ON public.patient_invitations(status);

-- Add a comment to the table
COMMENT ON TABLE public.patient_invitations IS 'Stores patient invitations sent by providers';
