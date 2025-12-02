# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (floating pill bar desktop, stacked full-width links on mobile)
- Study materials browser (GitHub API + subject filters + search)
- Animated profile image (single JPEG)
- Seasonal animation container (extensible for effects)
- Accessible touch targets (44px min)
- Back-to-top button appears on scroll
- **AIME Assistant Widget** - AI-powered chat assistant (demo mode, with server hook)
- **AI Lightings** - Interactive canvas background animation

## New Features

### AIME Assistant Widget

A lightweight, accessible chat widget that appears in the bottom-right corner.

**Files:**
- `assets/aime-widget.css` - Widget styles
- `assets/aime-widget.js` - Widget logic with demo responses

**Features:**
- Accessible toggle button and keyboard navigation
- Demo responses for common queries
- Documented server hook for future AI integration

**Server Integration:**

To connect AIME to a real AI backend:

1. Set up your server endpoint (e.g., `/api/chat`)
2. Edit the `sendToServer()` function in `assets/aime-widget.js`:

```javascript
async function sendToServer(message) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: message })
  });
  const data = await response.json();
  return data.reply;
}
```

3. **Never commit API keys** - keep them server-side only!

### AI Lightings Canvas

A performant, interactive background animation with flowing light particles.

**Files:**
- `assets/ai-lighting.css` - Canvas styles
- `assets/ai-lighting.js` - Animation logic

**Features:**
- RequestAnimationFrame-based for smooth performance
- Respects `prefers-reduced-motion` preference
- Mouse-interactive particle highlighting
- Toggle button to enable/disable

**API:**
```javascript
window.AILighting.enable()   // Enable the effect
window.AILighting.disable()  // Disable the effect
window.AILighting.toggle()   // Toggle on/off
window.AILighting.isEnabled() // Check current state
```

## Troubleshooting

### Black/Blank Page Issues

If you encounter a black or blank page:

1. **Unregister Service Workers:**
   - Open DevTools > Application > Service Workers
   - Click "Unregister" for all service workers
   - Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

2. **Clear Browser Cache:**
   - DevTools > Application > Storage > Clear site data

3. **Test in Incognito Mode:**
   - Open the site in an incognito/private window

4. **Check Console:**
   - Look for 404 errors on asset files
   - The debug helper logs visibility issues

### Debug Helper

The `assets/debug-force-visible.js` script (included in feature branch) helps diagnose large-screen visibility issues:

- Forces `#root` visible if hidden
- Hides common overlay elements
- Logs diagnostic info to console

**Remove this script before merging to main if not desired.**

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

## Accessibility & Performance
- High-contrast accent color `#00d4ff`
- Large touch targets & smooth scroll
- Moderated animation speeds on mobile
- AI Lightings respects reduced motion preference

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Security Notes
- No API keys are committed to the repository
- AI features use client-only demo mode by default
- Server integration requires separate backend setup
- Service worker is currently in no-op mode to prevent stale caching

## Future Ideas
- Local caching of materials list
- Light theme toggle
- Hamburger menu option
- WebP profile source fallback
- Full AI backend integration

---
Maintained by Praveen Reddy.
