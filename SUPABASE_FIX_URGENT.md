# 🚨 URGENT: Supabase Connection Failure Fix

## Problem Diagnosed

Your production site is failing with `net::ERR_NAME_NOT_RESOLVED` for `jplicanfiibpkfqttgmi.supabase.co`. This means:

**The Supabase project is unreachable** - likely paused, deleted, or DNS issue.

This is why:
- ❌ Image uploads spin forever (can't reach Supabase storage)
- ❌ Properties can't be saved to database
- ❌ User profiles fail to load
- ❌ All database operations fail

## Quick Fix Steps

### Step 1: Check Supabase Project Status

1. **Login to Supabase**: https://supabase.com/dashboard
2. **Check if project exists**: Look for project `jplicanfiibpkfqttgmi`
3. **Check project status**:
   - If **PAUSED**: Click "Resume Project" (free tier pauses after 1 week inactivity)
   - If **DELETED**: You'll need to create a new project (see Step 2)
   - If **ACTIVE**: There's a DNS/network issue (see Step 3)

### Step 2: Create New Supabase Project (If Old One Is Gone)

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - **Name**: `welcomehome-production`
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users
   - **Plan**: Free tier is fine for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for setup
6. **Copy these values** from Project Settings → API:
   - `Project URL` (e.g., `https://xxxxx.supabase.co`)
   - `anon public` key (starts with `eyJ...`)

### Step 3: Run Database Migrations on New Project

If you created a new project, you need to set up the database schema:

```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your new project
supabase link --project-ref YOUR_NEW_PROJECT_ID

# Run migrations
supabase db push
```

**Alternative: Run migrations manually**
1. Go to your Supabase Dashboard → SQL Editor
2. Run each migration file in `/supabase/migrations/` in order
3. Run the storage bucket setup from `SUPABASE_SETUP.md`

### Step 4: Update Environment Variables

#### For Local Development

Create `.env.local` in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Hedera Network Configuration
NEXT_PUBLIC_HEDERA_NETWORK=testnet
NEXT_PUBLIC_HEDERA_TESTNET_RPC_URL=https://testnet.hashio.io/api
NEXT_PUBLIC_HEDERA_MAINNET_RPC_URL=https://mainnet.hashio.io/api

# Smart Contract Addresses (from your deployed contracts)
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=
NEXT_PUBLIC_KYC_REGISTRY_ADDRESS=
NEXT_PUBLIC_OWNERSHIP_REGISTRY_ADDRESS=
NEXT_PUBLIC_PROPERTY_FACTORY_ADDRESS=
NEXT_PUBLIC_PROPERTY_GOVERNANCE_ADDRESS=
NEXT_PUBLIC_DEMO_PROPERTY_TOKEN_ADDRESS=
NEXT_PUBLIC_DEMO_TOKEN_HANDLER_ADDRESS=
```

#### For Production (marketplace.welcomehomeintl.com)

Update environment variables on your hosting platform:

**If using Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your project (`welcomehome`)
3. Go to **Settings** → **Environment Variables**
4. Update these variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://YOUR_NEW_PROJECT_ID.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your_new_anon_key`
5. Click **Save**
6. Go to **Deployments** → Click the 3 dots on latest → **Redeploy**

**If using Netlify:**
1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Update the same variables
5. Go to **Deploys** → **Trigger deploy** → **Deploy site**

### Step 5: Set Up Storage Buckets

Once your project is active, create these storage buckets:

1. Go to **Storage** in Supabase Dashboard
2. Create these 4 buckets:

| Bucket Name | Public? | Max Size | Allowed Types |
|-------------|---------|----------|---------------|
| `property-images` | ✅ Yes | 5 MB | image/jpeg, image/png, image/webp |
| `user-avatars` | ✅ Yes | 2 MB | image/jpeg, image/png, image/webp |
| `kyc-documents` | ❌ No | 10 MB | application/pdf, image/jpeg |
| `property-documents` | ❌ No | 10 MB | application/pdf, image/jpeg |

**Quick SQL to create all buckets:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('property-images', 'property-images', true),
  ('kyc-documents', 'kyc-documents', false),
  ('property-documents', 'property-documents', false),
  ('user-avatars', 'user-avatars', true)
ON CONFLICT (id) DO NOTHING;
```

Then run the storage policies from `SUPABASE_SETUP.md` lines 68-96.

### Step 6: Verify Fix

1. **Local test**:
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000
   - Try uploading an image in admin panel
   - Should work without errors

2. **Production test**:
   - Visit https://marketplace.welcomehomeintl.com
   - Open browser console (F12)
   - Should see NO `net::ERR_NAME_NOT_RESOLVED` errors
   - Try uploading property images
   - Should upload successfully

## Common Issues

### Issue: "Project is paused"
**Fix**: Click "Resume Project" in Supabase dashboard. Free tier projects pause after 7 days of inactivity.

### Issue: Storage bucket upload fails with 403
**Fix**:
1. Go to Storage → Policies
2. Make sure policies allow authenticated users to upload
3. Check bucket is set to public (for property-images and user-avatars)

### Issue: RLS policy violations
**Fix**: Check that all tables have proper Row Level Security policies. See `/supabase/migrations/` for reference.

### Issue: Still getting DNS errors after updating env vars
**Fix**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check that deployment actually redeployed with new env vars
4. Verify env vars in production settings (they should show as updated)

## Need Help?

If you're still stuck:
1. Share screenshot of Supabase project status page
2. Share screenshot of your hosting platform's environment variables (hide the values)
3. Share the full browser console error output

## Quick Reference

**Old Supabase URL**: `https://jplicanfiibpkfqttgmi.supabase.co` (NOT WORKING)
**New Supabase URL**: You need to create new project and get new URL

**Environment Variables Needed**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Files to Update**:
- Local: `.env.local` (create this file)
- Production: Update on Vercel/Netlify dashboard
