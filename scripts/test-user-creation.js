#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🧪 Testing User Creation...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testUserCreation() {
  try {
    // Use a more realistic email
    const testEmail = `test-${Date.now()}@example.com`
    
    // First, let's try to sign up a test user
    console.log('1. Testing auth signup...')
    console.log('Using email:', testEmail)
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          full_name: 'Test User',
          role: 'patient',
        },
      },
    })

    if (authError) {
      console.log('❌ Auth signup failed:', authError.message)
      
      if (authError.message.includes('Email')) {
        console.log('\n💡 Email validation issue detected!')
        console.log('This might be due to:')
        console.log('1. Email confirmation is required in Supabase')
        console.log('2. Email validation rules are too strict')
        console.log('3. Supabase project settings need adjustment')
        console.log('\nTo fix this:')
        console.log('1. Go to your Supabase dashboard')
        console.log('2. Navigate to Authentication > Settings')
        console.log('3. Check "Enable email confirmations" setting')
        console.log('4. Or disable email confirmations for testing')
      }
      return
    }

    console.log('✅ Auth signup successful')
    console.log('User ID:', authData.user?.id)
    console.log('Session:', authData.session ? 'Created' : 'Not created (email confirmation required)')

    if (!authData.user) {
      console.log('❌ No user data returned')
      return
    }

    // Check if we have a session (email confirmation might be required)
    if (!authData.session) {
      console.log('⚠️  No session created - email confirmation might be required')
      console.log('Check your Supabase Authentication settings')
      return
    }

    // Now try to create the user profile
    console.log('2. Testing user profile creation...')
    
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: testEmail,
        full_name: 'Test User',
        role: 'patient',
      })
      .select()
      .single()

    if (profileError) {
      console.log('❌ Profile creation failed:', profileError.message)
      console.log('Error details:', {
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint
      })
      
      // Check if it's an RLS policy issue
      if (profileError.message.includes('new row violates row-level security policy')) {
        console.log('\n💡 This is an RLS policy issue!')
        console.log('Please run the fix-rls.sql script in your Supabase SQL Editor')
      }
    } else {
      console.log('✅ Profile creation successful:', profileData)
    }

    // Clean up - delete the test user
    console.log('3. Cleaning up test user...')
    await supabase.auth.signOut()
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

testUserCreation() 