// Test script to verify signup functionality
// Run this with: node scripts/test-signup.js

const { createClient } = require('@supabase/supabase-js')

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSignup() {
  console.log('Testing signup functionality...')
  
  // Test provider signup
  console.log('\n1. Testing provider signup...')
  const providerEmail = `test-provider-${Date.now()}@example.com`
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: providerEmail,
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test Provider',
          role: 'provider',
        },
      },
    })

    if (authError) {
      console.error('Provider auth signup failed:', authError)
      return
    }

    console.log('Provider auth signup successful')

    // Check if provider profile was created
    const { data: providerProfile, error: profileError } = await supabase
      .from('provider_profiles')
      .select('*')
      .eq('user_id', authData.user.id)
      .single()

    if (profileError) {
      console.error('Provider profile not found:', profileError)
    } else {
      console.log('✅ Provider profile created successfully:', providerProfile)
    }

  } catch (error) {
    console.error('Provider signup test failed:', error)
  }

  // Test patient signup
  console.log('\n2. Testing patient signup...')
  const patientEmail = `test-patient-${Date.now()}@example.com`
  
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: patientEmail,
      password: 'testpassword123',
      options: {
        data: {
          full_name: 'Test Patient',
          role: 'patient',
        },
      },
    })

    if (authError) {
      console.error('Patient auth signup failed:', authError)
      return
    }

    console.log('Patient auth signup successful')

    // Check if patient record exists (should not exist initially)
    const { data: patientRecord, error: recordError } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', authData.user.id)
      .maybeSingle()

    if (recordError) {
      console.error('Error checking patient record:', recordError)
    } else if (patientRecord) {
      console.log('⚠️ Patient record exists (should not exist initially):', patientRecord)
    } else {
      console.log('✅ Patient record correctly not created during signup')
    }

  } catch (error) {
    console.error('Patient signup test failed:', error)
  }

  console.log('\nTest completed!')
}

testSignup().catch(console.error) 