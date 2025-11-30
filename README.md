# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (floating pill bar desktop, stacked full-width links on mobile)
- Study materials browser (GitHub API + subject filters + search)
- Animated profile image (single JPEG)
- Seasonal animation container (extensible for effects)
- Accessible touch targets (44px min)
- Back-to-top button appears on scroll

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

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Future Ideas
- Local caching of materials list
- Light theme toggle
- Hamburger menu option
- WebP profile source fallback

---
Maintained by Praveen Reddy.
