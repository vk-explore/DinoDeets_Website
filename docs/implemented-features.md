# Implemented Features (Dino Engine v2.0)

This document tracks the completed features and infrastructure for the Interactive Scene Engine.

## Completed
1. **The Great Purge:** Removed all legacy HTML scrolling structure, CSS styles, and unused JS to start with a blank absolute-positioned canvas.
2. **Local API Endpoints (Vite):** 
   - `/api/images`: Scans `public/images` to build the Asset Manager dropdown.
   - `/api/upload`: Accepts base64 image data and writes it securely to `public/images/uploads`.
   - `/api/save-animation`: Intercepts `engineState` (scene architecture) and `theatreState` (animations) and saves them both to `src/data/animation-state.json`.
3. **Dino Engine Editor (UI):** 
   - Custom floating developer panel built directly into the browser.
   - Handles Asset Management (uploading and adding to scenes).
   - Handles Scene Management (creating new scenes, deleting scenes, switching between them).
   - Save State button.
4. **Theatre.js Core Integration:**
   - Bootstraps `@theatre/core` and `@theatre/studio` dynamically for the development environment.
   - Attaches Theatre.js `sheet.object` controllers to dynamically generated DOM `<img>` elements.
5. **The Global Camera:**
   - Automatically wraps every scene in a `div#scene-camera`.
   - Exposes a `Global Camera` object to Theatre.js.
   - Inverts X, Y, and Rotation controls so animating the camera correctly pans and zooms the world visually.
