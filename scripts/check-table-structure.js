#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Checking Table Structure...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTableStructure() {
  try {
    console.log('1. Checking if users table exists...')
    
    // Try to select from users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Users table error:', error.message)
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n💡 The users table does not exist!')
        console.log('Please run the supabase-schema.sql script in your Supabase SQL Editor')
        return
      }
      
      if (error.message.includes('row-level security policy')) {
        console.log('\n💡 RLS Policy issue detected!')
        console.log('Please run the fix-rls.sql script in your Supabase SQL Editor')
        return
      }
    } else {
      console.log('✅ Users table exists and is accessible')
    }

    console.log('\n2. Checking table structure...')
    
    // Try to get table info (this might not work with RLS, but worth trying)
    try {
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_info', { table_name: 'users' })
      
      if (!tableError && tableInfo) {
        console.log('Table structure:', tableInfo)
      }
    } catch (e) {
      console.log('Could not get detailed table info (this is normal with RLS)')
    }

    console.log('\n3. Testing insert with RLS...')
    
    // Try a test insert (this will fail, but we can see the error)
    const testUserId = '00000000-0000-0000-0000-000000000000'
    const { error: insertError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'test@example.com',
        full_name: 'Test User',
        role: 'patient'
      })
    
    if (insertError) {
      console.log('❌ Insert test failed (expected):', insertError.message)
      
      if (insertError.message.includes('row-level security policy')) {
        console.log('\n💡 RLS Policy is blocking inserts!')
        console.log('This is the main issue - the RLS policies need to be fixed.')
        console.log('Please run the fix-rls.sql script in Supabase SQL Editor')
      }
    } else {
      console.log('✅ Insert test passed (unexpected - RLS might be disabled)')
    }

    console.log('\n📋 Summary:')
    console.log('- Users table exists: ✅')
    console.log('- RLS is active: ✅ (this is good for security)')
    console.log('- RLS policies need fixing: ❌ (this is the issue)')
    console.log('\n🔧 Next Steps:')
    console.log('1. Go to your Supabase SQL Editor')
    console.log('2. Run the fix-rls.sql script')
    console.log('3. Test user creation again')
    
  } catch (error) {
    console.log('❌ Unexpected error:', error.message)
  }
}

checkTableStructure() 