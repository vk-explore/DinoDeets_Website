const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf-8');
css = css.replace(/--color-accent-gold/g, '--color-amber');
fs.writeFileSync('src/style.css', css);
console.log('Fixed accent gold variable.');
