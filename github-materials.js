// GitHub Materials Loader
// No Firebase needed - files hosted directly on GitHub!

const GITHUB_REPO = "praveenreddy8942-debug/klmaterial";
const GITHUB_BRANCH = "main";
const MATERIALS_PATH = "materials";

// Optional: Add your GitHub Personal Access Token to increase rate limit from 60 to 5000 requests/hour
// Leave empty for public access (60 requests/hour limit)
// To create a token: GitHub Settings → Developer settings → Personal access tokens → Generate new token (classic)
// Only needs "public_repo" scope
const GITHUB_TOKEN = ""; // Token removed - using public API (60 req/hour)

// Subject configuration
const subjects = {
  "BEEC": {
    name: "Basic Electrical & Electronic Circuits (BEEC)",
    icon: "⚡",
    folder: "BEEC"
  },
  "DM": {
    name: "Discrete Mathematics (DM)",
    icon: "🔢",
    folder: "DM"
  },
  "PSC": {
    name: "Problem Solving Through C (PSC)",
    icon: "💻",
    folder: "PSC"
  },
  "DSD": {
    name: "Digital System Design (DSD)",
    icon: "🔌",
    folder: "DSD"
  }
};

// DOM Elements
const materialsList = document.getElementById("materials-list");
const searchBar = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-search");
const filterButtons = document.querySelectorAll(".filter-pill");

let allMaterials = {};
let activeCategory = "all";

// GitHub API URL
function getGitHubAPIUrl(folder) {
  return `https://api.github.com/repos/${GITHUB_REPO}/contents/${MATERIALS_PATH}/${folder}?ref=${GITHUB_BRANCH}`;
}

// Get direct download URL for GitHub file
// Use github.com/raw path which handles Git LFS properly
function getDownloadUrl(file) {
  return `https://github.com/${GITHUB_REPO}/raw/${GITHUB_BRANCH}/${MATERIALS_PATH}/${file.folder}/${file.name}`;
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
    materialsList.innerHTML = `<p class="no-results">🔍 No materials found for "${query}"</p>`;
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

      const card = document.createElement("div");
      card.className = "material-card";
      card.innerHTML = `
        <div class="card-header">
          <span class="file-icon">${getFileIcon(fileExt)}</span>
          <span class="file-type-badge">${fileExt}</span>
        </div>
        <div class="card-body">
          <h3 class="material-name">${name}</h3>
        </div>
        <div class="card-footer">
          <a href="${downloadUrl}" download class="download-link">
            <span class="download-icon">⬇</span>
            <span>Download</span>
          </a>
        </div>
      `;
      grid.appendChild(card);
    });

    body.appendChild(grid);
    subjectCard.appendChild(header);
    subjectCard.appendChild(body);
    materialsList.appendChild(subjectCard);
  }
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
  if (!materialsList) return;
  materialsList.innerHTML = `
    <div class="advanced-loader-container">
      <div class="advanced-loader">
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
        <div class="loader-ring"></div>
        <span class="loader-emoji">📚</span>
      </div>
      <p class="loader-text">Loading materials from GitHub...</p>
    </div>
  `;

  try {
    const grouped = {};

    // Fetch files from each subject folder
    for (const [key, config] of Object.entries(subjects)) {
      try {
        // Add authentication header if token is provided
        const headers = {};
        if (GITHUB_TOKEN) {
          headers['Authorization'] = `token ${GITHUB_TOKEN}`;
        }
        
        console.log(`Fetching ${config.folder}...`);
        const response = await fetch(getGitHubAPIUrl(config.folder), { headers });
        
        if (!response.ok) {
          console.error(`API Error for ${config.folder}: ${response.status} ${response.statusText}`);
          
          // Check for rate limiting
          if (response.status === 403) {
            const errorData = await response.json();
            console.error('403 Error details:', errorData);
            if (errorData.message && errorData.message.includes('rate limit')) {
              materialsList.innerHTML = `
                <div class="no-results">
                  <h3>⏱️ GitHub API Rate Limit Reached</h3>
                  <p>Too many requests! Please wait 10-15 minutes and refresh.</p>
                  <p style="font-size: 0.9rem; opacity: 0.8; margin-top: 10px;">
                    <strong>Fix this permanently:</strong> The site owner can add a GitHub token to increase the rate limit from 60 to 5,000 requests/hour.
                  </p>
                </div>
              `;
              return;
            }
          }
          console.warn(`Folder ${config.folder} not found or empty`);
          continue;
        }

        const files = await response.json();
        console.log(`Found ${files.length} items in ${config.folder}`);
        
        // Filter only files (not directories)
        const materialFiles = files.filter(file => file.type === 'file');
        
        if (materialFiles.length > 0) {
          grouped[config.name] = materialFiles.map(file => ({
            name: file.name,
            folder: config.folder,
            size: file.size
          }));
        }
      } catch (error) {
        console.error(`Error loading ${config.folder}:`, error);
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
      displayMaterials(grouped);
    }
  } catch (error) {
    console.error("Error loading materials:", error);
    materialsList.innerHTML = `
      <div class="no-results">
        <h3>⚠️ Error Loading Materials</h3>
        <p>Could not load files from GitHub.</p>
        <p style="margin-top: 10px; font-size: 0.9rem;">Error: ${error.message}</p>
        <p style="margin-top: 10px; font-size: 0.85rem; opacity: 0.7;">Check browser console for details.</p>
      </div>
    `;
  }
}

// Load materials when page loads
if (materialsList) {
  loadMaterials();
}
