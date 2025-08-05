// This script would be used to seed the database with initial data

import { promises as fs } from 'fs'
import path from 'path'

// Define database schema types
type User = {
  id: number
  name: string
  email: string
  role: 'admin' | '
