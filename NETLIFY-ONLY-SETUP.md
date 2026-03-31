# MediTrust - Netlify Only (No Backend)

## Architecture

```
┌─────────────────────────┐
│   Netlify Frontend      │
│   (React + Vite)        │
│  https://meditrust.app  │
└──────────────┬──────────┘
               │
               │ Direct connection
               │
        ┌──────▼──────┐
        │  Supabase   │
        │ PostgreSQL  │
        │  Database   │
        └─────────────┘
```

**No separate backend server needed!**

## Setup Instructions

### 1. Install Dependencies

```bash
chmod +x setup-netlify.sh
./setup-netlify.sh
```

Or manually:
```bash
cd frontend/frontend/react-dashboard
npm install
```

### 2. Configure Supabase

Get your Supabase credentials:
1. Visit https://app.supabase.com
2. Open your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon public** key

Create `.env` file in `frontend/frontend/react-dashboard/`:
```env
VITE_SUPABASE_URL=https://db.wlrfvjrgkrszbvcwjoqi.supabase.co
VITE_SUPABASE_KEY=your-anon-public-key
```

### 3. Run Locally

```bash
cd frontend/frontend/react-dashboard
npm run dev
```

Visit `http://localhost:5173`

### 4. Deploy to Netlify

#### Option A: GitHub Integration (Easiest)

1. Push code to GitHub:
```bash
git add .
git commit -m "Netlify deployment"
git push origin main
```

2. Go to https://app.netlify.com
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your GitHub account
5. Select your repository
6. Build settings:
   - **Base directory**: `frontend/frontend/react-dashboard`
   - **Build command**: `npm ci && npm run build`
   - **Publish directory**: `dist`
7. Click **"Deploy site"**

8. Add environment variables:
   - Go to **Site Settings** → **Build & Deploy** → **Environment**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_KEY`
   - Trigger deploy

#### Option B: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Navigate to frontend
cd frontend/frontend/react-dashboard

# Deploy
netlify deploy --prod

# When prompted, set:
# - Build command: npm ci && npm run build
# - Publish directory: dist
```

## How the App Works

### Frontend (React)
- Located in: `frontend/frontend/react-dashboard/`
- Uses Supabase client library
- Stores JWT token in `localStorage`
- Direct database queries via `src/lib/supabase.js`

### Database Operations
All queries go directly to Supabase:
```javascript
// Example: Login
const user = await db.loginUser(email, password);

// Example: Get hospitals
const hospitals = await db.getHospitals();

// Example: Create appointment
await db.createAppointment({ ... });
```

See `src/lib/supabase.js` for all available functions.

## Database Schema

Required tables in Supabase:
- `users` (email, password, name, role, entity_id)
- `hospitals`
- `doctors`
- `patients`
- `appointments`
- `prescriptions`
- `medicines`
- `lab_tests`
- `complaints`
- `dashboard_history`

Use the SQL files in the repository to create tables:
```sql
-- Execute in Supabase SQL Editor:
-- supabase-schema.sql
-- supabase-dummy-data.sql
```

## Environment Variables

Add these to your Netlify site:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_KEY` | Your Supabase anon public key |

## Important Security Notes

⚠️ **Your Supabase anon public key WILL be exposed in the frontend**

This is **normal and expected**. Security is enforced via:
1. **Row Level Security (RLS)** policies in Supabase
2. **User authentication** via email/password
3. **JWT tokens** stored in localStorage

Configure RLS policies in Supabase to restrict access:
```sql
-- Example: Users can only see their own data
CREATE POLICY "Users can see own data"
  ON public.patients
  FOR SELECT
  USING (auth.uid() = user_id);
```

## Troubleshooting

### Build fails: "Cannot find module '@supabase/supabase-js'"
```bash
cd frontend/frontend/react-dashboard
npm install
```

### "VITE_SUPABASE_KEY is not set"
- Add environment variables to Netlify site settings
- Trigger a new deploy after adding them

### Login doesn't work
1. Check users table exists in Supabase
2. Check user email/password in database
3. Open browser DevTools (F12) and check console for errors

### "Cannot read property 'from' of undefined"
- Ensure VITE_SUPABASE_URL and VITE_SUPABASE_KEY are set
- Check they're accessible: `import.meta.env.VITE_SUPABASE_URL`

## Performance & Limits

**Supabase Free Tier:**
- Up to 500MB database
- Rate limits: 2,000 requests/minute
- Suitable for: Development, testing, small apps

**Supabase Pro:**
- Better performance guarantee
- Higher rate limits
- Recommended for: Production apps

## Monitoring

Check Supabase logs:
1. Go to Dashboard → Logs
2. Filter by error/warning
3. View real-time query activity

## Local Development vs Production

### Local (npm run dev)
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
```

### Production (Netlify)
```
Environment variables set in Netlify UI
```

Both use same code, different environment variables.

## Deployment Checklist

- [ ] Supabase project created
- [ ] Database tables created (schema.sql)
- [ ] Sample data loaded (dummy-data.sql)
- [ ] Supabase credentials obtained
- [ ] Repository pushed to GitHub
- [ ] Netlify site connected
- [ ] Environment variables added
- [ ] Build triggers and succeeds
- [ ] Login page works
- [ ] Data loads from Supabase

## Support & Resources

- **Netlify Docs**: https://docs.netlify.com
- **Supabase Docs**: https://supabase.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev

## Next Steps

1. ✅ Setup frontend on Netlify
2. ✅ Connect to Supabase
3. ✓ Setup RLS policies for security
4. ✓ Add password hashing (bcrypt)
5. ✓ Configure custom domain

---

**You're all set!** Deploy to Netlify and start using MediTrust. 🚀
