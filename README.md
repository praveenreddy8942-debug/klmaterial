# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (floating pill bar desktop, stacked full-width links on mobile)
- Study materials browser (GitHub API + subject filters + search)
- Animated profile image (single JPEG)
- Seasonal animation container (extensible for effects)
- Accessible touch targets (44px min)
- Back-to-top button appears on scroll
- **AIME Assistant Widget** - AI-powered chat assistant (client-side with server hook)
- **AI Lighting Effect** - Interactive visual background that reacts to mouse/touch

## New Features

### AIME Assistant Widget
A lightweight, accessible AI assistant chat widget located in the bottom-right corner.

**Features:**
- Built-in fallback responses for common questions
- Quick action buttons for materials, roadmap, and help
- Chat history persistence in localStorage
- Theme-aware (respects `prefers-color-scheme`)
- Keyboard navigable with ARIA labels
- Mobile responsive

**Connecting to an AI Backend:**
To integrate with a real AI service (e.g., OpenAI), edit `assets/aime-widget.js` and implement the `sendToServer()` function:

```javascript
async function sendToServer(message, history) {
  const response = await fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Note: Store API keys on your server, not in client code!
    },
    body: JSON.stringify({ message, history })
  });
  const data = await response.json();
  return data.reply;
}
```

**Important:** Never include API keys in client-side code. Use a backend proxy server.

**JavaScript API:**
```javascript
AIME.toggle(true);      // Show widget
AIME.toggle(false);     // Hide widget
AIME.clearHistory();    // Clear chat history
AIME.destroy();         // Remove widget
```

### AI Lighting Visual Effect
An animated gradient/lighting effect that creates a modern, AI-inspired look.

**Features:**
- Multiple animated gradient orbs
- Cursor/touch following orb
- Time-based color shifting
- Respects `prefers-reduced-motion`
- Performance optimized with `requestAnimationFrame`
- Mobile-optimized sizes

**JavaScript API:**
```javascript
AILighting.toggle(true);  // Enable effect
AILighting.toggle(false); // Disable effect
AILighting.destroy();     // Remove completely
```

**Configuration:**
```javascript
AILighting.config.enableCursorFollow = false;  // Disable cursor following
AILighting.config.timeBasedColorShift = false; // Disable color shifting
```

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
- Reduced motion support via `prefers-reduced-motion`

## File Structure
```
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (minimal no-op)
├── icon.svg                # App icon
├── assets/
│   ├── index-*.js/css      # Built React app assets
│   ├── aime-widget.js      # AIME assistant widget
│   ├── aime-widget.css     # AIME widget styles
│   ├── ai-lighting.js      # AI lighting effect
│   └── ai-lighting.css     # AI lighting styles
└── react-klmaterial/       # React source code
```

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Future Ideas
- Local caching of materials list
- Light theme toggle
- Hamburger menu option
- WebP profile source fallback
- Real AI backend integration for AIME

---
Maintained by Praveen Reddy.
