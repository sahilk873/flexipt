-- Enable RLS on provider_profiles table
ALTER TABLE public.provider_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for provider_profiles
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
-- Allow patientxs to insert their own record during signup
CREATE POLICY "Patients can insert their own record" ON public.patients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow patients to view their own record
CREATE POLICY "Patients can view their own record" ON public.patients
  FOR SELECT USING (auth.uid() = user_id); 