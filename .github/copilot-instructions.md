# Copilot Instructions for KLMaterial Study Hub

## Project Overview
A static website portfolio and study hub for CSE materials, built with vanilla HTML/CSS/JS and Firebase Storage. Designed for students to access academic resources with a modern, animated UI.

## Architecture & Key Files

### Core Pages Structure
- **[index.html](index.html)**: Portfolio homepage with skills/projects showcase and embedded Chatbase chatbot
- **[materials.html](materials.html)**: Firebase-powered file browser with subject-based grouping, search, and category filters
- **[roadmap.html](roadmap.html)**: 4-year B.Tech career guidance with learning resource links
- **[about.html](about.html)** & **[contact.html](contact.html)**: Personal info pages with brand icons

### Styling & Scripts
- **[style.css](style.css)**: Single CSS file with animations, responsive layouts, and component styles
- **[script.js](script.js)**: Firebase initialization template (NOT actively used - Firebase code is inline in materials.html)

## Key Features

### Materials Page
1. **Search Bar**: Real-time filtering by filename or subject
2. **Category Filters**: Quick filter buttons for each subject (BEEC, DM, PSC, DSD)
3. **Loading Animation**: Spinner with "Loading materials..." text while fetching from Firebase
4. **Back-to-Top Button**: Floating button appears after scrolling 300px

### UI/UX Components
- **Animated Backgrounds**: Pulsing gradients + moving grid pattern using `::before` and `::after` pseudo-elements
- **Brand Icons**: Font Awesome v6.5.1 icons with authentic brand colors on contact page
- **Responsive Design**: Breakpoints at 600px, 768px, and 1200px for mobile/tablet/desktop

## Firebase Integration Pattern

Materials are fetched client-side using Firebase Storage modular SDK (v11.0.1):

```javascript
// Subject mapping based on filename keywords
const subjects = {
  "BEEC": "Basic Electrical & Electronic Circuits (BEEC)",
  "DM": "Discrete Mathematics (DM)",
  // ... more subjects
};

// Files are grouped by matching keywords in filenames
listAll(storageRef).then((res) => {
  res.items.forEach((itemRef) => {
    const matchKey = Object.keys(subjects).find(key => 
      itemRef.name.toUpperCase().includes(key)
    );
  });
});
```

**Important**: Firebase config placeholders (`YOUR_API_KEY`, etc.) must be replaced with actual credentials in [materials.html](materials.html).

## SEO & Meta Tags

All pages include comprehensive meta tags:
- **Open Graph**: For Facebook/social sharing
- **Twitter Cards**: For Twitter sharing
- **Keywords**: Relevant search terms for each page
- **Descriptions**: Page-specific descriptions

Update these when adding new pages or changing content focus.

## Styling Conventions

### Animation System
- **Fade-in**: `.fade-in` class with `fadeInUp` keyframe
- **Hover effects**: Cards scale (`transform: scale(1.05)`) with glow shadows
- **Loading states**: Spinner animation + skeleton cards
- **Back-to-top**: Cyan gradient circle with `↑` arrow, shows on scroll

### Responsive Breakpoints
- **0-600px**: Extra small mobile (single column, compact UI)
- **601-768px**: Mobile (stacked layouts, touch-optimized)
- **769-1199px**: Tablet (2-column grids)
- **1200px+**: Desktop (3-column grids, max-width containers)

### Color Scheme
- Primary: `#00d4ff` (cyan-blue) for headings, links, borders
- Background: Radial/linear gradients between `#001d3d`, `#003566`, `#000814`
- Text: `#fff` (white), `#cce7ff` (light blue), `#b0e0ff` (muted blue)
- Brand colors: Original gradients for social media icons (Gmail, GitHub, LinkedIn, Facebook, WhatsApp)

## Common Tasks

**Adding new subject**: Upload files to Firebase with subject keyword in filename (e.g., `DM_Unit1.pdf`), add to `subjects` object and create filter button in [materials.html](materials.html).

**Updating styles**: All CSS in [style.css](style.css) with section comments like `/* ===== Materials Page Styling ===== */`.

**Adding new page**: Include viewport meta, SEO tags (Open Graph + Twitter), back-to-top button, and navigation with consistent structure.

**Modifying filters**: Update filter buttons in HTML and corresponding category matching logic in JavaScript.

## Development Notes

- **No build system**: Direct file editing, no compilation required
- **Deployment**: Static hosting (GitHub Pages)
- **File naming**: Use underscores in Firebase (auto-converted to spaces for display)
- **Touch optimization**: 44px minimum touch targets, webkit tap highlights
- **Accessibility**: Font smoothing, keyboard navigation support on interactive elements
