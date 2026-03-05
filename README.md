# 📚 KL Material Study Hub

> **Free CSE study materials, career roadmaps & smart study assistant for B.Tech students at KL University.**

🌐 **Live Site:** [klstudyhub.github.io/klmaterial](https://klstudyhub.github.io/klmaterial/)

---

## ✨ Features

### 📖 Study Materials
- **9 subjects** across Year 1 (Semester 1 & 2): BEEC, DM, PSC, DSD, PP, LACE, DS, FIS, COA
- Cascading **Year → Semester → Subject** filter selectors
- Full-text **search** with debounced input
- Direct **PDF download** links (GitHub-hosted, LFS-supported)
- Download tracking, star ratings & view counts via Supabase

### 🤖 KL Study Buddy (Smart Chatbot)
- **100% secure** — no API keys, fully client-side
- Built-in knowledge base covering all subjects, materials, roadmaps & exam tips
- Smart keyword matching engine with scoring
- Quick reply suggestion buttons
- Works **offline** — perfect for PWA

### 🗺️ Career Roadmap
- 4-year B.Tech CSE roadmap with skills, projects & resources per year
- Links to Roadmap.sh, Udemy & other learning platforms

### 🎨 Design & UI
- **Dark & Light theme** toggle with localStorage persistence
- Premium floating navbar (desktop) + bottom navigation bar (mobile)
- Particle background system with mouse interaction
- Seasonal animations (snow, petals, fireflies, leaves)
- Scroll reveal animations & scroll progress indicator
- Custom cursor (desktop only)
- Fully responsive — mobile-first design

### ⚡ Performance & PWA
- **Progressive Web App** — installable, works offline
- Service Worker with smart caching strategy
- GitHub Trees API for single-call material loading (fallback: jsDelivr → Contents API)
- 30-minute client-side cache for file listings
- Deferred script loading & critical CSS

### ♿ Accessibility
- Skip-to-content link
- ARIA attributes & keyboard navigation
- Focus trap in mobile menu
- `prefers-reduced-motion` support
- 44px minimum touch targets

### 🔍 SEO
- Open Graph & Twitter Card meta tags on all pages
- JSON-LD structured data
- Semantic HTML5 with proper heading hierarchy
- XML sitemap & robots.txt

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Hosting | GitHub Pages |
| Materials | GitHub repo (LFS for PDFs) |
| Database | Supabase (downloads, ratings, views) |
| Analytics | Google Analytics (gtag.js) |
| Fonts | Google Fonts (Poppins) |
| Icons | Font Awesome 6.5 |

---

## 📁 Project Structure

```
klmaterial/
├── index.html          # Homepage
├── materials.html      # Study materials browser
├── roadmap.html        # Career roadmap
├── about.html          # About page
├── contact.html        # Contact page
├── offline.html        # Offline fallback
├── style.css           # All styles (6300+ lines)
├── ui.js               # Navigation, hamburger menu, back-to-top
├── github-materials.js # Material loading, search, filters
├── chatbot.js          # Smart local chatbot
├── animations.js       # Seasonal & counter animations
├── advanced-features.js# Theme, particles, scroll reveal, cursor
├── supabase-db.js      # Supabase integration (downloads, ratings)
├── sw.js               # Service Worker
├── manifest.json       # PWA manifest
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawler rules
└── materials/          # Study material PDFs (LFS-tracked)
    ├── BEEC/
    ├── DM/
    ├── PSC/
    ├── DSD/
    ├── PP/
    ├── LACE/
    ├── DS/
    ├── FIS/
    └── COA/
```

---

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/klstudyhub/klmaterial.git
   ```

2. **Add materials:** Place PDF files in the appropriate `materials/<SUBJECT>/` folder.

3. **Deploy:** Push to `main` — GitHub Pages deploys automatically.

---

## 🤝 Contributing

Open an issue or fork the repo. Test on mobile viewport (375px–430px width) before submitting.

---

## 📬 Contact

- **GitHub:** [@klstudyhub](https://github.com/klstudyhub)
- **LinkedIn:** [Praveen Reddy](https://www.linkedin.com/in/praveen-reddy-37b0a6365)
- **WhatsApp Study Group:** [Join here](https://chat.whatsapp.com/LWNBaMmNNuSH08ztjFg39B)

---

**Made with ❤️ by Praveen Reddy**
