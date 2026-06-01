const fs = require('fs');

let splitHtml = fs.readFileSync('scripts/split_html.js', 'utf-8');

const downloadBtn = `
            <a href="#" style="position: absolute; top: 10px; right: 10px; background: rgba(26, 18, 11, 0.7); color: var(--color-amber); padding: 8px; border-radius: 50%; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); transition: all 0.2s; border: 1px solid rgba(212, 168, 67, 0.3);" onmouseover="this.style.background='var(--color-amber)'; this.style.color='#1A120B'; this.style.transform='scale(1.1)';" onmouseout="this.style.background='rgba(26, 18, 11, 0.7)'; this.style.color='var(--color-amber)'; this.style.transform='scale(1)';" aria-label="Download">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>`;

const newArtBlock = `// 4. Art
const artHtml = \`
  <section class="section" style="min-height: 100vh; padding-top: 150px; text-align: center;">
    <div class="section__inner">
      <h1 class="section__title font-condensed">Art & Downloads</h1>

      <!-- Wallpapers -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 40px; margin-bottom: 20px;">Wallpapers</h2>
      
      <h3 style="font-family: var(--font-accent); color: var(--color-text-primary); margin-bottom: 15px;">Desktop (16:9)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto 40px;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); overflow: hidden;">
            Desktop Wallpaper 1
\${downloadBtn}
          </div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); overflow: hidden;">
            Desktop Wallpaper 2
\${downloadBtn}
          </div>
        </div>
      </div>

      <h3 style="font-family: var(--font-accent); color: var(--color-text-primary); margin-bottom: 15px;">Mobile (9:16)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto 60px;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); overflow: hidden;">
            Mobile Wallpaper 1
\${downloadBtn}
          </div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); overflow: hidden;">
            Mobile Wallpaper 2
\${downloadBtn}
          </div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted); overflow: hidden;">
            Mobile Wallpaper 3
\${downloadBtn}
          </div>
        </div>
      </div>
      
      <!-- Coloring Pages -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 60px; margin-bottom: 20px;">Coloring Pages</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto 60px;">
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; overflow: hidden; border-radius: 4px;">
            <img src="../images/coloring/trex.png" alt="T-Rex Coloring" style="width: 100%; background: white; display: block;" />
\${downloadBtn}
          </div>
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">T-Rex</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; overflow: hidden; border-radius: 4px;">
            <img src="../images/coloring/stegosaurus.png" alt="Stegosaurus Coloring" style="width: 100%; background: white; display: block;" />
\${downloadBtn}
          </div>
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">Stegosaurus</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div style="position: relative; overflow: hidden; border-radius: 4px;">
            <img src="../images/coloring/brachiosaurus.png" alt="Brachiosaurus Coloring" style="width: 100%; background: white; display: block;" />
\${downloadBtn}
          </div>
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">Brachiosaurus</div>
        </div>
      </div>

    </div>
  </section>
\`;
`;

splitHtml = splitHtml.replace(/\/\/ 4\. Art[\s\S]*?<\/section>\n`/m, newArtBlock);

fs.writeFileSync('scripts/split_html.js', splitHtml);
console.log('Update finished.');
