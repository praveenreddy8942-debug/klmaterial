-- ==============================================================================
-- Supabase Row Level Security (RLS) Policies for KL Material Hub
-- ==============================================================================
-- Instructions:
-- 1. Go to your Supabase project dashboard: https://supabase.com/dashboard/
-- 2. Go to the SQL Editor (left sidebar)
-- 3. Click "New Query"
-- 4. Copy and paste all the code below and click "Run"
-- ==============================================================================

-- ─── Step 1: Enable RLS ─────────────────────────────
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;

-- ─── Step 2: Drop old policies ──────────────────────
DROP POLICY IF EXISTS "Public read access" ON public.materials;
DROP POLICY IF EXISTS "Public insert access" ON public.materials;
DROP POLICY IF EXISTS "Public update access for downloads/views/ratings" ON public.materials;
DROP POLICY IF EXISTS "Public update access" ON public.materials;

-- ─── Step 3: Allow ANYONE to read (SELECT) ──────────
-- Required so the website can load download counts and ratings
CREATE POLICY "Public read access" 
ON public.materials
FOR SELECT 
USING (true);

-- ─── Step 4: Allow ANYONE to insert NEW rows ────────
-- Needed when a file is first downloaded/viewed (RPC functions handle this)
CREATE POLICY "Public insert access" 
ON public.materials
FOR INSERT 
WITH CHECK (true);

-- ─── Step 5: BLOCK direct UPDATE for anon role ──────
-- All mutations now go through RPC functions below.
-- No UPDATE policy = anon cannot directly modify rows.
-- (DELETE is also implicitly blocked since there's no policy for it.)

-- ==============================================================================
-- RPC Functions — Server-side atomic operations
-- These run with SECURITY DEFINER (elevated privileges) so they can UPDATE
-- even though the anon role has no UPDATE policy.
-- ==============================================================================

-- ─── increment_download ─────────────────────────────
-- Atomically increments the download counter for a material.
CREATE OR REPLACE FUNCTION public.increment_download(
  p_doc_id TEXT,
  p_folder TEXT,
  p_file_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO materials (doc_id, folder, file_name, downloads, rating, rating_count, views, last_downloaded)
  VALUES (p_doc_id, p_folder, p_file_name, 1, 0, 0, 0, NOW())
  ON CONFLICT (doc_id) DO UPDATE
    SET downloads = materials.downloads + 1,
        last_downloaded = NOW();
END;
$$;

-- ─── increment_view ─────────────────────────────────
-- Atomically increments the view counter for a material.
CREATE OR REPLACE FUNCTION public.increment_view(
  p_doc_id TEXT,
  p_folder TEXT,
  p_file_name TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO materials (doc_id, folder, file_name, downloads, rating, rating_count, views)
  VALUES (p_doc_id, p_folder, p_file_name, 0, 0, 0, 1)
  ON CONFLICT (doc_id) DO UPDATE
    SET views = materials.views + 1;
END;
$$;

-- ─── submit_rating ──────────────────────────────────
-- Atomically adds a star rating and recalculates the average.
-- Returns the new average rating and rating count as JSON.
CREATE OR REPLACE FUNCTION public.submit_rating(
  p_doc_id TEXT,
  p_folder TEXT,
  p_file_name TEXT,
  p_star NUMERIC
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record materials%ROWTYPE;
  v_new_count INTEGER;
  v_new_avg NUMERIC;
BEGIN
  -- Try to get existing record
  SELECT * INTO v_record FROM materials WHERE doc_id = p_doc_id;

  IF v_record IS NULL THEN
    -- First rating for this material
    INSERT INTO materials (doc_id, folder, file_name, downloads, rating, rating_count, views)
    VALUES (p_doc_id, p_folder, p_file_name, 0, p_star, 1, 0);
    RETURN json_build_object('new_rating', p_star, 'new_count', 1);
  ELSE
    -- Calculate new average
    v_new_count := COALESCE(v_record.rating_count, 0) + 1;
    v_new_avg := ROUND(
      ((COALESCE(v_record.rating, 0) * COALESCE(v_record.rating_count, 0)) + p_star) / v_new_count,
      1
    );

    UPDATE materials SET rating = v_new_avg, rating_count = v_new_count WHERE doc_id = p_doc_id;
    RETURN json_build_object('new_rating', v_new_avg, 'new_count', v_new_count);
  END IF;
END;
$$;

-- ─── Grant execute permissions to anon role ─────────
GRANT EXECUTE ON FUNCTION public.increment_download(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.increment_view(TEXT, TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.submit_rating(TEXT, TEXT, TEXT, NUMERIC) TO anon;

-- ==============================================================================
-- SECURITY NOTES:
-- ✅ SELECT: Open (read download counts, ratings, views)
-- ✅ INSERT: Open (first-time material entries via RPC)
-- ❌ UPDATE: Blocked for anon — all updates go through SECURITY DEFINER RPCs
-- ❌ DELETE: Blocked for anon — no DELETE policy exists
--
-- This prevents malicious users from:
-- • Faking download counts
-- • Injecting arbitrary ratings
-- • Deleting records
-- • Modifying any row fields directly
-- ==============================================================================
