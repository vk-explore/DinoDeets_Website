# Implemented Features

This document serves as a living log of what has been built and completed for the Dino Deets website so far.

## Core Framework
- [x] Initialized Vite static build.
- [x] Set up basic GitHub Pages hosting architecture.

## UI/UX
- [x] Dark mode default ("Night at the Museum" vibe) established in CSS.

## Features
- [x] **Animated Dino Mascot**: Rebuilt from a static image to a living SVG. Supports eye-tracking (follows the mouse cursor), random blinking, idle behavior (watching a fly), and click interactions (making a cute roar and smiling wider).
- [x] **Dino Encyclopedia & Dedicated Details**: Implemented a gallery view of dinosaurs categorized by geological period. Created a dedicated detail page (`explore/dino-detail.html`) using dynamic search query parameters (`?dino=Name`) to render high-fidelity dinosaur stats, diet, weight, location, and overview bio blocks.
- [x] **Dino Origins & Extinction Story Pages**: Added pages detailing dinosaur origins and extinction. Styled headers, hero images, reading paragraph flow, and back-navigation links to be top-aligned and center-formatted, matching the design of the details page.
- [x] **Footer Synchronization**: Standardized the footer across all website pages to include social links for YouTube, Instagram, and Facebook.
- [x] **Separated JSON Data Architecture**: Split the single massive `dino-data.json` file into ten domain-specific JSON files (e.g. `encyclopedia.json`, `quiz.json`, `random-deet.json`, etc.) to optimize data loading, reduce bundle chunks size, and improve clean separation of concerns.
- [x] **Mascot Linked to Random Facts**: Linked the mascot companion to load and display random facts from `random-deet.json` inside its speech bubble on click. Configured click propagation rules to prevent bubble clicks from accidentally triggering new facts, and removed the deprecated "Random Dino Deet" homepage CTA button.
- [x] **Mascot Speech Bubble & Reaction Enhancements**: Implemented dynamic bubble behavior. Double-tapping the mascot triggers a dizzy animation with brief, randomized text reactions (e.g., "Ouch!", "Bonk!", "Oops!") that auto-hide in 3 seconds, with double-tap separation filtering to prevent single-click facts from briefly firing. Idle states trigger navigation tips that auto-hide in 10 seconds. Click-triggered facts auto-hide in 20 seconds and display a custom close button checkmark. The speech bubble's layout is updated to auto-adjust its width dynamically (`width: fit-content`) with `min-width: 80px` and custom responsive `max-width` limits based on the message type (dizzy/tip messages are capped at 200px on mobile/300px on desktop to remain compact, while detailed "deet" facts can grow wider up to 260px on mobile/480px on desktop for better readability).
