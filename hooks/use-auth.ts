"use client"

import React, { useState, useEffect, createContext, useContext } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string, role: 'provider' | 'patient') => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: { full_name?: string; role?: 'provider' | 'patient'; avatar_url?: string }) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName: string, role: 'provider' | 'patient') => {
    try {
      console.log('Starting signup process...')
      console.log('Email:', email, 'Role:', role)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })

      if (error) {
        console.error('Supabase auth error:', error)
        return { error }
      }

      if (!data.user) {
        console.error('No user data returned from signup')
        return { error: { message: 'No user data returned' } }
      }

      console.log('Auth signup successful, creating user profile...')
      console.log('User ID:', data.user.id)

      // Create user profile in our users table
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: role,
        })
        .select()
        .single()

      if (profileError) {
        console.error('Error creating user profile:', profileError)
        console.error('Profile error details:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          // Add more debugging info
          errorType: typeof profileError,
          errorKeys: Object.keys(profileError),
          fullError: JSON.stringify(profileError, null, 2)
        })
        
        // Check for specific error types
        if (profileError.message?.includes('row-level security policy')) {
          console.error('💡 RLS Policy Error: User creation blocked by security policy')
          console.error('Please run the fix-rls.sql script in Supabase')
        }
        
        if (profileError.message?.includes('duplicate key')) {
          console.error('💡 Duplicate User Error: User already exists')
        }
        
        if (profileError.message?.includes('relation "users" does not exist')) {
          console.error('💡 Table Error: Users table does not exist')
          console.error('Please run the supabase-schema.sql script in Supabase')
        }
        
        return { error: profileError }
      }

      console.log('User profile created successfully:', profileData)

      // Create role-specific profile
      if (role === 'provider') {
        console.log('Creating provider profile...')
        const { data: providerProfile, error: providerError } = await supabase
          .from('provider_profiles')
          .insert({
            user_id: data.user.id,
            specialties: [],
            credentials: '',
            experience_years: 0,
            availability: {},
            max_patients: 50,
            rating: 0,
            bio: '',
            location: ''
          })
          .select()
          .single()

        if (providerError) {
          console.error('Error creating provider profile:', providerError)
          return { error: providerError }
        }

        console.log('Provider profile created successfully:', providerProfile)
      } else if (role === 'patient') {
        console.log('Patient signup successful - patient profile will be created when they connect to a provider')
        // For patients, we don't create a patient record during signup
        // The patient record will be created when they connect to a provider
        // This avoids the provider_id requirement issue
      }

      return { error: null }
    } catch (error) {
      console.error('Unexpected error during signup:', error)
      console.error('Error type:', typeof error)
      console.error('Error keys:', error ? Object.keys(error) : 'No error object')
      return { error: { message: 'Unexpected error during signup', details: error } }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: { message: 'Sign in failed' } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const updateProfile = async (updates: { full_name?: string; role?: 'provider' | 'patient'; avatar_url?: string }) => {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user?.id)

    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 