# Tech Stack & Architecture (v2.0)

## Core Stack
- **Framework:** Vanilla JS with Vite as the bundler and local development server. (Note: Moving towards React/R3F for the engine).
- **Two-Layer Architecture:**
  - **Layer 1 (Overlay):** `Canvas` powered by `@react-three/fiber`, `@react-three/drei`, and `@theatre/r3f`. This is a 3D animated overlay playing transition and idle scenes.
  - **Layer 2 (Underneath):** Standard HTML/DOM container for scrollable websites and static pages.
- **Animation Engine:** `@theatre/core` and `@theatre/studio`. 
  - **Dynamic Sheets:** To support 15 unique animations per scene (3 states $\times$ 5 resolutions), Theatre.js `Sheet`s are dynamically generated and named using the format `${SceneName}_${State}_${Resolution}` (e.g., `Home_idle_16:9`).

## Local API (Vite Dev Server)
The `vite.config.js` file is heavily customized to serve as a local backend for the Dino Engine Editor:
- `GET /api/images`: Scans the local filesystem to populate the Asset Manager.
- `POST /api/upload`: Receives base64 string images and writes them to disk.
- `POST /api/save-animation`: Writes the active Theatre state and Engine structural state to `src/data/animation-state.json`.

## File Structure
- `/src/engine/core.js` -> The main orchestrator. Handles Theatre.js initialization, UI injection, Scene swapping, and DOM spawning.
- `/src/data/animation-state.json` -> The single source of truth for all Scene data (what objects belong to what scenes) and Theatre animation keyframes.
- `/public/images/` -> The root folder for all generated assets.

## The "Virtual Camera"
Because this is a 2D DOM environment, we simulate a camera. `core.js` wraps all objects in a `<div id="scene-camera">`. We expose a `Global Camera` object to Theatre.js. When the camera's X/Y/Zoom are animated, the script mathematically inverts those values and applies them to the wrapper `div`, perfectly simulating panning and zooming.
