// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

// Firebase configuration (provided)
const firebaseConfig = {
  apiKey: "AIzaSyDUcVpkiBMd_53FHD4j77pN-MuNuPAv6aU",
  authDomain: "klmaterials.firebaseapp.com",
  projectId: "klmaterials",
  storageBucket: "klmaterials.firebasestorage.app",
  messagingSenderId: "772530551582",
  appId: "1:772530551582:web:ba87999d6602b49787a70f",
  measurementId: "G-JFPKCY2715"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// DOM Elements - Cache queries for better performance
const materialsList = document.getElementById("materials-list");
const searchBar = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-search");
const filterButtons = document.querySelectorAll(".filter-pill");
const filterContainer = document.querySelector('.filter-pills-container');
const storageRef = ref(storage);

// Subject mapping (file name keywords → subject titles)
const subjects = {
  "BEEC": "Basic Electrical & Electronic Circuits (BEEC)",
  "DM": "Discrete Mathematics (DM)",
  "PSC": "Problem Solving Through C",
  "DSD": "Digital System Design (DSD)"
};

let allMaterials = {}; // Store all materials for search
let activeCategory = "all"; // Track active filter

// Filter button functionality
if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Get category and filter
      activeCategory = btn.dataset.category;
      if (searchBar) searchBar.value = "";
      if (clearBtn) clearBtn.style.display = "none";

      if (activeCategory === "all") {
        displayMaterials(allMaterials);
      } else {
        const filtered = {};
        for (const subject in allMaterials) {
          if (subject.includes(activeCategory)) {
            filtered[subject] = allMaterials[subject];
          }
        }
        displayMaterials(filtered);
      }
    });
  });
}

// Search functionality
// Debounced search input
let searchDebounceId = null;
if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const queryRaw = e.target.value;
    const query = queryRaw.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";

    if (searchDebounceId) {
      clearTimeout(searchDebounceId);
    }
    searchDebounceId = setTimeout(() => {
      // Reset category filter when searching
      if (query && filterButtons.length > 0) {
        filterButtons.forEach(b => b.classList.remove("active"));
        filterButtons[0].classList.add("active");
        activeCategory = "all";
      }
      filterMaterials(query);
    }, 200);
  });
}

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    searchBar.value = "";
    clearBtn.style.display = "none";
    filterMaterials("");
  });
}

function filterMaterials(query) {
  if (!query) {
    // Show materials based on active category
    if (activeCategory === "all") {
      displayMaterials(allMaterials);
    } else {
      const filtered = {};
      for (const subject in allMaterials) {
        if (subject.includes(activeCategory)) {
          filtered[subject] = allMaterials[subject];
        }
      }
      displayMaterials(filtered);
    }
    return;
  }

  const filtered = {};
  for (const subject in allMaterials) {
    const matchingItems = allMaterials[subject].filter(item => {
      const fileName = item.name.replace(/_/g, " ").toLowerCase();
      const subjectName = subject.toLowerCase();
      return fileName.includes(query) || subjectName.includes(query);
    });

    if (matchingItems.length > 0) {
      filtered[subject] = matchingItems;
    }
  }

  if (Object.keys(filtered).length === 0) {
    materialsList.innerHTML = `<p class="no-results">🔍 No materials found for "${query}"</p>`;
  } else {
    displayMaterials(filtered);
  }
}

function displayMaterials(grouped) {
  if (!materialsList) return;
  materialsList.innerHTML = "";

  // Use document fragment for better performance
  const fragment = document.createDocumentFragment();

  for (const subject in grouped) {
    // Subject Card wrapper
    const subjectCard = document.createElement("div");
    subjectCard.className = "subject-card";

    // Header
    const header = document.createElement("div");
    header.className = "subject-header";
    const subjectIcon = getSubjectIcon(subject);
    header.innerHTML = `
      <div class="subject-title-wrap">
        <span class="subject-icon">${subjectIcon}</span>
        <h2 class="subject-title">${subject}</h2>
      </div>
      <div class="subject-meta">
        <span class="files-count">${grouped[subject].length} files</span>
      </div>
    `;

    // Body (materials grid)
    const body = document.createElement("div");
    body.className = "subject-body";
    const grid = document.createElement("div");
    grid.className = "materials-cards-grid";

    // Create cards for all files immediately (don't wait for URLs)
    grouped[subject].forEach((itemRef) => {
      const name = itemRef.name.replace(/_/g, " ");
      const fileExt = name.split('.').pop().toUpperCase();
      const encodedName = encodeURIComponent(itemRef.name);
      
      // Create direct download URL
      const directUrl = `https://firebasestorage.googleapis.com/v0/b/klmaterials.firebasestorage.app/o/${encodedName}?alt=media`;
      
      const card = document.createElement("div");
      card.className = "material-card";
      card.setAttribute('data-file', itemRef.name);
      
      card.innerHTML = `
        <div class="card-header">
          <span class="file-icon">${getFileIcon(fileExt)}</span>
          <span class="file-type-badge">${fileExt}</span>
        </div>
        <div class="card-body">
          <h3 class="material-name">${name}</h3>
        </div>
        <div class="card-footer">
          <a href="${directUrl}" target="_blank" class="download-link">
            <span class="download-icon">⬇</span>
            <span>Download</span>
          </a>
          <a href="${directUrl}" target="_blank" class="view-link">
            <span>👁 View</span>
          </a>
        </div>
      `;
      
      grid.appendChild(card);
      
      // Try to get proper download URL in background (optional enhancement)
      getDownloadURL(itemRef)
        .then((url) => {
          // Update card with proper URL if successful
          const downloadLink = card.querySelector('.download-link');
          const viewLink = card.querySelector('.view-link');
          if (downloadLink) downloadLink.href = url;
          if (viewLink) viewLink.href = url;
        })
        .catch((error) => {
          console.warn(`Using direct URL for ${itemRef.name} due to:`, error.code);
          // Card already has direct URL, so nothing to do
        });
    });
    body.appendChild(grid);

    // Assemble card
    subjectCard.appendChild(header);
    subjectCard.appendChild(body);

    fragment.appendChild(subjectCard);
  }
  
  // Single DOM update for better performance
  materialsList.appendChild(fragment);
}

// Helper function to get subject icon
function getSubjectIcon(subject) {
  if (subject.includes('BEEC')) return '⚡';
  if (subject.includes('DM') || subject.includes('Discrete')) return '🔢';
  if (subject.includes('PSC') || subject.includes('Problem')) return '💻';
  if (subject.includes('DSD') || subject.includes('Digital')) return '🔌';
  return '📚';
}

// Helper function to get file icon
function getFileIcon(ext) {
  const icons = {
    'PDF': '📄',
    'DOC': '📝',
    'DOCX': '📝',
    'PPT': '📊',
    'PPTX': '📊',
    'ZIP': '📦',
    'RAR': '📦',
    'TXT': '📃'
  };
  return icons[ext] || '📄';
}

// Fetch and display files
if (materialsList) {
  listAll(storageRef)
    .then((res) => {
      const grouped = {};

      res.items.forEach((itemRef) => {
        const name = itemRef.name;
        const matchKey = Object.keys(subjects).find(key => name.toUpperCase().includes(key));
        const subject = matchKey ? subjects[matchKey] : "Other Materials";
        if (!grouped[subject]) grouped[subject] = [];
        grouped[subject].push(itemRef);
      });

      allMaterials = grouped; // Store for search
      
      // Check if any materials were found
      if (Object.keys(grouped).length === 0) {
        materialsList.innerHTML = `
          <div class="no-results">
            <h3>📭 No Materials Found</h3>
            <p>No files are currently in Firebase Storage.</p>
            <p style="margin-top: 15px; font-size: 0.9rem; color: var(--text-secondary);">
              Please upload files to your Firebase Storage bucket: <strong>klmaterials.firebasestorage.app</strong>
            </p>
          </div>
        `;
      } else {
        displayMaterials(grouped);
      }
    })
    .catch((error) => {
      console.error("Firebase Error:", error);
      console.error("Error Code:", error.code);
      console.error("Error Message:", error.message);
      
      let errorMessage = "⚠️ Error loading materials.";
      let errorDetails = "";
      
      if (error.code === 'storage/unauthorized') {
        errorDetails = `
          <p><strong>⏰ Firebase Storage Rules Expired</strong></p>
          <p style="color: #ff6b6b; font-weight: 600;">This happens automatically after 30 days if you're using test mode rules.</p>
          
          <div style="background: rgba(255, 107, 107, 0.1); border: 2px solid #ff6b6b; border-radius: 10px; padding: 20px; margin: 20px 0;">
            <h4 style="color: #ff6b6b; margin-top: 0;">🔧 Quick Fix (2 minutes):</h4>
            <ol style="text-align: left; max-width: 700px; margin: 15px auto; line-height: 1.8;">
              <li><strong>Open Firebase Console:</strong><br>
                <a href="https://console.firebase.google.com/project/klmaterials/storage/klmaterials.firebasestorage.app/rules" 
                   target="_blank" 
                   style="color: var(--accent-primary); font-size: 1.1em; text-decoration: underline;">
                   👉 Click here to go directly to Storage Rules
                </a>
              </li>
              <li><strong>Click the "Rules" tab</strong> (if not already there)</li>
              <li><strong>Replace ALL the rules</strong> with this permanent solution:<br>
                <code style="display: block; background: #1a1a2e; color: #00ff88; padding: 15px; margin: 10px 0; border-radius: 8px; text-align: left; font-size: 0.9em; line-height: 1.6; overflow-x: auto;">
rules_version = '2';<br>
service firebase.storage {<br>
&nbsp;&nbsp;match /b/{bucket}/o {<br>
&nbsp;&nbsp;&nbsp;&nbsp;match /{allPaths=**} {<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ffd700;">// Allow anyone to read (download) files</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow read: if true;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ffd700;">// Only authenticated users can upload</span><br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;allow write: if request.auth != null;<br>
&nbsp;&nbsp;&nbsp;&nbsp;}<br>
&nbsp;&nbsp;}<br>
}
                </code>
              </li>
              <li><strong>Click "Publish"</strong> button at the top</li>
              <li><strong>Refresh this page</strong> - your materials will appear! ✅</li>
            </ol>
          </div>
          
          <p style="margin-top: 20px; font-size: 0.95em; color: var(--text-secondary);">
            💡 <strong>Why this happens:</strong> Firebase test mode rules expire after 30 days for security. 
            The rules above allow permanent public read access (which you need for your study materials website).
          </p>
          
          <p style="margin-top: 15px; font-size: 0.9em; color: var(--text-secondary);">
            📧 Your materials are safe in storage - they just can't be accessed until you update the rules.
          </p>
        `;
      } else if (error.code === 'storage/object-not-found') {
        errorDetails = "<p>The storage bucket exists but no files were found. Please upload some materials.</p>";
      } else if (error.code === 'storage/bucket-not-found') {
        errorDetails = "<p>Firebase Storage bucket not found. Please check your Firebase configuration.</p>";
      } else {
        errorDetails = `<p>Error: ${error.message}</p><p>Code: ${error.code}</p>`;
      }
      
      materialsList.innerHTML = `
        <div class="no-results" style="max-width: 800px; margin: 0 auto;">
          <h3>${errorMessage}</h3>
          ${errorDetails}
        </div>
      `;
    });
}
