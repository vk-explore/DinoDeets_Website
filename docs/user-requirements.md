# User Requirements & Business Logic

## Primary Goal
To empower the creator (the User) with a custom, browser-based "Dino Engine Editor" that allows them to visually compose, animate, and link complex multi-layered prehistoric scenes without needing to write code manually for every element.

## The Creator Workflow
- **Custom Built Interactive Engine:** Must not use standard website builder templates. The experience must feel like a video game in the browser.
- **Two-Layer Experience:**
  - **Layer 1:** A 3D animated overlay (Theatre.js) that handles the rich, cinematic scene transitions and idle states.
  - **Layer 2:** An underlying HTML layer that handles standard website content. During transitions, Layer 1 will animate (e.g., wipe, fade, or cinematic camera move), while Layer 2 swaps its content (pops out old elements, pops in new elements).
- **Cinematic Scene Management:** Each scene must support 15 distinct animation sequences to ensure a perfect experience across all devices and states:
  - **States:** `transition_in`, `idle`, `transition_out`
  - **Resolutions:** `16:9`, `9:16`, `1:1`, `4:3`, `3:4`
- **Immersive Layers:** Use complex, multi-layered visual compositions. No flat images. Every scene needs distinct foregrounds, midgrounds, subjects, backgrounds, and VFX (dust, fire).
- **Full Customizability:** The creator needs an in-browser Engine Editor to:
  1. **Asset Management:** Upload PNG images directly and register them as visual 3D plane meshes.
  2. **Scene Composition:** Create, rename, or delete scenes and set up default camera and light rigs.
  3. **Visual Animation:** Select elements and keyframe-animate positioning, scales, rotations, and lighting intensities.
  4. **Dynamic Linking:** Assign click actions (`linkToRoute`) to meshes, stitching them into interactive transitions between website pages.

## Target Audience Experience
- **Visuals First:** The final website should feel like an interactive storybook or video game.
- **Cinematic Quality:** Scenes must use deep parallax, ambient animations, and high-quality cutouts.
- **Exploration:** Kids will navigate the site by clicking on visual elements (like a wooden signpost or a dinosaur) rather than using standard web navigation bars.
- **Seamless:** Transitions between scenes must be smooth, retaining the user's immersion.

## Future Mini-Games Integration
The interactive Engine must eventually support encapsulating HTML5 Canvas experiences (like the Fossil Dig scratch-off game) within specific Scenes.
