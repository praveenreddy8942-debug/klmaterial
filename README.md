# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (floating pill bar desktop, stacked full-width links on mobile)
- Study materials browser (GitHub API + subject filters + search)
- Animated profile image (single JPEG)
- Seasonal animation container (extensible for effects)
- Accessible touch targets (44px min)
- Back-to-top button appears on scroll
- **AIME Assistant**: Floating chat widget for study help (demo mode, client-side)
- **AI Lighting**: Animated gradient background effects (respects reduced-motion)

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
- Respects `prefers-reduced-motion` preference

---

## Enabling Server-Side AI (AIME)

The AIME widget ships in **demo mode** with client-side responses. To connect to a real AI backend:

1. **Set up your AI endpoint** on a server (e.g., `/api/ai/chat`)
2. **Edit `assets/aime-widget.js`**, find the `sendToServer()` function
3. **Replace the demo implementation** with an actual `fetch()` call:

```javascript
async function sendToServer(message) {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sessionId: getSessionId() })
  });
  const data = await response.json();
  return data.reply;
}
```

4. **Never expose API keys** in client-side code. Use server-side authentication.

---

## Service Worker Management

The site uses a **no-op service worker** during development to prevent stale cache issues.

### Unregister All Service Workers

If you experience caching problems, run this in your browser's DevTools Console:

```javascript
navigator.serviceWorker.getRegistrations().then(regs =>
  regs.forEach(r => r.unregister())
);
```

Then hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### Restore Production Caching

To enable offline support with caching:

1. **Option A: Workbox CLI**
   ```bash
   npm install -g workbox-cli
   workbox wizard
   workbox generateSW workbox-config.js
   ```

2. **Option B: Vite PWA Plugin** (for React build)
   ```bash
   npm install vite-plugin-pwa -D
   ```
   Then add to `vite.config.ts`.

3. **Option C: Git history**
   ```bash
   git show HEAD~1:sw.js > sw.js
   ```

---

## Testing After Merge

1. **Open in Incognito/Private window** (avoids cached state)
2. **Unregister any existing service workers** (see above)
3. **Hard refresh** the page
4. **Verify**:
   - No 404 errors in DevTools Network tab for `./assets/*`
   - AIME widget appears (bottom-right corner)
   - AI Lighting effects visible (subtle animated gradients)
   - Everything works with `prefers-reduced-motion: reduce`

---

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Future Ideas
- Local caching of materials list
- Light theme toggle
- Hamburger menu option
- WebP profile source fallback

---
Maintained by Praveen Reddy.
