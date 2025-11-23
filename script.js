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

// DOM Elements
const materialsList = document.getElementById("materials-list");
const searchBar = document.getElementById("search-bar");
const clearBtn = document.getElementById("clear-search");
const filterButtons = document.querySelectorAll(".filter-btn");
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
if (searchBar) {
  searchBar.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (clearBtn) clearBtn.style.display = query ? "block" : "none";

    // Reset category filter when searching
    if (query && filterButtons.length > 0) {
      filterButtons.forEach(b => b.classList.remove("active"));
      filterButtons[0].classList.add("active");
      activeCategory = "all";
    }

    filterMaterials(query);
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
  for (const subject in grouped) {
    const section = document.createElement("section");
    section.className = "material-box";
    section.innerHTML = `<h2>${subject}</h2>`;
    grouped[subject].forEach((itemRef) => {
      getDownloadURL(itemRef).then((url) => {
        const name = itemRef.name.replace(/_/g, " ");
        const link = document.createElement("a");
        link.href = url;
        link.textContent = "📄 " + name;
        link.target = "_blank";
        link.className = "download-btn";
        section.appendChild(link);
      });
    });
    materialsList.appendChild(section);
  }
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
      displayMaterials(grouped);
    })
    .catch((error) => {
      console.error(error);
      materialsList.innerHTML = `<p class="no-results">⚠️ Error loading materials. Check Firebase config or rules.</p>`;
    });
}
