const fs = require('fs');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf-8');

// Replace "Printables" references to "Art" and update URL to /art/index.html
html = html.replace(/\/DinoDeets_Website\/printables\/index\.html/g, '/DinoDeets_Website/art/index.html');
html = html.replace(/aria-label="Printables"/g, 'aria-label="Art"');
html = html.replace(/<span class="nav__tooltip">Printables<\/span>/g, '<span class="nav__tooltip">Art</span>');

fs.writeFileSync('index.html', html);


// 2. Update split_html.js
let splitHtml = fs.readFileSync('scripts/split_html.js', 'utf-8');

// Replace the Printables generation block with the Art block
const artBlockRegex = /\/\/ 4\. Printables[\s\S]*?(?=console\.log)/;
const newArtBlock = `// 4. Art
const artHtml = \`
  <section class="section" style="min-height: 100vh; padding-top: 150px; text-align: center;">
    <div class="section__inner">
      <h1 class="section__title font-condensed">Art & Downloads</h1>
      
      <!-- Coloring Pages -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 40px; margin-bottom: 20px;">
        <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline>
        </svg> Coloring Pages
      </h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto 60px;">
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <img src="/DinoDeets_Website/images/coloring/trex.png" alt="T-Rex Coloring" style="width: 100%; border-radius: 4px; background: white;" />
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">T-Rex</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <img src="/DinoDeets_Website/images/coloring/stegosaurus.png" alt="Stegosaurus Coloring" style="width: 100%; border-radius: 4px; background: white;" />
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">Stegosaurus</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <img src="/DinoDeets_Website/images/coloring/brachiosaurus.png" alt="Brachiosaurus Coloring" style="width: 100%; border-radius: 4px; background: white;" />
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">Brachiosaurus</div>
        </div>
      </div>

      <!-- Cinematic Posters -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 60px; margin-bottom: 20px;">Cinematic Posters</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1000px; margin: 0 auto 60px;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 2/3; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Poster Coming Soon</div>
          <div style="margin-top: 15px; font-family: var(--font-accent); color: var(--color-text-primary); font-size: 1.2rem;">Jurassic Jungle</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 2/3; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Poster Coming Soon</div>
          <div style="margin-top: 15px; font-family: var(--font-accent); color: var(--color-text-primary); font-size: 1.2rem;">The Meteor Fall</div>
        </div>
      </div>

      <!-- Wallpapers -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 60px; margin-bottom: 20px;">Wallpapers</h2>
      
      <h3 style="font-family: var(--font-accent); color: var(--color-text-primary); margin-bottom: 15px;">Desktop (16:9)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto 40px;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Desktop Wallpaper 1</div>
          <a href="#" class="btn btn--primary" style="margin-top: 15px; display: inline-block; padding: 8px 16px;">Download</a>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Desktop Wallpaper 2</div>
          <a href="#" class="btn btn--primary" style="margin-top: 15px; display: inline-block; padding: 8px 16px;">Download</a>
        </div>
      </div>

      <h3 style="font-family: var(--font-accent); color: var(--color-text-primary); margin-bottom: 15px;">Mobile (9:16)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Mobile Wallpaper 1</div>
          <a href="#" class="btn btn--primary" style="margin-top: 15px; display: inline-block; padding: 8px 16px;">Download</a>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Mobile Wallpaper 2</div>
          <a href="#" class="btn btn--primary" style="margin-top: 15px; display: inline-block; padding: 8px 16px;">Download</a>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Mobile Wallpaper 3</div>
          <a href="#" class="btn btn--primary" style="margin-top: 15px; display: inline-block; padding: 8px 16px;">Download</a>
        </div>
      </div>
      
    </div>
  </section>
\`;

createPage('art/index.html', [artHtml], 'Art');

`;

splitHtml = splitHtml.replace(artBlockRegex, newArtBlock);
fs.writeFileSync('scripts/split_html.js', splitHtml);

console.log('Art page prepared successfully.');
