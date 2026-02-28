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
    icon: '<i class="fa-solid fa-bolt"></i>',
    folder: "BEEC",
    year: 1,
    semester: 1
  },
  "DM": {
    name: "Discrete Mathematics (DM)",
    icon: '<i class="fa-solid fa-calculator"></i>',
    folder: "DM",
    year: 1,
    semester: 1
  },
  "PSC": {
    name: "Problem Solving Through C (PSC)",
    icon: '<i class="fa-solid fa-code"></i>',
    folder: "PSC",
    year: 1,
    semester: 1
  },
  "DSD": {
    name: "Digital System Design (DSD)",
    icon: '<i class="fa-solid fa-microchip"></i>',
    folder: "DSD",
    year: 1,
    semester: 1
  },
  // ── 1st Year Even Semester ──
  "PP": {
    name: "Python Programming (PP)",
    icon: '<i class="fa-brands fa-python"></i>',
    folder: "PP",
    year: 1,
    semester: 2
  },
  "LACE": {
    name: "Linear Algebra & Calculus for Engineers (LACE)",
    icon: '<i class="fa-solid fa-square-root-variable"></i>',
    folder: "LACE",
    year: 1,
    semester: 2
  },
  "DS": {
    name: "Data Structures (DS)",
    icon: '<i class="fa-solid fa-diagram-project"></i>',
    folder: "DS",
    year: 1,
    semester: 2
  },
  "FIS": {
    name: "Fundamentals of IoT & Sensors (FIS)",
    icon: '<i class="fa-solid fa-tower-broadcast"></i>',
    folder: "FIS",
    year: 1,
    semester: 2
  },
  "COA": {
    name: "Computer Organization & Architecture (COA)",
    icon: '<i class="fa-solid fa-computer"></i>',
    folder: "COA",
    year: 1,
    semester: 2
  }
};

// DOM Elements
const materialsList = document.getElementById("materials-list");
const searchBar = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-search");

// Selector elements
const yearSelector = document.getElementById("year-selector");
const semesterGroup = document.getElementById("semester-group");
const semesterSelector = document.getElementById("semester-selector");
const subjectGroup = document.getElementById("subject-group");
const subjectSelector = document.getElementById("subject-selector");
const filterBreadcrumb = document.getElementById("filter-breadcrumb");
const breadcrumbPath = document.getElementById("breadcrumb-path");
const breadcrumbReset = document.getElementById("breadcrumb-reset");

let allMaterials = {};
let activeYear = "all";
let activeSemester = "all";
let activeSubject = "all";
let currentQuery = "";
let materialsMetadata = new Map();

// ─── Cascading Selectors ───

function getYearLabel(y) {
  const labels = { 1: "1st Year", 2: "2nd Year", 3: "3rd Year", 4: "4th Year" };
  return labels[y] || `Year ${y}`;
}

function getSemesterLabel(year, sem) {
  const semNum = (year - 1) * 2 + sem;
  const suffixes = { 1: "Odd", 2: "Even" };
  return `Semester ${semNum} (${suffixes[sem] || sem})`;
}

// Setup year selector clicks
if (yearSelector) {
  yearSelector.addEventListener("click", (e) => {
    const pill = e.target.closest(".selector-pill");
    if (!pill) return;

    yearSelector.querySelectorAll(".selector-pill").forEach(p => p.classList.remove("active"));
    pill.classList.add("active");

    activeYear = pill.dataset.year;
    activeSemester = "all";
    activeSubject = "all";

    if (activeYear === "all") {
      // Hide semester & subject selectors
      semesterGroup.style.display = "none";
      subjectGroup.style.display = "none";
      updateBreadcrumb();
      applyFilters();
    } else {
      // Show semester selector for this year
      populateSemesterSelector(parseInt(activeYear));
      semesterGroup.style.display = "";
      semesterGroup.classList.add("selector-animate");
      subjectGroup.style.display = "none";
      updateBreadcrumb();
      applyFilters();
    }
  });
}

function populateSemesterSelector(year) {
  if (!semesterSelector) return;

  // Find which semesters exist for this year
  const semesters = new Set();
  for (const config of Object.values(subjects)) {
    if (config.year === year) semesters.add(config.semester);
  }

  let html = `<button class="selector-pill active" data-semester="all">All Semesters</button>`;
  Array.from(semesters).sort().forEach(sem => {
    html += `<button class="selector-pill" data-semester="${sem}">${getSemesterLabel(year, sem)}</button>`;
  });
  semesterSelector.innerHTML = html;

  // Attach click handler (remove first to prevent duplicates)
  semesterSelector.removeEventListener("click", handleSemesterClick);
  semesterSelector.addEventListener("click", handleSemesterClick);
}

function handleSemesterClick(e) {
  const pill = e.target.closest(".selector-pill");
  if (!pill) return;

  semesterSelector.querySelectorAll(".selector-pill").forEach(p => p.classList.remove("active"));
  pill.classList.add("active");

  activeSemester = pill.dataset.semester;
  activeSubject = "all";

  if (activeSemester === "all") {
    subjectGroup.style.display = "none";
  } else {
    populateSubjectSelector(parseInt(activeYear), parseInt(activeSemester));
    subjectGroup.style.display = "";
    subjectGroup.classList.add("selector-animate");
  }
  updateBreadcrumb();
  applyFilters();
}

function populateSubjectSelector(year, semester) {
  if (!subjectSelector) return;

  let html = `<button class="selector-pill active" data-subject="all">
    <span class="pill-icon"><i class="fa-solid fa-book"></i></span><span>All Subjects</span>
  </button>`;

  for (const [key, config] of Object.entries(subjects)) {
    if (config.year === year && config.semester === semester) {
      html += `<button class="selector-pill" data-subject="${key}">
        <span class="pill-icon">${config.icon}</span><span>${key}</span>
      </button>`;
    }
  }
  subjectSelector.innerHTML = html;

  // Attach click handler (remove first to prevent duplicates)
  subjectSelector.removeEventListener("click", handleSubjectClick);
  subjectSelector.addEventListener("click", handleSubjectClick);
}

function handleSubjectClick(e) {
  const pill = e.target.closest(".selector-pill");
  if (!pill) return;

  subjectSelector.querySelectorAll(".selector-pill").forEach(p => p.classList.remove("active"));
  pill.classList.add("active");

  activeSubject = pill.dataset.subject;
  updateBreadcrumb();
  applyFilters();
}

function updateBreadcrumb() {
  if (!filterBreadcrumb || !breadcrumbPath) return;

  if (activeYear === "all") {
    filterBreadcrumb.style.display = "none";
    return;
  }

  filterBreadcrumb.style.display = "";
  let path = getYearLabel(parseInt(activeYear));

  if (activeSemester !== "all") {
    path += ` → ${getSemesterLabel(parseInt(activeYear), parseInt(activeSemester))}`;
  }

  if (activeSubject !== "all" && subjects[activeSubject]) {
    path += ` → ${subjects[activeSubject].icon} ${activeSubject}`;
  }

  breadcrumbPath.innerHTML = path;
}

// Reset button
if (breadcrumbReset) {
  breadcrumbReset.addEventListener("click", () => {
    activeYear = "all";
    activeSemester = "all";
    activeSubject = "all";

    if (yearSelector) {
      yearSelector.querySelectorAll(".selector-pill").forEach(p => p.classList.remove("active"));
      yearSelector.querySelector('[data-year="all"]').classList.add("active");
    }
    semesterGroup.style.display = "none";
    subjectGroup.style.display = "none";
    updateBreadcrumb();
    applyFilters();
  });
}

// Apply year/semester/subject filters to materials
function applyFilters() {
  if (!materialsList) return;
  if (currentQuery) {
    filterMaterials(currentQuery);
    return;
  }

  if (activeYear === "all") {
    displayMaterials(allMaterials);
    return;
  }

  const year = parseInt(activeYear);
  const filtered = {};

  for (const [key, config] of Object.entries(subjects)) {
    if (config.year !== year) continue;
    if (activeSemester !== "all" && config.semester !== parseInt(activeSemester)) continue;
    if (activeSubject !== "all" && key !== activeSubject) continue;

    if (allMaterials[config.name]) {
      filtered[config.name] = allMaterials[config.name];
    }
  }

  if (Object.keys(filtered).length === 0) {
    materialsList.innerHTML = `<p class="no-results"><i class="fa-solid fa-box-open"></i> No materials available for this selection yet. Stay tuned!</p>`;
  } else {
    displayMaterials(filtered);
  }
}

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

// Search functionality
let searchDebounceId = null;
if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";

    if (searchDebounceId) clearTimeout(searchDebounceId);
    searchDebounceId = setTimeout(() => {
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

function getFilteredBase() {
  // Get the currently filtered set based on year/semester/subject selectors
  if (activeYear === "all") return allMaterials;

  const year = parseInt(activeYear);
  const filtered = {};
  for (const [key, config] of Object.entries(subjects)) {
    if (config.year !== year) continue;
    if (activeSemester !== "all" && config.semester !== parseInt(activeSemester)) continue;
    if (activeSubject !== "all" && key !== activeSubject) continue;
    if (allMaterials[config.name]) {
      filtered[config.name] = allMaterials[config.name];
    }
  }
  return filtered;
}

function filterMaterials(query) {
  currentQuery = query;
  if (!query) {
    applyFilters();
    return;
  }

  const base = getFilteredBase();
  const filtered = {};
  for (const subject in base) {
    const matchingItems = base[subject].filter(item => {
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
    materialsList.innerHTML = `<p class="no-results"><i class="fa-solid fa-magnifying-glass"></i> No materials found for "${safeQuery}"</p>`;
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
    const subjectIcon = subjects[subjectKey]?.icon || '<i class="fa-solid fa-book"></i>';

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
        if (s <= fullStars) starsHtml += '<span class="star filled" data-star="' + s + '"><i class="fa-solid fa-star"></i></span>';
        else if (s === fullStars + 1 && hasHalf) starsHtml += '<span class="star half" data-star="' + s + '"><i class="fa-solid fa-star-half-stroke"></i></span>';
        else starsHtml += '<span class="star" data-star="' + s + '"><i class="fa-regular fa-star"></i></span>';
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
            <span class="meta-downloads" title="Downloads"><i class="fa-solid fa-download"></i> ${downloadCount}</span>
            <span class="meta-rating" title="${rating} / 5 (${ratingCount} ratings)">
              <span class="stars-row" data-folder="${file.folder}" data-file="${escapeHtml(file.name)}">${starsHtml}</span>
              <small>${ratingCount > 0 ? rating.toFixed(1) : ''}</small>
            </span>
          </div>
        </div>
        <div class="card-footer">
          <a href="${downloadUrl}" target="_blank" rel="noopener" class="download-link" data-folder="${file.folder}" data-file="${escapeHtml(file.name)}">
            <span class="download-icon"><i class="fa-solid fa-download"></i></span>
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
    'PDF': '<i class="fa-solid fa-file-pdf" style="color:#e74c3c"></i>',
    'DOC': '<i class="fa-solid fa-file-word" style="color:#2b579a"></i>',
    'DOCX': '<i class="fa-solid fa-file-word" style="color:#2b579a"></i>',
    'PPT': '<i class="fa-solid fa-file-powerpoint" style="color:#d04423"></i>',
    'PPTX': '<i class="fa-solid fa-file-powerpoint" style="color:#d04423"></i>',
    'ZIP': '<i class="fa-solid fa-file-zipper" style="color:#f39c12"></i>',
    'RAR': '<i class="fa-solid fa-file-zipper" style="color:#f39c12"></i>',
    'TXT': '<i class="fa-solid fa-file-lines" style="color:#95a5a6"></i>',
    'JPG': '<i class="fa-solid fa-file-image" style="color:#27ae60"></i>',
    'JPEG': '<i class="fa-solid fa-file-image" style="color:#27ae60"></i>',
    'PNG': '<i class="fa-solid fa-file-image" style="color:#27ae60"></i>'
  };
  return icons[ext] || '<i class="fa-solid fa-file" style="color:#00d4ff"></i>';
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
                      <h3><i class="fa-solid fa-clock"></i> GitHub API Rate Limit Reached</h3>
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
          <h3><i class="fa-solid fa-box-open"></i> No Materials Found</h3>
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
        <h3><i class="fa-solid fa-triangle-exclamation"></i> Error Loading Materials</h3>
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
    const urlParams = new URLSearchParams(window.location.search);

    // Handle ?category=SUBJECT from quick access buttons on homepage
    const category = urlParams.get('category');
    if (category && subjects[category]) {
      const config = subjects[category];
      // Auto-select year → semester → subject
      activeYear = String(config.year);
      activeSemester = String(config.semester);
      activeSubject = category;

      // Update year selector UI
      if (yearSelector) {
        yearSelector.querySelectorAll('.selector-pill').forEach(p => p.classList.remove('active'));
        const yearBtn = yearSelector.querySelector(`[data-year="${config.year}"]`);
        if (yearBtn) yearBtn.classList.add('active');
      }

      // Show and populate semester selector
      populateSemesterSelector(config.year);
      if (semesterGroup) semesterGroup.style.display = '';
      if (semesterSelector) {
        semesterSelector.querySelectorAll('.selector-pill').forEach(p => p.classList.remove('active'));
        const semBtn = semesterSelector.querySelector(`[data-semester="${config.semester}"]`);
        if (semBtn) semBtn.classList.add('active');
      }

      // Show and populate subject selector
      populateSubjectSelector(config.year, config.semester);
      if (subjectGroup) subjectGroup.style.display = '';
      if (subjectSelector) {
        subjectSelector.querySelectorAll('.selector-pill').forEach(p => p.classList.remove('active'));
        const subBtn = subjectSelector.querySelector(`[data-subject="${category}"]`);
        if (subBtn) subBtn.classList.add('active');
      }

      updateBreadcrumb();
      applyFilters();
    }

    // Handle ?q=search_term for search
    const query = urlParams.get('q');
    if (query && searchBar) {
      searchBar.value = decodeURIComponent(query);
      const inputEvent = new Event('input');
      searchBar.dispatchEvent(inputEvent);
      filterMaterials(decodeURIComponent(query).toLowerCase().trim());

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
            countEl.innerHTML = '<i class="fa-solid fa-download"></i> ' + (current + 1);
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
            s.innerHTML = '<i class="fa-solid fa-star"></i>';
            s.classList.add('filled');
            s.classList.remove('half');
          } else {
            s.innerHTML = '<i class="fa-regular fa-star"></i>';
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
