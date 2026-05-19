# Dino Deets — Technical Stack

## Core
- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Grid, Flexbox, animations
- **Vanilla JavaScript** — ES Modules, no framework dependencies

## Build Tool
- **Vite** — Dev server with HMR, static build output

## Key APIs & Techniques
- **YouTube RSS Feed** — Auto-fetch episodes from @dinodeets channel (via rss2json proxy)
- **Canvas API** — Fossil Dig mini-game + Dino Creator drawing engine
- **Intersection Observer** — Scroll-triggered entrance animations
- **CSS Custom Properties** — Theming and design tokens
- **Range Input** — Dino-o-Meter size comparison slider
- **Dynamic DOM Rendering** — Quiz, timeline, dictionary, gallery, and map are data-driven

## Deployment
- **GitHub Pages** — Static hosting from `dist/` folder
- **Build command:** `npm run build`
- **Base path:** Configurable via `vite.config.js`

## File Structure
```
DinoDeets_Website/
├── index.html              # Main HTML (all sections)
├── vite.config.js          # Vite configuration
├── package.json
├── agents.md               # AI agent context file
├── docs/
│   ├── roadmap.md          # Feature phases & release plan
│   ├── design-system.md    # Colors, typography, spacing tokens
│   └── tech-stack.md       # Architecture, APIs, file structure
├── src/
│   ├── style.css           # Design system + all component styles (~1200 lines)
│   ├── main.js             # App entry, all feature logic (~900 lines)
│   └── data/
│       ├── dino-facts.js   # Dinosaur facts + fossil data
│       ├── map-data.js     # Fossil discovery locations (global)
│       ├── phase3-data.js  # Quiz, glossary, sizes, timeline
│       └── phase4-data.js  # Creator parts, fan art, coloring, names
└── public/
    ├── favicon.svg
    └── images/
        ├── hero-bg.png     # Hero landscape
        ├── mascot.png      # Baby dino mascot
        ├── logo.png        # Fossil skull logo
        ├── world-map.png   # Dark world map
        ├── dinos/          # Species illustrations (5 images)
        ├── fossils/        # Fossil assets (2 images)
        ├── fanart/         # Fan art gallery (3 images)
        └── coloring/       # Coloring pages (3 images)
```

## Feature Modules (in main.js)

| Feature | Description |
|---------|-------------|
| Navigation | Sticky, scrollspy, hamburger mobile |
| Hero | Parallax bg, particles, CTA |
| Episodes | YouTube RSS + static fallback |
| Fossil Dig | Canvas scratch-off mini-game |
| Random Deet | 30 facts with species-matched images |
| Dino Map | 12 sites with Mercator projection pins |
| Countdown | Live timer to next Friday episode |
| Dino Quiz | 10 questions, scoring, results tiers |
| Dino-o-Meter | Slider size comparison, 8 species |
| Timeline | Horizontal scroll through geological eras |
| Dictionary | A-Z glossary with search & letter filter |
| Ask Devaansh | Question submission form |
| **Dino Creator** | Canvas drawing with 5 head/body/tail/special options + 8 colors |
| **Fan Art Gallery** | Community art grid with lightbox overlay |
| **Coloring Pages** | Downloadable line art for printing |
| Mascot | Floating companion with speech bubbles |
