# Tech Stack & Architecture (v2.2)

## Core Stack
- **Framework:** React 18 with Vite 8 as the bundler and local development server.
- **Two-Layer Architecture:**
  - **Layer 1 (3D Canvas Overlay):** Sits on top (`zIndex: 10`). Powered by `@react-three/fiber`, `@react-three/drei`, and `@theatre/r3f`. Renders images as 3D planes, standard Lights, and a real 3D `PerspectiveCamera` bound to Theatre.js animatable sheets.
  - **Layer 2 (HTML DOM Underneath):** Sits underneath (`zIndex: 5`). Renders standard website elements, text scrollables, and buttons driven by a custom React Router.
- **Animation Engine:** `@theatre/core` and `@theatre/studio`. 
  - **Dynamic Sheets:** Supports 15 unique animation sequences per scene (3 states × 5 aspect ratios) managed via dynamic sheets named in the format `${SceneName}_${State}_${Resolution}` (e.g., `home_idle_16:9`).

## Pointer Interactions & Layer Forwarding
Since the 3D Canvas sits visually on top of the HTML layer, clicking the canvas normally blocks interaction with HTML elements underneath.
- **R3F Pointer Forwarding:** We attach an `onPointerMissed` listener to the Canvas. If a click falls on blank space rather than a 3D object, the canvas temporarily toggles its pointer-events to locate the exact HTML button or link underneath using `document.elementFromPoint`, programmatically clicking it to restore natural interactivity.
- **The Linker System:** Creator-configured objects in the editor are assigned `linkToRoute` target hashes (e.g., `/encyclopedia`). Clicking these objects in Play Mode automatically updates the URL hash, driving transitions.

## Mode Swapping Reactivity & Reloads
Theatre.js Studio is a global module that modifies local IndexedDB tables, mounts document styling, and configures key listeners that cannot be easily unmounted.
- **Hash Boundaries:** We track the `#/scenebuilder` route (case-insensitive) to differentiate between standard View Mode and Developer Builder Mode.
- **Clean reloads:** In `main.jsx`, we listen to `hashchange` events. If the user transitions between Builder Mode and View Mode, the app triggers `window.location.reload()`, performing a clean refresh to boot Theatre.js Studio or unload it cleanly.

## Local API (Vite Dev Server Middleware)
Vite's server configuration has custom middleware serving as our developer backend:
- `GET /api/images` - Discovery of all public images.
- `POST /api/upload` - Securely saves base64 uploaded custom assets to disk.
- `POST /api/save-animation` - Merges in-memory active modifications with the master ref and saves structural engine layouts and timeline frames to disk.
- `GET /api/get-state` - Serves current persistent json state.

## File Structure
- `src/main.jsx` -> Root mounting point. Configures boundaries and hooks hash change reloads.
- `src/engine/App.jsx` -> Orchestrates play/builder states, mounts the 3D canvas, sets up lights/cameras, and coordinates transitions.
- `src/engine/EditorUI.jsx` -> The glassmorphic floating developer sidebar panel. Provides asset uploads, scene hierarchy controls, the 3x5 matrix, and the bulk sync copy tool.
- `src/website/WebsiteRouter.jsx` -> The Layer 2 HTML pages switcher.
- `src/data/animation-state.json` -> Persistent scene objects and Theatre keyframe properties.
- `src/data/routes.json` -> Hash path mappings to 3D scenes.
