#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

console.log('🚀 FlexiPT Setup Script')
console.log('========================\n')

// Check if .env.local exists
const envPath = path.join(__dirname, '..', '.env.local')
const envExists = fs.existsSync(envPath)

if (!envExists) {
  console.log('❌ .env.local file not found!')
  console.log('\n📝 Please create a .env.local file in the root directory with:')
  console.log('')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here')
  console.log('')
  console.log('🔗 Get these values from your Supabase project dashboard:')
  console.log('   Settings > API')
  console.log('')
} else {
  console.log('✅ .env.local file found')
  
  // Read and check env file
  const envContent = fs.readFileSync(envPath, 'utf8')
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL')
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Supabase environment variables configured')
  } else {
    console.log('❌ Missing Supabase environment variables')
    console.log('   Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, '..', 'node_modules')
const nodeModulesExists = fs.existsSync(nodeModulesPath)

if (!nodeModulesExists) {
  console.log('\n📦 Installing dependencies...')
  console.log('   Run: npm install --legacy-peer-deps')
  console.log('')
} else {
  console.log('✅ Dependencies installed')
}

// Check if supabase-schema.sql exists
const schemaPath = path.join(__dirname, '..', 'supabase-schema.sql')
const schemaExists = fs.existsSync(schemaPath)

if (schemaExists) {
  console.log('✅ Database schema file found')
  console.log('   📋 Remember to run the SQL in your Supabase project!')
} else {
  console.log('❌ supabase-schema.sql not found')
}

console.log('\n📋 Next Steps:')
console.log('1. Set up your Supabase project at https://supabase.com')
console.log('2. Create a new project and get your API keys')
console.log('3. Add the keys to .env.local')
console.log('4. Run the SQL schema in Supabase SQL Editor')
console.log('5. Run: npm run dev')
console.log('')
console.log('🎉 Happy coding!') 