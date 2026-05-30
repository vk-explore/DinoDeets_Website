# Dino Deets Website — Agent Context

## Project Overview
The **Dino Deets** project has evolved from a standard static website into a fully **Interactive Scene-Based Visual Engine** powered by Theatre.js. It acts as an interactive, multi-view prehistoric world where users click objects in the environment to navigate between different animated scenes (e.g., Home, Encyclopedia, Fossil Dig).

## Key Decisions
- **Architecture:** Pure Scene-based Interactive Engine utilizing a **Two-Layer Architecture**:
  - **Layer 1:** A Theatre.js 3D animated overlay (powered by React Three Fiber/Drei). This layer plays transition-in, idle, and transition-out animations for the scenes. It sits on top of Layer 2.
  - **Layer 2:** A normal HTML layer (underneath Layer 1) containing standard website elements, scrollables, or static fixed pages. While transitioning between pages, Layer 2 makes previous elements pop out and pops in new elements.
  - Everything exists within this absolute-positioned dual-layer setup.
- **Scene Manager & Animations:** Each scene supports 15 different animation sequences managed by dynamic Theatre.js Sheets. These combinations include:
  - 3 States: `transition_in`, `idle`, `transition_out`
  - 5 Resolutions: `16:9`, `9:16`, `1:1`, `4:3`, `3:4`
- **Hosting:** Ultimately exported to GitHub Pages as a static interactive build.

## Priority Features (Next Up)
1. **The Linker:** Allow the creator to select an object in the Engine Editor and assign an `onClick` event that transitions the user to another Scene.
2. **Home Scene Composition:** Generate, cut out, and compose the complex layers for the primary landing scene.

## Agent Guidelines
- **Living Documentation:** Agents MUST proactively update `agents.md` and all files in the `docs/` folder as new decisions are made, requirements change, or features are implemented during the chat. Do not wait for explicit user prompts to keep documentation synchronized.
- **Complex Scene Composition:** NEVER use simple flat images for scenes. Every scene (loading screens, home page, subpages) MUST be built using complex, multi-layered compositions (e.g., separate layers for backgrounds, midgrounds, subjects, and effects like fire trails or dust). Assets must be generated with solid backgrounds, processed to be transparent, and layered using CSS/JS parallax effects to create deep, cinematic experiences.
- **Quality Control:** ALWAYS manually check generated images to ensure they are good enough, realistic, and cinematic before composing them.
- **Camera Animation:** Understand the entire scene dynamically. Do not just animate objects; incorporate cinematic camera animations (panning, zooming, tracking subjects) to tell a visual story.
- **Aspect Ratios:** Ensure background images are generated in landscape/widescreen aspect ratios (e.g., 16:9) where appropriate for full-screen web scenes.
- **Layer Purpose & Hierarchy:** Each layer must strictly fulfill its specific purpose without stealing focus. For example, a space background must be dark and subtle to convey the intent of stars, rather than being overly bright and distracting from the foreground globe.

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
