-- ==============================================================================
-- Supabase Row Level Security (RLS) Policies for KL Material Hub
-- ==============================================================================
-- Instructions:
-- 1. Go to your Supabase project dashboard: https://supabase.com/dashboard/
-- 2. Go to the SQL Editor (left sidebar)
-- 3. Click "New Query"
-- 4. Copy and paste all the code below and click "Run"
-- ==============================================================================

-- 1. Enable RLS on the table (if not already enabled)
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing policies to prevent conflicts
DROP POLICY IF EXISTS "Public read access" ON public.materials;
DROP POLICY IF EXISTS "Public insert access" ON public.materials;
DROP POLICY IF EXISTS "Public update access for downloads/views/ratings" ON public.materials;

-- 3. Allow ANYONE to read (SELECT) data
-- This is required so the website can load download counts and ratings
CREATE POLICY "Public read access" 
ON public.materials
FOR SELECT 
USING (true);

-- 4. Allow ANYONE to insert NEW rows
-- This is needed the very first time a file is downloaded or rated
CREATE POLICY "Public insert access" 
ON public.materials
FOR INSERT 
WITH CHECK (true);

-- 5. Allow ANYONE to UPDATE existing rows
-- WARNING: Since this is a public API without user authentication, we have to allow 
-- the anon key to update rows. To prevent malicious users from doing arbitrary
-- updates, a more advanced setup would use a Postgres Function (RPC) instead of direct updates.
-- But for the current client-side logic (which uses .upsert() and .update()), 
-- this policy is necessary for it to work.
CREATE POLICY "Public update access"
ON public.materials
FOR UPDATE
USING (true)
WITH CHECK (true);

-- NOTE ON SECURITY:
-- Because the KL Material hub does not require users to log in (no auth), 
-- the anon key is used for all operations. 
-- We CANNOT block UPDATEs entirely because the client-side JS increments values and updates the row.
-- The most secure way to handle this in the future is:
-- 1. Block UPDATE for anon role
-- 2. Create a Postgres Function (RPC) like `increment_download(doc_id)`
-- 3. Call `supabase.rpc('increment_download', { doc_id: '...' })` from the frontend
-- For now, the policies above match exactly what your code is currently doing
-- while formally securing the table from DELETE operations (which are now implicitly blocked).
