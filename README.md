# MediTrust - Healthcare Management System

A modern healthcare management platform built with React, deployed on Netlify, and backed by Supabase PostgreSQL.

## 📋 Quick Start

### 1. Install Dependencies
```bash
chmod +x setup-netlify.sh
./setup-netlify.sh
```

### 2. Add Supabase Credentials
Edit `frontend/frontend/react-dashboard/.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
```

Get your credentials from [Supabase Dashboard](https://app.supabase.com) → Settings → API

### 3. Run Locally
```bash
cd frontend/frontend/react-dashboard
npm run dev
```

Visit `http://localhost:5173`

### 4. Deploy to Netlify

**Option A: GitHub + Netlify (Recommended)**
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repo
4. Base directory: `frontend/frontend/react-dashboard`
5. Build: `npm ci && npm run build`
6. Publish: `dist`
7. Add environment variables in Netlify

**Option B: Netlify CLI**
```bash
npm install -g netlify-cli
cd frontend/frontend/react-dashboard
netlify deploy --prod
```

## 📁 Project Structure

```
meditrust/
├── frontend/
│   └── frontend/
│       └── react-dashboard/     # React application
│           ├── src/
│           │   ├── pages/       # Login, Dashboard pages
│           │   ├── components/  # UI components
│           │   └── lib/         # Supabase client
│           ├── package.json
│           ├── netlify.toml     # Netlify config
│           └── vite.config.js
├── NETLIFY-ONLY-SETUP.md        # Complete setup guide
├── NETLIFY-DEPLOYMENT.md        # Deployment guide
├── setup-netlify.sh             # Setup script
└── supabase-*.sql              # Database schemas
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. In Supabase SQL Editor, run:
   - `supabase-schema.sql` - Create tables
   - `supabase-dummy-data.sql` - Add sample data

## 🌐 Features

- **User Authentication** - Email/password login
- **Role-Based Access** - Patient, Doctor, Admin roles
- **Patient Dashboard** - View health records, appointments, prescriptions
- **Doctor Dashboard** - Manage patients, prescriptions, appointments
- **Hospital Management** - Hospital and doctor information
- **Lab Tests** - Upload and track test results
- **Appointment Booking** - Schedule appointments

## 🔐 Security

- JWT token-based authentication
- Supabase Row Level Security (RLS) policies
- Password stored in database (recommended to add bcrypt)
- Anon public key exposed in frontend (standard practice - secured via RLS)

## 📖 Documentation

- [NETLIFY-ONLY-SETUP.md](NETLIFY-ONLY-SETUP.md) - Complete setup guide
- [NETLIFY-DEPLOYMENT.md](NETLIFY-DEPLOYMENT.md) - Deployment instructions
- [Supabase Docs](https://supabase.com/docs) - Database documentation

## 🚀 Deployment

- **Frontend**: Netlify (static site)
- **Database**: Supabase PostgreSQL
- **No backend server required**

Deployed app: `https://your-site.netlify.app`

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT
- **Hosting**: Netlify

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check Netlify build logs
3. Check Supabase logs at https://app.supabase.com

## 📝 License

MIT

---

**Ready to deploy?** See [NETLIFY-ONLY-SETUP.md](NETLIFY-ONLY-SETUP.md) for step-by-step instructions.
