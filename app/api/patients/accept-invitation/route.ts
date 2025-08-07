import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { invitationId, patientEmail, patientName } = await request.json()

    if (!invitationId || !patientEmail || !patientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('patient_invitations')
      .select('*')
      .eq('id', invitationId)
      .eq('status', 'pending')
      .single()

    if (invitationError || !invitation) {
      console.error('Error fetching invitation:', invitationError)
      return NextResponse.json({ error: 'Invalid or expired invitation' }, { status: 404 })
    }

    // Verify the email matches
    if (invitation.patient_email.toLowerCase() !== patientEmail.toLowerCase()) {
      return NextResponse.json({ error: 'Email does not match invitation' }, { status: 400 })
    }

    // Get the patient user ID (they should have just signed up)
    const { data: patientUser, error: patientError } = await supabase
      .from('users')
      .select('id')
      .eq('email', patientEmail)
      .eq('role', 'patient')
      .single()

    if (patientError || !patientUser) {
      console.error('Error finding patient user:', patientError)
      return NextResponse.json({ error: 'Patient account not found' }, { status: 404 })
    }

    // Create patient record linking to the provider
    const { error: patientCreateError } = await supabase
      .from('patients')
      .insert({
        user_id: patientUser.id,
        provider_id: invitation.provider_id,
        diagnosis: 'To be determined',
        program_name: invitation.program_name,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active',
      })

    if (patientCreateError) {
      console.error('Error creating patient record:', patientCreateError)
      return NextResponse.json({ error: 'Failed to create patient record' }, { status: 500 })
    }

    // Update invitation status to accepted
    const { error: updateError } = await supabase
      .from('patient_invitations')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', invitationId)

    if (updateError) {
      console.error('Error updating invitation status:', updateError)
      // Don't fail the request if this fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Patient successfully linked to provider',
      patientId: patientUser.id
    })

  } catch (error) {
    console.error('Error in accept invitation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
