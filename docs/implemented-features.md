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
