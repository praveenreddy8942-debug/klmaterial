# KLMaterial Study Hub

Static portfolio + study materials hub for B.Tech CSE. Built with vanilla HTML/CSS/JS and GitHub-hosted files (replacing Firebase). Mobile-first, animated UI.

## Features
- Responsive navigation (desktop floating pill bar, compact stacked links on mobile)
- Study materials browser (GitHub API + subject filters + search)
- Animated profile image with gradient glow
- Seasonal animation container (extensible for effects)
- Accessible touch targets (44px min) & smooth scrolling
- Back-to-top button appears on scroll

## Materials Loading
Files stored in the repo under subject folders, fetched via GitHub Contents API. LFS-supported PDFs use `download_url` (works with large files). README files excluded from listing.

## Image Fallback
Homepage profile uses a `<picture>` element:
1. Preferred: `assets/images/home-profile.jpg`
2. Fallback: root `profile.jpg`

Replace either image without changing markup; keep size < 300KB for mobile performance.

## Navigation Behavior
- Desktop: centered floating header with pill links.
- Mobile (<768px): sticky full-width bar; links stack vertically full-width for clarity.

## Tech Stack
- HTML5, CSS3 (custom animations, gradients)
- Vanilla JavaScript (GitHub API fetch, UI interactions)
- GitHub Pages hosting
- Optional analytics (Google tag)

## Accessibility & Performance
- High-contrast accent color `#00d4ff`
- Focus-friendly layout (links large and clearly separated)
- Smooth scroll & reduced motion friendly (animation durations moderated on mobile)

## Contributing
Open an issue or fork the repo. Keep styles modular by extending existing commented sections inside `style.css`. Test on mobile viewport (375px–430px width) before submitting.

## Future Ideas
- Hamburger toggle variant for mobile nav
- WebP image source for profile
- Client-side caching of materials JSON
- Light mode theme toggle (partial groundwork present)

---
Maintained by Praveen Reddy.
