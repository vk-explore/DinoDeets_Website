# Dino Deets Website — Agent Context

## Project Overview
Website for the **Dino Deets** podcast — a kid-and-family-friendly dinosaur podcast hosted by **Devaansh Nara** on YouTube (@dinodeets). The site features a dark "prehistoric meets modern" aesthetic with interactive elements like a fossil dig game, animated dino mascot, and auto-pulled YouTube episodes.

## Key Decisions
- **Theme:** Dark mode default ("Night at the Museum" vibe)
- **Target Audience:** Growing kids (primary), parents (secondary)
- **Hosting:** GitHub Pages (static build via Vite)
- **Episodes:** Auto-pulled from YouTube channel @dinodeets
- **Socials:** YouTube, Instagram, Facebook only
- **Audio:** Ambient prehistoric sounds with toggle
- **Domain:** TBD
- **Architecture (v2):** Multi-page Vite application with separate categories (Games, Explore, Printables).
- **Image Generation:** For transparent images, generate with a green matte background and programmatically remove it using `scripts/remove_matte.py`.
- **Image Optimization:** All static images are optimized to WebP format to reduce asset size while retaining visual quality. Transparency is preserved for transparent assets (e.g., mascot, logo).

## Priority Features (Approved by User)
1. Fossil Dig mini-game (Canvas scratch-off - Completed with 1-Min timer, combo streak scoring, and game tips)
2. Animated Dino Mascot (Completed - SVG site companion)
3. Dino Map (interactive fossil discovery locations)
4. Random Deet button (instant dino facts)
5. Dino Encyclopedia sizing and responsive text scaling (Completed)
6. Expanded Prehistoric Stories (Origins & Extinction expanded with details and custom covers)
7. A Paleontologist's Guide (Completed - detailed page explaining paleontology steps for kids)
8. Dino Timeline Explorer (Completed - refactored vertical scroll layout with custom strata scrollbar, horizontal stage chips with detailed hover tooltips, and educational Triassic empty-state explanations)
9. Dino-o-Meter Size Comparison (Completed - interactive size comparison tool with dynamic scale grid, neutral side-profile cutouts, human silhouette, and automatic aspect-ratio zoom/resizing. Full-width scale layout with modal picker dialog for adding dinosaurs.)
10. Dino Creator Removal & Navigation Cleanups (Completed - removed dino-creator.html page and assets, removed Dino Creator and Paleo Guide links from dropdown menus, removed "Back to Encyclopedia" buttons from story detail pages, and styled navigation dropdown links with block formatting and padding-left transitions on hover.)
11. Smooth Page Transitions & Progress Bar (Completed - implemented client-side PJAX routing to swap page content smoothly, showing a gold-green-orange trickle progress bar at the top, and dissolving the old page content into the new page to eliminate browser loading flashes.)
12. Image Path Resolution (Completed - resolved relative-to-absolute asset loading issues on PJAX routing transitions across varying directory depths)
13. Hero Logo & Header Customizations (Completed - replaced hero text heading with the logo image using SEO-friendly semantics, and replaced the plain logo text inside the header navigation across all pages with a custom-generated transparent logo image featuring a dino footprint in the "O")

## Agent Guidelines
- **Living Documentation:** Agents MUST proactively update `agents.md` and all files in the `docs/` folder as new decisions are made, requirements change, or features are implemented during the chat. Do not wait for explicit user prompts to keep documentation synchronized.
- **Browser Testing:** Chrome is not installed on this environment; do not attempt browser testing or launching browser subagents.

## Documentation
- [Roadmap](docs/roadmap.md) — Feature phases and release plan
- [Design System](docs/design-system.md) — Colors, typography, spacing tokens
- [Tech Stack](docs/tech-stack.md) — Architecture, APIs, file structure
- [User Requirements](docs/user-requirements.md) — Detailed user stories, constraints, and business logic
- [Implemented Features](docs/implemented-features.md) — Log of what has been built and completed so far

## Social Links
- YouTube: https://www.youtube.com/@dinodeets
- Instagram: (handle TBD)
- Facebook: (handle TBD)

## Episode Schedule
- New episodes every **Friday**
- Content: Dinosaurs, fossils, Greek myths, folklore, expert interviews
