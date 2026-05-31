# Dino Deets Interactive Scene Engine — Master Roadmap

This roadmap outlines the complete development cycle for transforming Dino Deets into an immersive, scene-based Interactive Engine.

## Phase 1: Engine Architecture & Tooling (Complete)
- [x] Wipe legacy scrolling UI from `index.html`, `style.css`, and `main.js`.
- [x] Create the local `vite.config.js` API to handle image discovery, uploads, and state saving.
- [x] Build the Engine UI (`src/engine/App.jsx` + `EditorUI.jsx`) with the Scene Manager and Asset Manager.
- [x] Hook the Engine deeply into `Theatre.js` so newly added UI objects immediately register as animatable elements.
- [x] Implement **Two-Layer Architecture**: Layer 1 (Theatre.js 3D overlay) on top, Layer 2 (HTML DOM) underneath.
- [x] Refactor Scene Manager to support 15 animation variations per scene (3 states x 5 resolutions) using dynamic Theatre.js sheets.

## Phase 2: The Linking System (Complete)
- [x] Implement the "Linker" Tool in the Engine Editor.
- [x] Allow clicking any `theatre-object` in the Editor and assigning an `onClick` destination (e.g., "Go to Scene: Encyclopedia").
- [x] Build the Play Mode runtime so clicking linked objects executes a smooth transition to the target scene.
- [x] Orchestrate transitions between layers: Layer 1 plays transition-out/in, Layer 2 swaps content.

## Phase 3: World Building - The Home Scene
- [ ] Use AI generation to create cinematic, layered assets for the Home Scene (Background Space, Earth, Asteroid, etc.).
- [ ] Process assets through the background removal script for transparency.
- [ ] Upload and compose the assets into the Home Scene using the Editor.
- [ ] Animate the Home Scene in Theatre.js (Camera pans, asteroid fire trails).

## Phase 4: Rebuilding the Encyclopedia Scene
- [ ] Create a new "Encyclopedia" Scene via the Editor.
- [ ] Generate the UI components as layered images (Grid backgrounds, polaroids of dinosaurs).
- [ ] Build a custom scrolling behaviour inside the Engine for the Encyclopedia view.
- [ ] Link the Home Scene's "Signpost" object to the Encyclopedia Scene.

## Phase 5: Rebuilding Mini-Games (Fossil Dig & Quiz)
- [ ] Create "Fossil Dig" and "Quiz" Scenes.
- [ ] Re-integrate the HTML5 Canvas logic for the scratch-off game into the new Engine architecture.
- [ ] Build the interactive state machines for the Quiz using linked scenes (e.g., "Click A -> Go to Correct Scene", "Click B -> Go to Wrong Scene").

## Phase 6: Polish, Sound & Export
- [ ] Integrate ambient prehistoric audio (jungle ambiance, distant roars, wind) that crossfades between Scenes.
- [ ] Add global micro-animations for linked objects (e.g., all clickable objects slowly breathe or pulse).
- [ ] Build the Production Exporter: A script that strips out the Editor UI and packages the Engine into a static, highly optimized website for GitHub Pages.
- [ ] Final deployment of the Interactive Engine to GitHub Pages.
