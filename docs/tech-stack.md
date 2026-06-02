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
├── index.html              # Main HTML (Home)
├── vite.config.js          # Vite config for multi-page build
├── package.json
├── agents.md               # AI agent context file
├── scripts/                # Helper scripts (build_json.js, remove_matte.py)
├── docs/                   # Documentation files
├── games/                  # Games category pages
│   ├── index.html          
│   ├── fossil-dig.html
│   ├── dino-quiz.html
│   └── dino-creator.html
├── explore/                # Explore category pages
│   ├── dino-map.html
│   ├── dino-timeline.html
│   ├── dino-meter.html
│   ├── encyclopedia.html
│   ├── dino-detail.html
│   ├── origins.html
│   └── extinction.html
├── printables/             # Printables category pages
│   ├── index.html
│   ├── coloring-pages.html
│   └── fan-art.html
├── src/
│   ├── style.css           # Design system + all component styles
│   ├── main.js             # App entry, all feature logic
│   └── data/
│       ├── encyclopedia.json   # Dinosaur encyclopedia data
│       ├── random-deet.json    # Facts for Random Deet
│       ├── fossil-dig.json     # Fossil dig game data
│       ├── dino-map.json       # Dinosaur discovery map coordinates
│       ├── quiz.json           # Quiz questions
│       ├── glossary.json       # Dictionary terms
│       ├── dino-meter.json     # Dino-o-Meter scale details
│       ├── timeline.json       # Geological timeline data
│       ├── dino-creator.json   # Creator options & naming parts
│       └── art.json            # Fan art gallery & coloring files
└── public/
    ├── fonts/              # Custom fonts (Adumu)
    └── images/             # Organized image assets (backgrounds, dinos, props, icons, etc.)
```

## Feature Modules (in main.js)

| Feature | Description |
|---------|-------------|
| Navigation | Sticky, scrollspy, hamburger mobile |
| Hero | Parallax bg, particles, CTA |
| Episodes | YouTube RSS + static fallback |
| Fossil Dig | Canvas scratch-off mini-game |
| Random Deet | Integrated directly into the mascot speech bubble on click |
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
