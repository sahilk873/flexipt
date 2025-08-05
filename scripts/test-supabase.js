#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT SET')

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n📡 Testing connection...')
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1)
    
    if (error) {
      console.log('❌ Connection failed:', error.message)
      
      if (error.message.includes('relation "users" does not exist')) {
        console.log('\n💡 The users table does not exist!')
        console.log('Please run the SQL schema in your Supabase project:')
        console.log('1. Go to your Supabase dashboard')
        console.log('2. Navigate to SQL Editor')
        console.log('3. Copy and paste the contents of supabase-schema.sql')
        console.log('4. Click "Run"')
      }
      
      return false
    }
    
    console.log('✅ Connection successful!')
    return true
  } catch (error) {
    console.log('❌ Connection error:', error.message)
    return false
  }
}

async function checkTables() {
  console.log('\n📋 Checking tables...')
  
  const tables = ['users', 'patients', 'exercises', 'exercise_sessions', 'progress', 'patient_exercises']
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(1)
      if (error) {
        console.log(`❌ Table '${table}': ${error.message}`)
      } else {
        console.log(`✅ Table '${table}': exists`)
      }
    } catch (error) {
      console.log(`❌ Table '${table}': ${error.message}`)
    }
  }
}

async function main() {
  const connected = await testConnection()
  
  if (connected) {
    await checkTables()
  }
  
  console.log('\n📝 Next steps:')
  if (!connected) {
    console.log('1. Set up your Supabase project')
    console.log('2. Run the database schema')
    console.log('3. Test the connection again')
  } else {
    console.log('1. Your Supabase is properly configured!')
    console.log('2. Try creating an account in the app')
  }
}

main().catch(console.error) 