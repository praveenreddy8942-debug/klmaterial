// GitHub Materials Loader
// No Firebase needed - files hosted directly on GitHub!

const GITHUB_REPO = "praveenreddy8942-debug/klmaterial";
const GITHUB_BRANCH = "main";
const MATERIALS_PATH = "materials";
// media.githubusercontent.com properly serves Git LFS files
const MEDIA_BASE = `https://media.githubusercontent.com/media/${GITHUB_REPO}/${GITHUB_BRANCH}`;
// raw.githubusercontent.com serves regular (non-LFS) files
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_REPO}/${GITHUB_BRANCH}`;

// Optional: Add your GitHub Personal Access Token to increase rate limit from 60 to 5000 requests/hour
// Leave empty for public access (60 requests/hour limit)
const GITHUB_TOKEN = "";

// Cache duration for file listing (30 minutes)
const CACHE_KEY = 'klmaterial_files_cache';
const CACHE_DURATION = 30 * 60 * 1000;

// LFS tracked extensions (from .gitattributes)
const LFS_EXTENSIONS = ['.pdf', '.docx'];

// Subject configuration
const subjects = {
  // ── 1st Year Odd Semester ──
  "BEEC": {
    name: "Basic Electrical & Electronic Circuits (BEEC)",
    icon: "⚡",
    folder: "BEEC",
    semester: 1
  },
  "DM": {
    name: "Discrete Mathematics (DM)",
    icon: "🔢",
    folder: "DM",
    semester: 1
  },
  "PSC": {
    name: "Problem Solving Through C (PSC)",
    icon: "💻",
    folder: "PSC",
    semester: 1
  },
  "DSD": {
    name: "Digital System Design (DSD)",
    icon: "🔌",
    folder: "DSD",
    semester: 1
  },
  // ── 1st Year Even Semester ──
  "PP": {
    name: "Python Programming (PP)",
    icon: "🐍",
    folder: "PP",
    semester: 2
  },
  "LACE": {
    name: "Linear Algebra & Calculus for Engineers (LACE)",
    icon: "📐",
    folder: "LACE",
    semester: 2
  },
  "DS": {
    name: "Data Structures (DS)",
    icon: "🏗️",
    folder: "DS",
    semester: 2
  },
  "FIS": {
    name: "Fundamentals of IoT & Sensors (FIS)",
    icon: "📡",
    folder: "FIS",
    semester: 2
  },
  "COA": {
    name: "Computer Organization & Architecture (COA)",
    icon: "🖥️",
    folder: "COA",
    semester: 2
  }
};

// DOM Elements
const materialsList = document.getElementById("materials-list");
const searchBar = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-search");
const filterButtons = document.querySelectorAll(".filter-pill");

let allMaterials = {};
let activeCategory = "all";
let currentQuery = "";
let materialsMetadata = new Map();

// GitHub API URL
function getGitHubAPIUrl(folder) {
  return `https://api.github.com/repos/${GITHUB_REPO}/contents/${MATERIALS_PATH}/${folder}?ref=${GITHUB_BRANCH}`;
}

// GitHub Trees API - single call to get entire repo tree
function getGitHubTreeUrl() {
  return `https://api.github.com/repos/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;
}

// jsDelivr flat API (fallback) to list repo files
function getJsDelivrFlatUrl() {
  return `https://data.jsdelivr.com/v1/package/gh/${GITHUB_REPO}@${GITHUB_BRANCH}/flat`;
}

// Get direct download URL for GitHub file
// Uses media.githubusercontent.com for LFS files, raw.githubusercontent.com for regular files
function getDownloadUrl(file) {
  const encodedName = encodeURIComponent(file.name);
  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const isLFS = LFS_EXTENSIONS.includes(ext);
  const base = isLFS ? MEDIA_BASE : RAW_BASE;
  return `${base}/${MATERIALS_PATH}/${file.folder}/${encodedName}`;
}

async function loadMaterialsFromGitHubTree() {
  // Check localStorage cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION && data && Object.keys(data).length > 0) {
        console.log('Using cached materials list');
        return data;
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // Fetch entire repo tree in a single API call
  const headers = {};
  if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

  const response = await fetch(getGitHubTreeUrl(), { headers });
  if (!response.ok) {
    throw new Error(`GitHub Tree API error: ${response.status}`);
  }

  const treeData = await response.json();
  if (!treeData || !Array.isArray(treeData.tree)) {
    throw new Error('GitHub Tree API returned unexpected data');
  }

  const grouped = {};
  const materialsPrefix = `${MATERIALS_PATH}/`;

  treeData.tree.forEach((item) => {
    if (item.type !== 'blob') return;
    if (!item.path.startsWith(materialsPrefix)) return;

    const relative = item.path.slice(materialsPrefix.length);
    const slashIdx = relative.indexOf('/');
    if (slashIdx === -1) return;

    const folder = relative.slice(0, slashIdx);
    const fileName = relative.slice(slashIdx + 1);
    if (!fileName || fileName.toLowerCase() === 'readme.md') return;

    const subjectConfig = subjects[folder];
    if (!subjectConfig) return;

    if (!grouped[subjectConfig.name]) grouped[subjectConfig.name] = [];
    grouped[subjectConfig.name].push({
      name: fileName,
      folder: folder,
      size: item.size || 0
    });
  });

  // Cache the result
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data: grouped, timestamp: Date.now() }));
  } catch (e) {
    console.warn('Cache write error:', e);
  }

  return grouped;
}

async function loadMaterialsFromJsDelivr() {
  const response = await fetch(getJsDelivrFlatUrl());
  if (!response.ok) {
    throw new Error(`jsDelivr API error: ${response.status}`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.files)) {
    throw new Error('jsDelivr API returned unexpected data');
  }

  const grouped = {};
  const materialsPrefix = `/${MATERIALS_PATH}/`;

  data.files.forEach((file) => {
    if (file.type !== 'file' || !file.name.startsWith(materialsPrefix)) return;

    const relative = file.name.slice(materialsPrefix.length);
    const slashIdx = relative.indexOf('/');
    if (slashIdx === -1) return;

    const folder = relative.slice(0, slashIdx);
    const fileName = relative.slice(slashIdx + 1);
    if (!fileName || fileName.toLowerCase() === 'readme.md') return;

    const subjectConfig = subjects[folder];
    if (!subjectConfig) return;

    if (!grouped[subjectConfig.name]) grouped[subjectConfig.name] = [];
    grouped[subjectConfig.name].push({
      name: fileName,
      folder: folder,
      size: file.size || 0
    });
  });

  return grouped;
}

// Filter button functionality
if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategory = btn.dataset.category;
      if (searchBar) searchBar.value = "";
      if (clearBtn) clearBtn.style.display = "none";

      if (activeCategory === "all") {
        displayMaterials(allMaterials);
      } else {
        const filtered = {};
        for (const subject in allMaterials) {
          if (subject.includes(activeCategory) || subjects[activeCategory]?.name === subject) {
            filtered[subject] = allMaterials[subject];
          }
        }
        displayMaterials(filtered);
      }
    });
  });
}

// Search functionality
let searchDebounceId = null;
if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";

    if (searchDebounceId) clearTimeout(searchDebounceId);
    searchDebounceId = setTimeout(() => {
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
  currentQuery = query;
  if (!query) {
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
    const safeQuery = query.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    materialsList.innerHTML = `<p class="no-results">🔍 No materials found for "${safeQuery}"</p>`;
  } else {
    displayMaterials(filtered);
  }
}

function displayMaterials(grouped) {
  if (!materialsList) return;
  materialsList.innerHTML = "";

  for (const subject in grouped) {
    const subjectCard = document.createElement("div");
    subjectCard.className = "subject-card";

    const subjectKey = Object.keys(subjects).find(key => subjects[key].name === subject);
    const subjectIcon = subjects[subjectKey]?.icon || "📚";

    const header = document.createElement("div");
    header.className = "subject-header";
    header.innerHTML = `
      <div class="subject-title-wrap">
        <span class="subject-icon">${subjectIcon}</span>
        <h2 class="subject-title">${subject}</h2>
      </div>
      <div class="subject-meta">
        <span class="files-count">${grouped[subject].length} files</span>
      </div>
    `;

    const body = document.createElement("div");
    body.className = "subject-body";
    const grid = document.createElement("div");
    grid.className = "materials-cards-grid";

    grouped[subject].forEach((file) => {
      const name = file.name.replace(/_/g, " ");
      const fileExt = name.split('.').pop().toUpperCase();
      const downloadUrl = getDownloadUrl(file);
      const displayName = currentQuery ? highlightMatch(name, currentQuery) : escapeHtml(name);

      // Get metadata from Firebase (if available)
      const fdb = window.firebaseDB;
      const docId = fdb ? fdb.getDocId(file.folder, file.name) : '';
      const meta = materialsMetadata.get(docId);
      const downloadCount = meta ? (meta.downloads || 0) : 0;
      const rating = meta ? (meta.rating || 0) : 0;
      const ratingCount = meta ? (meta.ratingCount || 0) : 0;

      // Build star display
      const fullStars = Math.floor(rating);
      const hasHalf = (rating - fullStars) >= 0.5;
      let starsHtml = '';
      for (let s = 1; s <= 5; s++) {
        if (s <= fullStars) starsHtml += '<span class="star filled" data-star="' + s + '">★</span>';
        else if (s === fullStars + 1 && hasHalf) starsHtml += '<span class="star half" data-star="' + s + '">★</span>';
        else starsHtml += '<span class="star" data-star="' + s + '">☆</span>';
      }

      const card = document.createElement("div");
      card.className = "material-card";
      card.innerHTML = `
        <div class="card-header">
          <span class="file-icon">${getFileIcon(fileExt)}</span>
          <span class="file-type-badge">${fileExt}</span>
        </div>
        <div class="card-body">
          <h3 class="material-name">${displayName}</h3>
          <div class="material-meta">
            <span class="meta-downloads" title="Downloads">⬇ ${downloadCount}</span>
            <span class="meta-rating" title="${rating} / 5 (${ratingCount} ratings)">
              <span class="stars-row" data-folder="${file.folder}" data-file="${escapeHtml(file.name)}">${starsHtml}</span>
              <small>${ratingCount > 0 ? rating.toFixed(1) : ''}</small>
            </span>
          </div>
        </div>
        <div class="card-footer">
          <a href="${downloadUrl}" target="_blank" rel="noopener" class="download-link" data-folder="${file.folder}" data-file="${escapeHtml(file.name)}">
            <span class="download-icon">⬇</span>
            <span>Download</span>
          </a>
        </div>
      `;

      // Track view
      if (fdb && fdb.isReady) {
        fdb.trackView(file.folder, file.name);
      }

      grid.appendChild(card);
    });

    body.appendChild(grid);
    subjectCard.appendChild(header);
    subjectCard.appendChild(body);
    materialsList.appendChild(subjectCard);
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });
}

function highlightMatch(text, query) {
  const safeText = escapeHtml(text);
  const safeQuery = escapeHtml(query);
  if (!safeQuery) return safeText;
  const pattern = new RegExp(`(${safeQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
  return safeText.replace(pattern, '<mark>$1</mark>');
}

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

// Load materials from GitHub
async function loadMaterials() {
  if (!materialsList) return Promise.resolve();

  // Create Skeleton Grid
  let skeletonHTML = '<div class="materials-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); width: 100%; gap: 20px;">';
  for (let i = 0; i < 6; i++) {
    skeletonHTML += `
      <div class="skeleton-card">
        <div class="skeleton-icon"></div>
        <div class="skeleton-title"></div>
        <div class="skeleton-footer"></div>
      </div>
    `;
  }
  skeletonHTML += '</div>';

  materialsList.innerHTML = skeletonHTML;

  try {
    let grouped = {};

    try {
      // Primary: GitHub Trees API (single call, sees all files including LFS)
      grouped = await loadMaterialsFromGitHubTree();
      console.log('Loaded materials via GitHub Trees API.');
    } catch (treeError) {
      console.warn('GitHub Trees API failed, trying jsDelivr:', treeError);

      try {
        // Fallback 1: jsDelivr flat API (no rate limit, but may miss LFS files)
        grouped = await loadMaterialsFromJsDelivr();
        console.log('Loaded materials via jsDelivr API.');
      } catch (jsDelivrError) {
        console.warn('jsDelivr API also failed, falling back to GitHub Contents API:', jsDelivrError);

        // Fallback 2: GitHub Contents API (per-folder, uses more rate limit)
        for (const [key, config] of Object.entries(subjects)) {
          try {
            const headers = {};
            if (GITHUB_TOKEN) {
              headers['Authorization'] = `token ${GITHUB_TOKEN}`;
            }

            console.log(`Fetching ${config.folder}...`);
            const response = await fetch(getGitHubAPIUrl(config.folder), { headers });

            if (!response.ok) {
              console.error(`API Error for ${config.folder}: ${response.status} ${response.statusText}`);

              if (response.status === 403) {
                const errorData = await response.json();
                console.error('403 Error details:', errorData);
                if (errorData.message && errorData.message.includes('rate limit')) {
                  materialsList.innerHTML = `
                    <div class="no-results">
                      <h3>⏱️ GitHub API Rate Limit Reached</h3>
                      <p>Too many requests! Please wait a few minutes and refresh.</p>
                    </div>
                  `;
                  return;
                }
              }
              console.warn(`Folder ${config.folder} not found or empty`);
              continue;
            }

            const files = await response.json();
            const materialFiles = files.filter(file => file.type === 'file' && file.name.toLowerCase() !== 'readme.md');

            if (materialFiles.length > 0) {
              grouped[config.name] = materialFiles.map(file => ({
                name: file.name,
                folder: config.folder,
                size: file.size
              }));
            }
          } catch (fallbackError) {
            console.error(`Error loading ${config.folder}:`, fallbackError);
          }
        }
      }
    }

    allMaterials = grouped;
    console.log('Total materials grouped:', Object.keys(grouped).length, 'subjects');
    console.log('Materials by subject:', Object.entries(grouped).map(([k, v]) => `${k}: ${v.length} files`));

    if (Object.keys(grouped).length === 0) {
      console.warn('No materials found!');
      materialsList.innerHTML = `
        <div class="no-results">
          <h3>📭 No Materials Found</h3>
          <p>Please add your PDF files to the <code>/materials</code> folder in your GitHub repository.</p>
          <p style="margin-top: 15px;">
            Folders needed: <strong>BEEC</strong>, <strong>DM</strong>, <strong>PSC</strong>, <strong>DSD</strong>
          </p>
        </div>
      `;
    } else {
      console.log('Displaying materials...');

      // Fetch metadata from Firebase (downloads, ratings)
      const fdb = window.firebaseDB;
      if (fdb && fdb.isReady) {
        try {
          materialsMetadata = await fdb.getAllMetadata();
          console.log('[firebase-db] Loaded metadata for', materialsMetadata.size, 'materials');
        } catch (e) {
          console.warn('[firebase-db] Could not load metadata:', e);
        }
      }

      displayMaterials(grouped);
    }
  } catch (error) {
    console.error("Error loading materials:", error);
    materialsList.innerHTML = `
      <div class="no-results">
        <h3>⚠️ Error Loading Materials</h3>
        <p>Could not load files from GitHub.</p>
        <p style="margin-top: 10px; font-size: 0.9rem;">Error: ${(error.message || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <p style="margin-top: 10px; font-size: 0.85rem; opacity: 0.7;">Check browser console for details.</p>
      </div>
    `;
  }
}

// Load materials when page loads
if (materialsList) {
  loadMaterials().then(() => {
    // Check for search query param after materials load
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    if (query && searchBar) {
      searchBar.value = decodeURIComponent(query);
      // Trigger input event to update clear button visibility
      const inputEvent = new Event('input');
      searchBar.dispatchEvent(inputEvent);
      // Filter immediately
      filterMaterials(decodeURIComponent(query).toLowerCase().trim());

      // Scroll to results
      const searchContainer = document.querySelector('.advanced-search-container');
      if (searchContainer) searchContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// ─── Event Delegation: Download Tracking & Star Ratings ───
if (materialsList) {
  // Track downloads
  materialsList.addEventListener('click', (e) => {
    const downloadLink = e.target.closest('.download-link[data-folder]');
    if (downloadLink) {
      const folder = downloadLink.dataset.folder;
      const file = downloadLink.dataset.file;
      const fdb = window.firebaseDB;
      if (fdb && fdb.isReady && folder && file) {
        fdb.trackDownload(folder, file);
        // Update the count in the UI
        const card = downloadLink.closest('.material-card');
        if (card) {
          const countEl = card.querySelector('.meta-downloads');
          if (countEl) {
            const current = parseInt(countEl.textContent.replace(/\D/g, '')) || 0;
            countEl.textContent = '⬇ ' + (current + 1);
          }
        }
      }
    }
  });

  // Handle star rating clicks
  materialsList.addEventListener('click', (e) => {
    const star = e.target.closest('.star[data-star]');
    if (!star) return;

    const starsRow = star.closest('.stars-row');
    if (!starsRow) return;

    const folder = starsRow.dataset.folder;
    const file = starsRow.dataset.file;
    const rating = parseInt(star.dataset.star);
    const fdb = window.firebaseDB;

    if (!fdb || !fdb.isReady || !folder || !file) return;

    fdb.rateMaterial(folder, file, rating).then((result) => {
      if (result.success) {
        // Update stars display
        const allStars = starsRow.querySelectorAll('.star');
        allStars.forEach((s, i) => {
          if (i < rating) {
            s.textContent = '★';
            s.classList.add('filled');
            s.classList.remove('half');
          } else {
            s.textContent = '☆';
            s.classList.remove('filled', 'half');
          }
        });
        // Update rating text
        const small = starsRow.parentElement.querySelector('small');
        if (small) small.textContent = result.rating.toFixed(1);
      } else if (result.message) {
        console.info('[rating]', result.message);
      }
    });
  });
}
