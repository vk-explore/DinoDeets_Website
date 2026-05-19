// Dino Creator parts data
export const creatorParts = {
  heads: [
    { id: 'rex', name: 'T-Rex', desc: 'Massive jaws, tiny brain', color: '#8B6914' },
    { id: 'tri', name: 'Triceratops', desc: 'Three horns & a frill', color: '#6B8E23' },
    { id: 'raptor', name: 'Raptor', desc: 'Smart & feathered', color: '#CD853F' },
    { id: 'brachio', name: 'Long Neck', desc: 'Sky-high head', color: '#708090' },
    { id: 'ptero', name: 'Pterosaur', desc: 'Beak & crest', color: '#B8860B' },
  ],
  bodies: [
    { id: 'bulky', name: 'Armored Tank', desc: 'Heavy & unstoppable', scale: 1.3 },
    { id: 'slim', name: 'Speedy Runner', desc: 'Built for speed', scale: 0.8 },
    { id: 'giant', name: 'Mountain Giant', desc: 'Towering over trees', scale: 1.6 },
    { id: 'spiky', name: 'Spine Warrior', desc: 'Covered in spikes', scale: 1.1 },
    { id: 'feathered', name: 'Feathered Beauty', desc: 'Elegant plumage', scale: 0.9 },
  ],
  tails: [
    { id: 'club', name: 'Club Tail', desc: 'Smash! Like Ankylosaurus' },
    { id: 'spike', name: 'Spike Tail', desc: 'Thagomizer! Like Stegosaurus' },
    { id: 'whip', name: 'Whip Tail', desc: 'Crack! Like Diplodocus' },
    { id: 'fan', name: 'Fan Tail', desc: 'Display feathers!' },
    { id: 'short', name: 'Stubby Tail', desc: 'Cute & compact' },
  ],
  specials: [
    { id: 'wings', name: 'Wings', desc: 'Take to the skies!' },
    { id: 'armor', name: 'Armor Plates', desc: 'Impenetrable defense' },
    { id: 'horns', name: 'Extra Horns', desc: 'More pointy bits!' },
    { id: 'crest', name: 'Head Crest', desc: 'Parasaurolophus style' },
    { id: 'glow', name: 'Bioluminescence', desc: 'Glow in the dark!' },
  ],
  colors: ['#8B6914', '#2E8B57', '#B22222', '#4169E1', '#9932CC', '#FF8C00', '#2F4F4F', '#FF69B4'],
};

// Fan art gallery data
export const fanArtGallery = [
  { title: 'Garden Explorer', artist: 'Riya, Age 8', image: './images/fanart/trex-garden.png', likes: 42 },
  { title: 'Family Walk', artist: 'Arjun, Age 10', image: './images/fanart/triceratops-family.png', likes: 38 },
  { title: 'Rainbow Lunch', artist: 'Ananya, Age 7', image: './images/fanart/brachio-rainbow.png', likes: 55 },
];

// Coloring pages data
export const coloringPages = [
  { name: 'Friendly T-Rex', image: './images/coloring/trex.png', difficulty: 'Easy' },
  { name: 'Stegosaurus', image: './images/coloring/stegosaurus.png', difficulty: 'Medium' },
  { name: 'Brachiosaurus & Tree', image: './images/coloring/brachiosaurus.png', difficulty: 'Easy' },
];

// Dino name generator data
export const dinoNameParts = {
  prefixes: ['Mega', 'Ultra', 'Thunder', 'Storm', 'Shadow', 'Crystal', 'Fire', 'Ice', 'Star', 'Moon', 'Solar', 'Cosmic'],
  roots: ['raptor', 'saurus', 'don', 'ceratops', 'dactyl', 'lophus', 'ornis', 'titan', 'colos', 'draco'],
  titles: ['the Mighty', 'the Wise', 'the Swift', 'the Brave', 'the Ancient', 'the Fierce', 'the Gentle', 'the Magnificent'],
};
