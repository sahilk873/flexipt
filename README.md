# FlexiPT - Virtual Physical Therapy Platform

A modern web application for remote physical therapy with real-time feedback and exercise tracking.

## Features

- **Patient Dashboard**: Track progress, view assigned exercises, and monitor rehabilitation
- **Provider Dashboard**: Manage patients, assign exercises, and monitor progress
- **Exercise Library**: Comprehensive exercise database with videos and instructions
- **Real-time Feedback**: Form analysis and progress tracking
- **Authentication**: Secure user authentication with Supabase
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **UI Components**: Shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd flexipt-platform
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL schema from `supabase-schema.sql`:

```sql
-- Copy and paste the entire contents of supabase-schema.sql
```

This will create:
- Users table (extends Supabase auth)
- Patients table
- Exercises table
- Exercise sessions table
- Progress tracking table
- Patient exercises assignment table
- Row Level Security policies
- Sample exercise data

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
flexipt-platform/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── patient/           # Patient-specific pages
│   │   ├── dashboard/
│   │   └── exercises/
│   └── provider/          # Provider-specific pages
│       ├── dashboard/
│       ├── exercises/
│       └── patients/
├── components/            # Reusable UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
└── supabase-schema.sql   # Database schema
```

## Database Schema

### Tables

1. **users** - User profiles (extends Supabase auth)
2. **patients** - Patient records linked to providers
3. **exercises** - Exercise library with videos and instructions
4. **exercise_sessions** - Completed exercise sessions with form scores
5. **progress** - Patient progress metrics
6. **patient_exercises** - Exercise assignments to patients

### Row Level Security

- Users can only view their own data
- Providers can view and manage their patients
- Patients can view their assigned exercises and progress

## Authentication Flow

1. **Sign Up**: Users create accounts with role selection (provider/patient)
2. **Login**: Users authenticate with email/password
3. **Role-based Routing**: Users are redirected to appropriate dashboard
4. **Session Management**: Automatic session handling with Supabase

## Key Features Implemented

### ✅ Completed
- [x] Supabase backend setup with database schema
- [x] User authentication (signup/login)
- [x] Role-based routing and access control
- [x] Patient dashboard with real data
- [x] Patient exercise library
- [x] Provider dashboard structure
- [x] Exercise management system
- [x] Progress tracking framework

### 🚧 In Progress
- [ ] Real video processing and form analysis
- [ ] Exercise session recording
- [ ] Provider patient management
- [ ] Messaging system
- [ ] Calendar/scheduling

### 📋 Planned
- [ ] Real-time notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integration with wearable devices

## Development

### Adding New Features

1. **Database Changes**: Update `supabase-schema.sql` and run in Supabase
2. **API Routes**: Create new routes in `app/api/`
3. **Components**: Add reusable components in `components/`
4. **Pages**: Create new pages in appropriate directories

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Migrations

When making database changes:

1. Update the schema in `supabase-schema.sql`
2. Run the changes in Supabase SQL Editor
3. Update TypeScript types in `lib/supabase.ts`

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team. 