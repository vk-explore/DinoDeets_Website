# Implemented Features (Dino Engine v2.0)

This document tracks the completed features and infrastructure for the Interactive Scene Engine.

## Completed
1. **The Great Purge:** Removed all legacy HTML scrolling structure, CSS styles, and unused JS to start with a blank absolute-positioned canvas.
2. **Local API Endpoints (Vite):** 
   - `/api/images`: Scans `public/images` to build the Asset Manager dropdown.
   - `/api/upload`: [FIXED] Accepts base64 image data via both `base64` and `image` property keys and writes them securely to `public/images/uploads`, returning both `url` and `path` for perfect UI compatibility.
   - `/api/save-animation`: Intercepts `engineState` (scene architecture) and `theatreState` (animations) and saves them both to `src/data/animation-state.json`.
3. **Dino Engine Editor (UI):** 
   - Custom floating developer panel built directly into the browser, completely restyled to follow the brand's Deep Earth glassmorphic design token aesthetics.
   - Handles Asset Management (uploading and adding to scenes) with live library drawer cards.
   - Handles Scene Management (creating new scenes, deleting scenes, renaming scenes) with automated light/camera boots and clean reloading triggers.
   - [NEW] Tabbed navigation interface: Hierarchy, 15-Sheet Matrix, and Advanced Copy Tool.
4. **Theatre.js Core Integration:**
   - Bootstraps `@theatre/core` and `@theatre/studio` dynamically for the development environment.
   - Attaches Theatre.js `sheet.object` controllers to dynamically generated 3D image planes.
5. **The Global Camera & Lights:**
   - Instantly sets up cameras and standard directional/ambient light components for new scenes.
   - Exposes customizable lights and cameras in the Hierarchy for visual outliner selection.
6. **15-Sheet Animation Matrix Dashboard & Sync Tool (v2.1):**
   - **3x5 Interactive Grid:** Visual board displaying all 15 sheets of the active scene (Intro, Idle, Outro states across 5 responsive aspect ratios). Displays glowing `🎬 Configured` or empty `⚪` badges to track animation coverage.
   - **Bulk Animation Duplicator:** Streamlined copy tool allowing a creator to select any source sheet and copy all keyframes/static overrides instantly to all other resolutions, other states, all 14 other combinations, or a custom checklist of sheets.
   - **Ref-Based State Sync & Intelligent Merge:** [FIXED] Introduces an in-memory `masterTheatreStateRef` and an intelligent `mergeTheatreState` algorithm. This resolves the critical bug where Theatre.js's lazy-loading of sheets caused auto-saves to discard/delete all inactive sheets from `animation-state.json` on context-switch or auto-save. Now, active/modified sheet changes are overlaid onto the master ref, keeping all 15 sheets perfectly intact.
7. **Design System Integration:**
   - Defined core design variables from `docs/design-system.md` inside `src/style.css` and applied them globally.
   - Added styling features (glassmorphism backdrops, golden-amber glowing outlines, and custom scrollbars) for a state-of-the-art interactive editing panel.
8. **Robust Mode Switching Reactivity & Environment Safeguards (v2.2):**
   - **Hash Router Synchronization:** Resolved a critical hash routing limitation where client-side navigation to the `#/scenebuilder` route without a hard refresh failed to initialize Theatre.js Studio and the custom Dino Builder UI. Implemented an automated global `hashchange` event listener in `main.jsx` that detects boundary crossings between website view and developer editor mode and forces a clean page reload.
   - **Case-Insensitive Routing Robustness:** Converted route evaluation (`isBuilder`) to be entirely case-insensitive (`.toLowerCase()`). This handles mixed-case user entries such as `#/SceneBuilder` or `#/sceneBuilder` flawlessly.
   - **Universal Builder Accessibility:** Decoupled Theatre.js Studio initialization from `import.meta.env.DEV`, allowing the visual scene editor and timeline interface to boot reliably in preview, staging, and static production hostings.
   - **Temporal Dead Zone Reference Fix (`App.jsx`):** Resolved a critical `ReferenceError: Cannot access 'sheet' before initialization` crash during mounting by correctly lifting the declaration of the Theatre.js `sheet` and `sheetName` variables above the React `useEffect` hooks that referenced them.
   - **3D Canvas Render Protection (`CanvasErrorBoundary`):** Added a React Error Boundary around the React Three Fiber `<Canvas>`. If Three.js, R3F, or WebGL throws a runtime error, a beautiful error diagnostics panel is displayed with standard trace details, ensuring that the custom Dino Builder sidebar stays 100% responsive and visible for correction.
   - **Developer Diagnostics Logs:** Embedded descriptive booting logs (`🦖 [DinoDeets Engine v2] Booting...`) in the browser console to trace current mode, loaded state, and Canvas status for effortless debugging.
9. **Codebase Audit & Data Hygiene (v2.3):**
    - **Orphaned Theatre.js Data Cleanup:** Removed 6 stale sheet entries from `animation-state.json` — 5 `New Scene_*` orphan sheets for a deleted scene and 1 case-mismatched `Home_idle_16:9` duplicate. Reduced state file from ~710 lines to ~150 lines.
    - **Route Map Completion:** Added missing `/encyclopedia` and `/fossil-dig` mappings to `routes.json`, enabling the 3D scene layer to properly switch when navigating between pages.
    - **Dead CSS Removal:** Removed overridden `#layer-1-3d` and `#layer-2-html` CSS rules from `style.css` that were fully superseded by dynamic inline styles in `App.jsx` (required for sidebar-width reactivity).
    - **Favicon Creation:** Created a brand-consistent SVG favicon (dinosaur footprint in Fossil Gold on Deep Earth gradient) and fixed the broken `index.html` reference.
    - **Code Cleanup:** Removed duplicate assignment line in `handleUpdateObject`, deleted leaked `AGENTS.md` from `public/images/`.
    - **Documentation Sync:** Updated `roadmap.md` to reference current `App.jsx`/`EditorUI.jsx` instead of removed `core.js`.
