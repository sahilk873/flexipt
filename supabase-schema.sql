-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT CHECK (role IN ('provider', 'patient')) NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create provider_profiles table
CREATE TABLE public.provider_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  specialties TEXT[],
  credentials TEXT,
  experience_years INTEGER,
  availability JSONB,
  max_patients INTEGER DEFAULT 50,
  rating DECIMAL(3,2),
  bio TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE public.patients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  provider_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  diagnosis TEXT NOT NULL,
  program_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed', 'paused')) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE public.exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  body_region TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')) NOT NULL,
  video_url TEXT,
  thumbnail_url TEXT,
  instructions TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps INTEGER NOT NULL,
  duration INTEGER, -- in seconds
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create exercise_sessions table
CREATE TABLE public.exercise_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  form_score INTEGER CHECK (form_score >= 0 AND form_score <= 100),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  notes TEXT,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress table
CREATE TABLE public.progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  metric_name TEXT NOT NULL,
  current_value DECIMAL NOT NULL,
  target_value DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patient_exercises table (assigns exercises to patients)
CREATE TABLE public.patient_exercises (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id) ON DELETE CASCADE NOT NULL,
  assigned_by UUID REFERENCES public.users(id) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(patient_id, exercise_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_exercises ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for patients
CREATE POLICY "Providers can view their patients" ON public.patients
  FOR SELECT USING (
    auth.uid() = provider_id OR 
    auth.uid() = user_id
  );

CREATE POLICY "Providers can manage their patients" ON public.patients
  FOR ALL USING (auth.uid() = provider_id);

-- RLS Policies for exercises
CREATE POLICY "Everyone can view exercises" ON public.exercises
  FOR SELECT USING (true);

CREATE POLICY "Providers can manage exercises" ON public.exercises
  FOR ALL USING (
    auth.uid() = created_by OR 
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'provider'
  );

-- RLS Policies for exercise_sessions
CREATE POLICY "Users can view their own sessions" ON public.exercise_sessions
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id) OR
    auth.uid() = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

CREATE POLICY "Patients can create their own sessions" ON public.exercise_sessions
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id)
  );

-- RLS Policies for progress
CREATE POLICY "Users can view their own progress" ON public.progress
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id) OR
    auth.uid() = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

CREATE POLICY "Providers can manage progress" ON public.progress
  FOR ALL USING (
    auth.uid() = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

-- RLS Policies for patient_exercises
CREATE POLICY "Users can view their assigned exercises" ON public.patient_exercises
  FOR SELECT USING (
    auth.uid() = (SELECT user_id FROM public.patients WHERE id = patient_id) OR
    auth.uid() = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

CREATE POLICY "Providers can manage patient exercises" ON public.patient_exercises
  FOR ALL USING (
    auth.uid() = (SELECT provider_id FROM public.patients WHERE id = patient_id)
  );

-- Create indexes for better performance
CREATE INDEX idx_patients_provider_id ON public.patients(provider_id);
CREATE INDEX idx_patients_user_id ON public.patients(user_id);
CREATE INDEX idx_exercise_sessions_patient_id ON public.exercise_sessions(patient_id);
CREATE INDEX idx_exercise_sessions_exercise_id ON public.exercise_sessions(exercise_id);
CREATE INDEX idx_progress_patient_id ON public.progress(patient_id);
CREATE INDEX idx_patient_exercises_patient_id ON public.patient_exercises(patient_id);

-- Insert sample data
INSERT INTO public.exercises (name, description, category, body_region, difficulty, instructions, sets, reps) VALUES
('Knee Extension', 'Strengthen quadriceps and improve knee stability', 'Strength', 'Knee', 'beginner', 'Sit on a chair with your back straight. Slowly extend your knee until your leg is straight, then slowly lower it back down. Keep your movements controlled.', 3, 12),
('Hamstring Stretch', 'Improve hamstring flexibility and range of motion', 'Mobility', 'Knee', 'beginner', 'Sit on the floor with one leg extended and the other bent. Lean forward from your hips until you feel a stretch in your hamstring. Hold for 30 seconds.', 2, 30),
('Quad Strengthening', 'Build strength in the quadriceps muscles', 'Strength', 'Knee', 'intermediate', 'Stand with your feet shoulder-width apart. Slowly lower into a squat position, keeping your knees behind your toes. Hold for 2 seconds, then return to standing.', 3, 10),
('Shoulder External Rotation', 'Improve shoulder mobility and strength', 'Mobility', 'Shoulder', 'beginner', 'Hold a resistance band with your elbow bent at 90 degrees. Rotate your forearm outward against the resistance. Control the movement back to starting position.', 3, 15),
('Hip Abduction', 'Strengthen hip abductor muscles', 'Strength', 'Hip', 'beginner', 'Lie on your side with your legs stacked. Lift your top leg up and away from your body, keeping it straight. Lower back down with control.', 3, 12),
('Ankle Dorsiflexion', 'Improve ankle mobility and flexibility', 'Mobility', 'Ankle', 'beginner', 'Sit with your legs extended. Point your toes toward your shin, then flex them away. Repeat this movement slowly and controlled.', 3, 20);

-- Sample provider and patient data
INSERT INTO public.users (id, email, full_name, role) VALUES
('00000000-0000-0000-0000-000000000001', 'drsarah@example.com', 'Dr. Sarah Johnson', 'provider'),
('00000000-0000-0000-0000-000000000002', 'john@example.com', 'John Smith', 'patient');

INSERT INTO public.provider_profiles (user_id, specialties, credentials, experience_years, availability, max_patients, rating, bio, location) VALUES
('00000000-0000-0000-0000-000000000001', ARRAY['Orthopedic'], 'PT, DPT', 10, '{}'::jsonb, 50, 4.9, 'Orthopedic specialist with 10 years of experience.', 'New York');

INSERT INTO public.patients (user_id, provider_id, diagnosis, program_name, start_date, status) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Knee injury', 'Knee Rehab', NOW(), 'active');

INSERT INTO public.exercise_sessions (patient_id, exercise_id, form_score, pain_level) VALUES
((SELECT id FROM public.patients LIMIT 1), (SELECT id FROM public.exercises LIMIT 1), 80, 3);

INSERT INTO public.progress (patient_id, metric_name, current_value, target_value, unit) VALUES
((SELECT id FROM public.patients LIMIT 1), 'Strength', 50, 100, 'reps');