import fs from 'fs';
import path from 'path';

const html = fs.readFileSync('index.html', 'utf-8');

// Parse head, nav, footer, etc.
const headMatch = html.match(/([\s\S]*?)<!-- Navigation -->/);
const navMatch = html.match(/(<!-- Navigation -->[\s\S]*?<\/nav>)/);
const footerMatch = html.match(/(<!-- Footer -->[\s\S]*?<\/html>)/);

// We need to replace the nav links
let newNav = navMatch[1];

// Also remove language switcher from newNav
newNav = newNav.replace(/<div class="nav__lang" id="lang-switcher">[\s\S]*?<\/div>\n\s*<\/div>/, '</div>');

function extractSection(htmlStr, id) {
  const regex = new RegExp(`(<!-- .*? -->\\s*<section id="${id}"[\\s\\S]*?</section>)`, 'i');
  const match = htmlStr.match(regex);
  return match ? match[1] : '';
}

function extractDiv(htmlStr, id) {
  const regex = new RegExp(`(<!-- .*? -->\\s*<div.*?id="${id}"[\\s\\S]*?</div>\\s*</div>)`, 'i'); // heuristic for fan art lightbox or mascot
  const match = htmlStr.match(regex);
  return match ? match[1] : '';
}

// Extract sections
const sections = {
  hero: extractSection(html, 'hero'),
  episodes: extractSection(html, 'episodes'),
  about: extractSection(html, 'about'),
  countdown: extractSection(html, 'countdown'),
  ask: extractSection(html, 'ask-devaansh'),
  
  fossilDig: extractSection(html, 'fossil-dig'),
  quiz: extractSection(html, 'dino-quiz'),
  creator: extractSection(html, 'dino-creator'),
  
  map: extractSection(html, 'dino-map'),
  timeline: extractSection(html, 'dino-timeline'),
  meter: extractSection(html, 'dino-meter'),
  deet: extractSection(html, 'random-deet'),
  dictionary: extractSection(html, 'dino-dictionary'),
  
  
  
};

function createPage(dest, contentBlocks, pageTitle) {
  let head = headMatch[1];
  if (pageTitle) {
    head = head.replace(/<title>.*?<\/title>/, `<title>${pageTitle} | Dino Deets</title>`);
  }
  
  // Need to adjust script paths and image paths if we are in a subdirectory
  const depth = dest.split('/').length - 1;
  const prefix = depth === 0 ? '.' : '..';
  
  // Adjust paths in head, nav, footer, and content
  function fixPaths(str) {
    if (depth === 0) return str;
    return str
      .replace(/href="\.\//g, `href="${prefix}/`)
      .replace(/src="\.\//g, `src="${prefix}/`)
      .replace(/src="\/src/g, `src="${prefix}/src`);
  }

  let finalHtml = fixPaths(head) + '\n' + fixPaths(newNav) + '\n';
  contentBlocks.forEach(b => finalHtml += fixPaths(b) + '\n');
  finalHtml += fixPaths(footerMatch[1]);

  // Ensure directory exists
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, finalHtml);
}

// 1. Root index.html
createPage('index.html', [sections.hero, sections.episodes, sections.countdown, sections.ask, sections.about], 'Home');

// 2. Games
createPage('games/fossil-dig.html', [sections.fossilDig], 'Fossil Dig');
createPage('games/dino-quiz.html', [sections.quiz], 'Dino Quiz');
createPage('games/dino-creator.html', [sections.creator], 'Dino Creator');

// 3. Explore
createPage('explore/dino-map.html', [sections.map], 'Dino Map');
createPage('explore/dino-timeline.html', [sections.timeline], 'Dino Timeline');
createPage('explore/dino-meter.html', [sections.meter], 'Dino-o-Meter');
createPage('explore/encyclopedia.html', [
  sections.dictionary, 
  sections.deet
], 'Encyclopedia');

// 4. Art
const downloadBtn = `
            <a href="#" class="art-card__download" aria-label="Download">\n              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 18px; height: 18px;">\n                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>\n                <polyline points="7 10 12 15 17 10"></polyline>\n                <line x1="12" y1="15" x2="12" y2="3"></line>\n              </svg>\n            </a>`;
const artHtml = `
  <section class="section" style="min-height: 100vh; padding-top: 150px; text-align: center;">
    <div class="section__inner">
      <h1 class="section__title font-condensed">Art & Downloads</h1>

      <!-- Wallpapers -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 40px; margin-bottom: 20px;">Wallpapers</h2>
      
      <h3 style="font-family: var(--font-accent); color: var(--color-text-primary); margin-bottom: 15px;">Desktop (16:9)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto 40px;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">
            Desktop Wallpaper 1
${downloadBtn}
          </div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="width: 100%; aspect-ratio: 16/9; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">
            Desktop Wallpaper 2
${downloadBtn}
          </div>
        </div>
      </div>

      <h3 style="font-family: var(--font-accent); color: var(--color-text-primary); margin-bottom: 15px;">Mobile (9:16)</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 20px; max-width: 1000px; margin: 0 auto 60px;">
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">
            Mobile Wallpaper 1
${downloadBtn}
          </div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">
            Mobile Wallpaper 2
${downloadBtn}
          </div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 15px; border-radius: var(--radius-card); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="width: 100%; aspect-ratio: 9/16; background: #3C2A1E; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--color-text-muted);">
            Mobile Wallpaper 3
${downloadBtn}
          </div>
        </div>
      </div>
      
      <!-- Coloring Pages -->
      <h2 style="color: var(--color-amber); font-family: var(--font-display); margin-top: 60px; margin-bottom: 20px;">Coloring Pages</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; max-width: 900px; margin: 0 auto 60px;">
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="border-radius: 4px;">
            <img src="../images/coloring/trex.png" alt="T-Rex Coloring" style="width: 100%; background: white; display: block;" />
${downloadBtn}
          </div>
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">T-Rex</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="border-radius: 4px;">
            <img src="../images/coloring/stegosaurus.png" alt="Stegosaurus Coloring" style="width: 100%; background: white; display: block;" />
${downloadBtn}
          </div>
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">Stegosaurus</div>
        </div>
        <div style="background: var(--color-bg-secondary); padding: 10px; border-radius: var(--radius-sm); border: 1px solid rgba(212, 168, 67, 0.2);">
          <div class="art-card__image-wrap" style="border-radius: 4px;">
            <img src="../images/coloring/brachiosaurus.png" alt="Brachiosaurus Coloring" style="width: 100%; background: white; display: block;" />
${downloadBtn}
          </div>
          <div style="margin-top: 10px; font-family: var(--font-accent); color: var(--color-text-primary);">Brachiosaurus</div>
        </div>
      </div>

    </div>
  </section>
`;
;

createPage('art/index.html', [artHtml], 'Art');
console.log('HTML files split successfully!');
