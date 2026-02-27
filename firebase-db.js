// ====================================
// Firebase Firestore — Materials Metadata
// Tracks downloads, ratings, and views
// ====================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  getDocs
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';

// ─── Firebase Config ─────────────────────────────────
// Replace these with your Firebase project credentials
// Get them from: https://console.firebase.google.com → Project Settings → Your Apps → Web App
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let db = null;
let isFirebaseReady = false;

// Initialize Firebase only if config is set
function initFirebase() {
  if (firebaseConfig.apiKey === "YOUR_API_KEY") {
    console.warn('[firebase-db] Firebase not configured. Database features disabled.');
    return false;
  }

  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    isFirebaseReady = true;
    console.log('[firebase-db] Firestore connected.');
    return true;
  } catch (error) {
    console.error('[firebase-db] Init failed:', error);
    return false;
  }
}

// ─── Document ID Helper ─────────────────────────────
// Creates a safe Firestore document ID from folder + filename
function getDocId(folder, fileName) {
  return `${folder}_${fileName}`.replace(/[\/\\.#$\[\]]/g, '_');
}

// ─── Track Download ─────────────────────────────────
// Call this when a user clicks a download link
async function trackDownload(folder, fileName) {
  if (!isFirebaseReady) return;

  const docId = getDocId(folder, fileName);
  const ref = doc(db, 'materials', docId);

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      await updateDoc(ref, {
        downloads: increment(1),
        lastDownloaded: new Date().toISOString()
      });
    } else {
      await setDoc(ref, {
        folder: folder,
        fileName: fileName,
        downloads: 1,
        rating: 0,
        ratingCount: 0,
        views: 0,
        lastDownloaded: new Date().toISOString(),
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('[firebase-db] Track download error:', error);
  }
}

// ─── Track View ─────────────────────────────────────
// Call this when materials are displayed on screen
async function trackView(folder, fileName) {
  if (!isFirebaseReady) return;

  const docId = getDocId(folder, fileName);
  const ref = doc(db, 'materials', docId);

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      await updateDoc(ref, { views: increment(1) });
    } else {
      await setDoc(ref, {
        folder: folder,
        fileName: fileName,
        downloads: 0,
        rating: 0,
        ratingCount: 0,
        views: 1,
        lastDownloaded: null,
        createdAt: new Date().toISOString()
      });
    }
  } catch (error) {
    // Silently fail — views are non-critical
  }
}

// ─── Rate Material ──────────────────────────────────
// star: 1-5 rating value
async function rateMaterial(folder, fileName, star) {
  if (!isFirebaseReady) return { success: false };

  const docId = getDocId(folder, fileName);
  const ref = doc(db, 'materials', docId);

  // Prevent duplicate ratings per session
  const ratedKey = `rated_${docId}`;
  if (sessionStorage.getItem(ratedKey)) {
    return { success: false, message: 'Already rated this session' };
  }

  try {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const newCount = (data.ratingCount || 0) + 1;
      const newTotal = ((data.rating || 0) * (data.ratingCount || 0)) + star;
      const newAvg = newTotal / newCount;

      await updateDoc(ref, {
        rating: Math.round(newAvg * 10) / 10,
        ratingCount: newCount
      });

      sessionStorage.setItem(ratedKey, 'true');
      return { success: true, rating: Math.round(newAvg * 10) / 10, count: newCount };
    } else {
      await setDoc(ref, {
        folder: folder,
        fileName: fileName,
        downloads: 0,
        rating: star,
        ratingCount: 1,
        views: 0,
        lastDownloaded: null,
        createdAt: new Date().toISOString()
      });

      sessionStorage.setItem(ratedKey, 'true');
      return { success: true, rating: star, count: 1 };
    }
  } catch (error) {
    console.error('[firebase-db] Rate error:', error);
    return { success: false, message: error.message };
  }
}

// ─── Get Metadata for All Materials ─────────────────
// Returns a Map of docId → { downloads, rating, ratingCount, views }
async function getAllMetadata() {
  if (!isFirebaseReady) return new Map();

  try {
    const snapshot = await getDocs(collection(db, 'materials'));
    const metadata = new Map();

    snapshot.forEach((docSnap) => {
      metadata.set(docSnap.id, docSnap.data());
    });

    return metadata;
  } catch (error) {
    console.error('[firebase-db] Get metadata error:', error);
    return new Map();
  }
}

// ─── Get Single Material Metadata ───────────────────
async function getMetadata(folder, fileName) {
  if (!isFirebaseReady) return null;

  const docId = getDocId(folder, fileName);
  const ref = doc(db, 'materials', docId);

  try {
    const docSnap = await getDoc(ref);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    return null;
  }
}

// ─── Initialize ─────────────────────────────────────
const firebaseReady = initFirebase();

// Export for use in other scripts
window.firebaseDB = {
  isReady: isFirebaseReady,
  trackDownload,
  trackView,
  rateMaterial,
  getAllMetadata,
  getMetadata,
  getDocId
};
