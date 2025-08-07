import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 })
    }

    // Extract the token
    const token = authHeader.replace('Bearer ', '')
    
    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // For now, let's skip the user profile check and just verify the user has provider role in metadata
    console.log('User ID:', user.id)
    console.log('User metadata:', user.user_metadata)
    
    // Check if user has provider role in auth metadata
    const userRole = user.user_metadata?.role
    if (userRole !== 'provider') {
      console.error('User role is not provider:', userRole)
      return NextResponse.json({ error: 'Unauthorized - Provider access required' }, { status: 403 })
    }

    // Ensure the user has a profile in the users table for RLS policies to work
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (userCheckError && userCheckError.code === 'PGRST116') {
      // User doesn't exist, create them
      console.log('Creating user profile for RLS policies...')
      const { error: createUserError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || 'Unknown',
          role: 'provider',
        })

      if (createUserError) {
        console.error('Failed to create user profile for RLS:', createUserError)
        // Continue anyway, the invitation might still work
      } else {
        console.log('User profile created for RLS policies')
      }
    } else if (userCheckError) {
      console.error('Error checking user profile:', userCheckError)
    } else {
      console.log('User profile exists for RLS policies')
    }

    // Parse request body
    const { name, email, phone, program } = await request.json()

    if (!name || !email || !phone || !program) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create a patient invitation record
    console.log('Attempting to create patient invitation with data:', {
      provider_id: user.id,
      patient_name: name,
      patient_email: email,
      patient_phone: phone,
      program_name: program,
      status: 'pending'
    })

    const { data: invitationData, error: invitationError } = await supabase
      .from('patient_invitations')
      .insert({
        provider_id: user.id,
        patient_name: name,
        patient_email: email,
        patient_phone: phone,
        program_name: program,
        status: 'pending',
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (invitationError) {
      console.error('Error creating patient invitation:', invitationError)
      console.error('Error details:', {
        code: invitationError.code,
        message: invitationError.message,
        details: invitationError.details,
        hint: invitationError.hint
      })
      
      // Check for specific error types
      if (invitationError.message?.includes('row-level security policy')) {
        return NextResponse.json({ 
          error: 'Database security policy blocked invitation creation. Please check patient_invitations RLS policies.' 
        }, { status: 500 })
      }
      
      if (invitationError.message?.includes('duplicate key')) {
        return NextResponse.json({ 
          error: 'Invitation already exists for this patient' 
        }, { status: 409 })
      }
      
      return NextResponse.json({ 
        error: 'Failed to create patient invitation: ' + invitationError.message 
      }, { status: 500 })
    }

    // For now, we'll just log the invitation since email sending requires admin privileges
    console.log('Patient invitation created:', {
      invitationId: invitationData.id,
      patientName: name,
      patientEmail: email,
      program: program,
      providerId: user.id
    })

    // TODO: Implement proper email sending
    // For now, we'll simulate success but log that email needs to be configured
    console.log('📧 Email invitation would be sent to:', email)
    console.log('📧 Signup link would be:', `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup?role=patient&invitation=${invitationData.id}&email=${encodeURIComponent(email)}`)

    return NextResponse.json({ 
      success: true, 
      message: 'Patient invitation created successfully. Email functionality needs to be configured.',
      invitationId: invitationData.id,
      signupUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/signup?role=patient&invitation=${invitationData.id}&email=${encodeURIComponent(email)}`
    })

  } catch (error) {
    console.error('Error in patient invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
