// ====================================
// Supabase — Materials Metadata
// Tracks downloads, ratings, and views
// Free tier: 500MB, no credit card needed
// ====================================

// ─── Supabase Config ─────────────────────────────────
// Replace these with your Supabase project credentials
// Get them from: https://supabase.com → Project Settings → API
// WARNING: The anon key below is public and exposed in client-side code.
// You MUST enforce strict Row Level Security (RLS) policies in Supabase to prevent unauthorized access.
// See: https://supabase.com/docs/guides/auth/row-level-security
const SUPABASE_URL = "https://eygokxdsdmoalyclurwv.supabase.co";           // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Z29reGRzZG1vYWx5Y2x1cnd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTM3NTIsImV4cCI6MjA4Nzc2OTc1Mn0.4KwjN2oIhajzj-ERiplfZUIbcajBN2far035eo8dOv8"; // public anon key (safe for client-side)

let supabase = null;
let isDbReady = false;

// Load Supabase client library
async function loadSupabase() {
  if (SUPABASE_URL === "YOUR_SUPABASE_URL") {
    console.warn('[supabase-db] Supabase not configured. Database features disabled.');
    return false;
  }

  try {
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    isDbReady = true;
    console.log('[supabase-db] Connected.');
    return true;
  } catch (error) {
    console.error('[supabase-db] Init failed:', error);
    return false;
  }
}

// ─── Document ID Helper ─────────────────────────────
function getDocId(folder, fileName) {
  return (folder + '_' + fileName).replace(/[\/\\.#$\[\]]/g, '_');
}

// ─── Track Download (via RPC for security) ──────────
async function trackDownload(folder, fileName) {
  if (!isDbReady) return;
  const docId = getDocId(folder, fileName);

  try {
    await supabase.rpc('increment_download', {
      p_doc_id: docId,
      p_folder: folder,
      p_file_name: fileName
    });
  } catch (error) {
    console.error('[supabase-db] Track download error:', error);
  }
}

// ─── Track View (via RPC for security) ──────────────
async function trackView(folder, fileName) {
  if (!isDbReady) return;
  const docId = getDocId(folder, fileName);

  try {
    await supabase.rpc('increment_view', {
      p_doc_id: docId,
      p_folder: folder,
      p_file_name: fileName
    });
  } catch (error) {
    // Silently fail — views are non-critical
  }
}

// ─── Rate Material (via RPC for security) ───────────
async function rateMaterial(folder, fileName, star) {
  if (!isDbReady) return { success: false };

  const docId = getDocId(folder, fileName);
  const ratedKey = 'rated_' + docId;

  if (sessionStorage.getItem(ratedKey)) {
    return { success: false, message: 'Already rated this session' };
  }

  try {
    const { data, error } = await supabase.rpc('submit_rating', {
      p_doc_id: docId,
      p_folder: folder,
      p_file_name: fileName,
      p_star: star
    });

    if (error) throw error;

    sessionStorage.setItem(ratedKey, 'true');
    return { success: true, rating: data.new_rating, count: data.new_count };
  } catch (error) {
    console.error('[supabase-db] Rate error:', error);
    return { success: false, message: error.message };
  }
}

// ─── Get All Metadata ───────────────────────────────
async function getAllMetadata() {
  if (!isDbReady) return new Map();

  try {
    const { data, error } = await supabase
      .from('materials')
      .select('doc_id, downloads, rating, rating_count, views');

    if (error) throw error;

    const metadata = new Map();
    (data || []).forEach(function (row) {
      metadata.set(row.doc_id, {
        downloads: row.downloads || 0,
        rating: row.rating || 0,
        ratingCount: row.rating_count || 0,
        views: row.views || 0
      });
    });
    return metadata;
  } catch (error) {
    console.error('[supabase-db] Get metadata error:', error);
    return new Map();
  }
}

// ─── Get Single Material Metadata ───────────────────
async function getMetadata(folder, fileName) {
  if (!isDbReady) return null;
  const docId = getDocId(folder, fileName);

  try {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .eq('doc_id', docId)
      .maybeSingle();

    if (error) return null;
    return data;
  } catch (error) {
    return null;
  }
}

// ─── Initialize ─────────────────────────────────────
loadSupabase();

// Export for use in other scripts
window.supabaseDB = {
  get isReady() { return isDbReady; },
  trackDownload: trackDownload,
  trackView: trackView,
  rateMaterial: rateMaterial,
  getAllMetadata: getAllMetadata,
  getMetadata: getMetadata,
  getDocId: getDocId
};
