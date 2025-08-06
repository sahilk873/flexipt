import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'provider' | 'patient'
  created_at: string
  avatar_url?: string
}

export interface Patient {
  id: string
  user_id: string
  provider_id: string
  diagnosis: string
  program_name: string
  start_date: string
  status: 'active' | 'completed' | 'paused'
  notes?: string
}

export interface Exercise {
  id: string
  name: string
  description: string
  category: string
  body_region: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  video_url?: string
  thumbnail_url?: string
  instructions: string
  sets: number
  reps: number
  duration?: number
  created_at: string
}

export interface ExerciseSession {
  id: string
  patient_id: string
  exercise_id: string
  completed_at: string
  form_score: number
  pain_level: number
  notes?: string
  video_url?: string
}

export interface Progress {
  id: string
  patient_id: string
  metric_name: string
  current_value: number
  target_value: number
  unit: string
  recorded_at: string
}

export interface PatientExercise {
  id: string
  patient_id: string
  exercise_id: string
  assigned_by: string
  assigned_at: string
  is_active: boolean
  sets: number
  reps: number
}

export interface ProviderProfile {
  id: string
  user_id: string
  specialties: string[]
  credentials: string | null
  experience_years: number | null
  availability: any
  max_patients: number
  rating: number | null
  bio: string | null
  location: string | null
  created_at: string
  users?: User
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
}