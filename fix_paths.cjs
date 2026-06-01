const fs = require('fs');

const files = ['index.html', 'src/main.js'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');

  content = content.replace(/\.\/images\/logo\.png/g, './images/icons/logo.png');
  content = content.replace(/\.\/images\/hero-bg\.png/g, './images/backgrounds/hero-bg.png');
  content = content.replace(/\.\/images\/mascot\.png/g, './images/dinos/mascot.png');
  content = content.replace(/\.\/images\/fossils\/trex-skull\.png/g, './images/props/trex-skull.png');
  content = content.replace(/\.\/images\/fossils\/dig-earth\.png/g, './images/props/dig-earth.png');

  fs.writeFileSync(file, content);
  console.log('Fixed paths in', file);
});
