const fs = require('fs');

// 1. Update index.html - Replace Printables dropdown with normal link
let html = fs.readFileSync('index.html', 'utf-8');

html = html.replace(/<li class="nav__dropdown">\s*<a href="#" class="nav__icon-link nav__dropdown-toggle" aria-label="Printables" data-dropdown="printables">[\s\S]*?<\/li>/, `
          <li>
            <a href="/DinoDeets_Website/printables/index.html" class="nav__icon-link" aria-label="Printables">
              <svg class="nav__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              <span class="nav__tooltip">Printables</span>
            </a>
          </li>`);

fs.writeFileSync('index.html', html);


// 2. Update split_html.js
let splitHtml = fs.readFileSync('scripts/split_html.js', 'utf-8');

// Remove all fanart extraction and old coloring creation lines
splitHtml = splitHtml.replace(/fanArt: extractSection\(html, 'fan-art'\),/, '');
splitHtml = splitHtml.replace(/coloring: extractSection\(html, 'coloring-pages'\),/, '');

splitHtml = splitHtml.replace(/\/\/ 4\. Printables[\s\S]*?(?=console\.log)/, `// 4. Printables
const printablesHtml = \`
  <section class="section" style="min-height: 100vh; padding-top: 150px; text-align: center;">
    <div class="section__inner">
      <h1 class="section__title font-condensed">Printables & Art</h1>
      
      <!-- Coloring Pages -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 40px; margin-bottom: 20px;">Coloring Pages</h2>
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
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px; max-width: 1000px; margin: 0 auto;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 2/3; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Poster Coming Soon</div>
          <div style="margin-top: 15px; font-family: var(--font-accent); color: var(--color-text-primary); font-size: 1.2rem;">Jurassic Jungle</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="width: 100%; aspect-ratio: 2/3; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">Poster Coming Soon</div>
          <div style="margin-top: 15px; font-family: var(--font-accent); color: var(--color-text-primary); font-size: 1.2rem;">The Meteor Fall</div>
        </div>
      </div>
      
    </div>
  </section>
\`;

createPage('printables/index.html', [printablesHtml], 'Printables & Art');

`);

fs.writeFileSync('scripts/split_html.js', splitHtml);

console.log('Printables page updated successfully.');
