-- Migration: Add RLS policies for properties table
-- Date: 2025-11-06
-- Purpose: Allow authenticated users to manage properties (CRUD operations)

-- Enable RLS on properties table (if not already enabled)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow public read access to properties" ON properties;
DROP POLICY IF EXISTS "Allow authenticated insert to properties" ON properties;
DROP POLICY IF EXISTS "Allow authenticated update to properties" ON properties;
DROP POLICY IF EXISTS "Allow authenticated delete to properties" ON properties;

-- Policy 1: Allow anyone to READ properties (public marketplace)
CREATE POLICY "Allow public read access to properties"
ON properties FOR SELECT
TO public
USING (true);

-- Policy 2: Allow public INSERT to properties
-- NOTE: Using wallet-based auth (no traditional JWT auth)
-- Application-level checks enforce admin privileges
CREATE POLICY "Allow public insert to properties"
ON properties FOR INSERT
TO public
WITH CHECK (true);

-- Policy 3: Allow public UPDATE to properties
-- Application-level checks enforce who can update what
CREATE POLICY "Allow public update to properties"
ON properties FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Policy 4: Allow public DELETE to properties
-- Application-level checks enforce admin privileges
CREATE POLICY "Allow public delete to properties"
ON properties FOR DELETE
TO public
USING (true);

-- Add comment explaining the security model
COMMENT ON TABLE properties IS 'RLS enabled with permissive PUBLIC policies. This app uses wallet-based authentication (Metamask/WalletConnect) via the Supabase anon key. Users appear as "public" to Supabase. Application layer enforces admin role checks via smart contracts before mutations.';
