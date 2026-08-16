---
name: portfolio-dev
description: >-
  Development runbook, architecture patterns, and verification commands for Portfolio
  Astro, TailwindCSS, and Cloudflare Pages application.
---

# Portfolio Development Skill

This skill provides procedures and guidelines for developing and verifying the personal Portfolio static website.

## 1. Project Architecture & Stack

- **Framework**: Astro 4.x / TypeScript
- **Styling**: TailwindCSS
- **Deployment**: Cloudflare Pages / Docker Nginx static hosting
- **Testing**: Vitest + Playwright
- **Optimization**: Zero-JS static generation by default, responsive layouts, fast Core Web Vitals

## 2. Key Commands

### Environment Setup
```powershell
npm ci
```

### Development & Build
```powershell
# Run Astro dev server
npm run dev

# Run typecheck
npm run check

# Run tests
npm test

# Build static output to dist/
npm run build

# Preview built static site
npm run preview
```

## 3. Development Guidelines

1. **Astro Islands**: Use minimal client-side JavaScript (`client:load`, `client:visible`) only where interactive components require it.
2. **SEO & Performance**: Maintain proper OpenGraph tags, semantic HTML headers, responsive image srcsets, and accessible navigation.
3. **No Unvalidated Assets**: Optimize all images and static media before committing to `public/` or `src/assets/`.

## 4. Git Tagging & Release Workflow

- **Release Tag Standard**: `vMAJOR.MINOR.PATCH` (e.g. `v2.1.0`)
- **Commands**:
  ```powershell
  git tag -a v2.1.0 -m "Release v2.1.0: Updated project showcase and dark theme"
  git push origin v2.1.0
  ```
