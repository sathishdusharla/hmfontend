# Deploy MediTrust to Netlify

## Setup Guide

### Step 1: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_KEY`

### Step 2: Push to GitHub

```bash
git add .
git commit -m "Netlify deployment setup"
git push origin main
```

### Step 3: Deploy on Netlify

#### Option A: Connect GitHub Repository (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click **"New site from Git"**
3. Select **GitHub** and authorize
4. Choose your repository
5. Site settings:
   - **Base directory**: `frontend/frontend/react-dashboard`
   - **Build command**: `npm ci && npm run build`
   - **Publish directory**: `dist`

6. Click **"Deploy"** (it will fail because env vars are missing)

#### Option B: Deploy Using Netlify CLI

```bash
npm install -g netlify-cli
cd frontend/frontend/react-dashboard
netlify deploy --prod
```

### Step 4: Add Environment Variables

**In Netlify Dashboard:**

1. Go to your site → **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Edit variables"**
3. Add two variables:
   ```
   VITE_SUPABASE_URL = https://db.wlrfvjrgkrszbvcwjoqi.supabase.co
   VITE_SUPABASE_KEY = (your-anon-public-key)
   ```
4. Click **"Save"**

### Step 5: Trigger Deploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for build to complete (2-3 minutes)
4. Your site will be live at `https://your-site-name.netlify.app`

## Accessing Your App

- **Frontend**: `https://your-site-name.netlify.app`
- **API**: Direct Supabase connection (no separate backend needed)

## How It Works

The app now:
1. Connects directly to Supabase from the browser
2. No separate backend server required
3. Uses Supabase client library (`@supabase/supabase-js`)
4. JWT tokens stored in `localStorage`
5. All data operations go directly to Supabase PostgreSQL

## Troubleshooting

### Build fails: "VITE_SUPABASE_KEY is not set"
- Add environment variables to Netlify site settings
- Trigger a new deploy

### Login doesn't work
- Check Supabase database has `users` table
- Verify user exists with correct email/password
- Check browser console for errors

### Slow performance
- Supabase free tier has rate limits
- Consider upgrading to Pro plan for production

## Database Requirements

Your Supabase database must have these tables:
- `users` (for authentication)
- `hospitals`
- `doctors`
- `patients`
- `appointments`
- `prescriptions`
- `medicines`
- `lab_tests`
- `complaints`
- `dashboard_history`

All tables must have appropriate RLS (Row Level Security) policies.

## Environment Variables Reference

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` | Supabase project URL |
| `VITE_SUPABASE_KEY` | `eyJ...` | Anonymous public key |

## Security Notes

⚠️ **Important:**
- The `VITE_SUPABASE_KEY` is exposed in the browser (it's public)
- Use Supabase RLS (Row Level Security) policies to protect data
- Never expose the service role key (`supabase_service_role_key`)
- Update password hashing to use bcrypt (currently plain text for demo)

## Next Steps

1. ✅ Deploy frontend to Netlify
2. ✅ Connect to Supabase directly
3. ✓ Setup RLS policies in Supabase
4. ✓ Add password hashing (bcrypt)
5. ✓ Configure CORS in Supabase

## Support

For issues:
- Check Netlify build logs: Dashboard → Deploys → Build log
- Check browser console: F12 → Console tab
- Check Supabase logs: Dashboard → Logs

Enjoy! 🚀
