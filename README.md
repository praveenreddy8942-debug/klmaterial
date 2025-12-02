# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (floating pill bar desktop, stacked full-width links on mobile)
- Study materials browser (GitHub API + subject filters + search)
- Animated profile image (single JPEG)
- **AI Lighting** animated background effect (canvas-based, respects reduced motion)
- **AIME Assistant** floating chat widget (accessible, theme-aware, demo mode)
- Accessible touch targets (44px min)
- Back-to-top button appears on scroll

## Quick Start

1. Clone or fork the repository
2. Open `index.html` in a browser
3. For development, use a local server: `python -m http.server 8000`

## Testing the Site

### Clearing Stale Service Workers
If you see a black/blank screen or stale content:

1. Open DevTools (F12 or Ctrl+Shift+I)
2. Go to **Application** → **Service Workers**
3. Click **Unregister** for any listed workers
4. Hard reload: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

Or run this in the browser console:
```javascript
navigator.serviceWorker.getRegistrations().then(r => r.forEach(reg => reg.unregister()));
location.reload(true);
```

### Verifying Assets Load Correctly
1. Open the site in an Incognito/Private window
2. Open DevTools → Network tab
3. Reload the page
4. Confirm no 404 errors for CSS, JS, or asset files

## New Features

### AI Lighting Background
A performant canvas-based animated background with glowing orbs.

**API:**
```javascript
AILighting.enable();   // Start animation
AILighting.disable();  // Stop animation
AILighting.toggle();   // Toggle state
AILighting.isEnabled(); // Check state
```

**Features:**
- Respects `prefers-reduced-motion`
- Pauses when tab is hidden
- Configurable via `AILighting.setConfig()`

### AIME Assistant Widget
An accessible floating chat widget with demo responses.

**API:**
```javascript
AIMEWidget.open();     // Open chat
AIMEWidget.close();    // Close chat
AIMEWidget.toggle();   // Toggle
AIMEWidget.isOpen();   // Check state
AIMEWidget.getMessages(); // Get chat history
```

**Features:**
- Keyboard accessible (Tab, Enter, Escape)
- ARIA labels for screen readers
- Focus trapping in modal
- Demo responses (no API key required)

### Integrating a Real AI Backend
To connect AIME to a real AI service:

1. Create an API endpoint (e.g., `/api/chat`)
2. Set a custom response handler:

```javascript
AIMEWidget.setResponseHandler(async (message) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  const data = await response.json();
  return data.response;
});
```

**Note:** Keep API keys server-side. Never commit secrets to the repository.

## Materials Loading
Files stored in the repo under subject folders, fetched via GitHub Contents API. LFS-supported PDFs use raw download URLs.

## Profile Image
Homepage uses `profile.jpg` directly. Keep size reasonable (< 300KB) for mobile performance.

## Navigation Behavior
- Desktop: centered floating header with pill links.
- Mobile (<768px): sticky full-width bar; links stack vertically.

## Tech Stack
- HTML5, CSS3 (custom animations, gradients)
- Vanilla JavaScript (GitHub API fetch, UI interactions)
- GitHub Pages hosting
- Optional analytics (Google tag)

## Asset Structure
```
/
├── index.html           # Main entry point
├── sw.js                # Minimal no-op service worker
├── manifest.json        # PWA manifest
├── assets/
│   ├── site-base.css    # Baseline styles (prevents black screen)
│   ├── ai-lighting.js   # Animated background effect
│   ├── ai-lighting.css
│   ├── aime-widget.js   # Chat assistant widget
│   ├── aime-widget.css
│   └── index-*.js/css   # Bundled app files
└── react-klmaterial/    # React source (for rebuilding)
```

## Service Worker Notes
The current `sw.js` is a minimal no-op that:
- Skips waiting and claims clients immediately
- Clears any existing caches on activation
- Does NOT intercept fetch events (prevents stale content)

To restore production caching with Workbox:
1. Install: `npm install -g workbox-cli`
2. Configure: Create `workbox-config.js`
3. Generate: `workbox generateSW workbox-config.js`

## Accessibility & Performance
- High-contrast accent color `#00d4ff`
- Large touch targets & smooth scroll
- Moderated animation speeds on mobile
- Respects `prefers-reduced-motion` for all animations
- ARIA labels on interactive elements

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Future Ideas
- Local caching of materials list
- Light theme toggle
- Hamburger menu option
- WebP profile source fallback
- Real AI backend integration

---
Maintained by Praveen Reddy.
