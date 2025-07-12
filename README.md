# SkillXchange - Full-Stack Skill Swapping Platform

A complete web application where users can exchange skills with each other, built with Next.js, Chakra UI, and Supabase.

## 🚀 Features

- **User Authentication** - Sign up/login with Supabase Auth
- **User Profiles** - Create detailed profiles with skills offered/wanted
- **Skill Discovery** - Browse and search for other users' skills
- **Swap Requests** - Send and manage skill swap requests
- **Real-time Status** - Track request status (pending/accepted/rejected)
- **Responsive Design** - Mobile-friendly interface with Chakra UI

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Chakra UI
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: Chakra UI with custom theme
- **Icons**: React Icons

## 📁 Project Structure

\`\`\`
├── pages/
│   ├── index.tsx          # Home page
│   ├── auth.tsx           # Login/signup page
│   ├── dashboard.tsx      # User dashboard
│   ├── profile.tsx        # Profile management
│   ├── browse.tsx         # Browse users
│   └── api/               # API routes
├── components/
│   ├── Navbar.tsx         # Navigation component
│   ├── ProfileCard.tsx    # User profile card
│   ├── SwapRequestCard.tsx # Swap request display
│   ├── SwapRequestModal.tsx # Request creation modal
│   ├── ProfileForm.tsx    # Profile editing form
│   ├── LoginForm.tsx      # Login form
│   └── SignUpForm.tsx     # Registration form
├── lib/
│   └── supabase.ts        # Supabase client & types
└── .env.local             # Environment variables
\`\`\`

## 🗄️ Database Schema

### Tables

1. **profiles**
   - id, username, location, profile_photo, skills_offered[], skills_wanted[], availability, mobile, bio, is_public, created_at

2. **swap_requests**
   - id, from_user, to_user, offered_skill, wanted_skill, message, status, created_at

3. **messages**
   - id, sender_id, receiver_id, swap_id, content, created_at

4. **feedback**
   - id, swap_id, given_by, given_to, rating, comment, created_at

## ⚙️ Setup Instructions

### 1. Clone and Install
\`\`\`bash
git clone <repository-url>
cd skillxchange
npm install
\`\`\`

### 2. Environment Variables
Create \`.env.local\`:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 3. Supabase Setup
1. Create a new Supabase project
2. Run the following SQL to create tables:

\`\`\`sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  location TEXT,
  profile_photo TEXT,
  skills_offered TEXT[],
  skills_wanted TEXT[],
  availability TEXT,
  mobile TEXT,
  bio TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Create swap_requests table
CREATE TABLE swap_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
  to_user UUID REFERENCES profiles(id) ON DELETE CASCADE,
  offered_skill TEXT NOT NULL,
  wanted_skill TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  swap_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  swap_id UUID REFERENCES swap_requests(id) ON DELETE CASCADE,
  given_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  given_to UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE swap_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
\`\`\`

### 4. Start Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit \`http://localhost:3000\`

## 🎯 Key Features Implemented

### Authentication
- Email/password signup and login
- Protected routes for authenticated users
- Session management with Supabase Auth

### Profile Management
- Create and edit user profiles
- Add/remove skills offered and wanted
- Public/private profile settings
- Profile photo support

### Skill Discovery
- Browse all public profiles
- Search by username, location, or bio
- Filter by skills offered/wanted

### Swap Request System
- Send skill swap requests to other users
- Include personal message with requests
- Accept/reject incoming requests
- Track request status

### Dashboard
- View pending and active swaps
- Quick stats overview
- Recent activity feed

## 🔒 Security Features

- Row Level Security (RLS) enabled
- User can only edit their own data
- Public profiles visible to all
- Private profiles hidden from browse

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy automatically

### Other Platforms
- Netlify: Add build command \`npm run build\`
- Railway: Connect GitHub and deploy

## 📱 Mobile Responsive

The app is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
