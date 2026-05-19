// Dino Quiz questions database
export const quizQuestions = [
  {
    question: "Which dinosaur had the strongest bite force of any land animal?",
    options: ["Spinosaurus", "Tyrannosaurus Rex", "Giganotosaurus", "Allosaurus"],
    correct: 1,
    explanation: "T-Rex had a bite force of about 12,800 pounds — enough to crush bone!",
    image: "/images/dinos/trex.png"
  },
  {
    question: "How big was a real Velociraptor?",
    options: ["Size of a horse", "Size of a turkey", "Size of a bear", "Size of a dog"],
    correct: 1,
    explanation: "Velociraptors were actually only about the size of a turkey — not the giants shown in movies!",
    image: "/images/dinos/velociraptor.png"
  },
  {
    question: "Which dinosaur had plates on its back that could regulate body temperature?",
    options: ["Ankylosaurus", "Triceratops", "Stegosaurus", "Parasaurolophus"],
    correct: 2,
    explanation: "Stegosaurus plates could flush with blood to help cool down or warm up!",
    image: "/images/dinos/stegosaurus.png"
  },
  {
    question: "What does the word 'dinosaur' mean in Greek?",
    options: ["Giant beast", "Terrible lizard", "Ancient monster", "Thunder reptile"],
    correct: 1,
    explanation: "Dinosaur means 'terrible lizard' — but they weren't actually lizards at all!"
  },
  {
    question: "Which period did dinosaurs first appear?",
    options: ["Jurassic", "Cretaceous", "Triassic", "Permian"],
    correct: 2,
    explanation: "Dinosaurs first appeared during the Late Triassic, about 230 million years ago."
  },
  {
    question: "How many horns did Triceratops have?",
    options: ["One", "Two", "Three", "Four"],
    correct: 2,
    explanation: "Triceratops means 'three-horned face' — two long brow horns and one shorter nose horn!",
    image: "/images/dinos/triceratops.png"
  },
  {
    question: "What are the closest living relatives of dinosaurs?",
    options: ["Lizards", "Crocodiles", "Birds", "Turtles"],
    correct: 2,
    explanation: "Birds evolved from small theropod dinosaurs and are technically dinosaurs themselves!"
  },
  {
    question: "How wide was the asteroid that wiped out the dinosaurs?",
    options: ["1 mile", "6 miles", "20 miles", "100 miles"],
    correct: 1,
    explanation: "The Chicxulub asteroid was about 6 miles wide — roughly the size of Mount Everest!"
  },
  {
    question: "Which of these was the largest flying animal ever?",
    options: ["Pteranodon", "Quetzalcoatlus", "Archaeopteryx", "Dimorphodon"],
    correct: 1,
    explanation: "Quetzalcoatlus had a wingspan of 36 feet — as wide as a small airplane!"
  },
  {
    question: "Where was the Rajasaurus dinosaur discovered?",
    options: ["Africa", "South America", "India", "Australia"],
    correct: 2,
    explanation: "Rajasaurus — meaning 'King Lizard' — was discovered in India's Narmada Valley!"
  }
];

// Dino Dictionary / Glossary data
export const dinoGlossary = [
  { term: "Ammonite", definition: "An extinct marine animal with a spiral shell, common fossils from the Mesozoic Era.", category: "Fossil" },
  { term: "Biped", definition: "An animal that walks on two legs, like T-Rex and Velociraptor.", category: "Anatomy" },
  { term: "Carnivore", definition: "A meat-eating animal. Many theropod dinosaurs were fierce carnivores.", category: "Diet" },
  { term: "Coprolite", definition: "Fossilized dinosaur poop! Scientists study these to learn what dinosaurs ate.", category: "Fossil" },
  { term: "Cretaceous", definition: "The last period of the Mesozoic Era (145–66 million years ago). Ended with the asteroid impact.", category: "Era" },
  { term: "Dinosauria", definition: "The scientific name for the group of all dinosaurs, coined by Richard Owen in 1842.", category: "Science" },
  { term: "Extinction", definition: "When every member of a species dies out. Non-bird dinosaurs went extinct 66 million years ago.", category: "Event" },
  { term: "Fossil", definition: "Preserved remains or traces of ancient life found in rock. Can be bones, teeth, footprints, or even eggs!", category: "Fossil" },
  { term: "Gastroliths", definition: "Stones swallowed by dinosaurs to help grind food in their stomachs — like a built-in blender!", category: "Anatomy" },
  { term: "Herbivore", definition: "A plant-eating animal. Sauropods and ceratopsians were herbivores.", category: "Diet" },
  { term: "Ichthyosaur", definition: "A marine reptile that looked like a dolphin. Not a dinosaur, but lived alongside them!", category: "Animal" },
  { term: "Jurassic", definition: "The middle period of the Mesozoic Era (201–145 million years ago). The age of giant sauropods!", category: "Era" },
  { term: "K-Pg Boundary", definition: "The geological boundary marking the mass extinction event 66 million years ago that ended the dinosaurs.", category: "Event" },
  { term: "Mesozoic", definition: "The 'Age of Reptiles' — the era spanning 252–66 million years ago, divided into Triassic, Jurassic, and Cretaceous.", category: "Era" },
  { term: "Omnivore", definition: "An animal that eats both plants and meat. Some dinosaurs like Oviraptor were likely omnivores.", category: "Diet" },
  { term: "Paleontologist", definition: "A scientist who studies ancient life through fossils. They're real-life dinosaur detectives!", category: "Science" },
  { term: "Pterosaur", definition: "Flying reptiles that lived alongside dinosaurs. They were NOT dinosaurs, but close relatives!", category: "Animal" },
  { term: "Quadruped", definition: "An animal that walks on four legs, like Triceratops and Stegosaurus.", category: "Anatomy" },
  { term: "Raptor", definition: "Short for dromaeosaurid — a family of feathered, fast-running predatory dinosaurs.", category: "Animal" },
  { term: "Sauropod", definition: "Giant long-necked, plant-eating dinosaurs like Brachiosaurus and Argentinosaurus — the largest land animals ever!", category: "Animal" },
  { term: "Theropod", definition: "Two-legged, mostly carnivorous dinosaurs. Includes T-Rex, Velociraptor, and modern birds!", category: "Animal" },
  { term: "Triassic", definition: "The first period of the Mesozoic Era (252–201 million years ago). When dinosaurs first appeared!", category: "Era" },
  { term: "Vertebra", definition: "A single bone in the spine. Some sauropod vertebrae were over 3 feet long!", category: "Anatomy" },
];

// Dino size comparison data for Dino-o-Meter
export const dinoSizes = [
  { name: "Compsognathus", height: 0.3, length: 1.0, weight: "3 kg", diet: "Carnivore", image: "/images/dinos/velociraptor.png", comparison: "About the size of a chicken!" },
  { name: "Velociraptor", height: 0.5, length: 1.8, weight: "15 kg", diet: "Carnivore", image: "/images/dinos/velociraptor.png", comparison: "About the size of a turkey" },
  { name: "Human (for scale)", height: 1.8, length: 0.5, weight: "70 kg", diet: "Omnivore", image: "/images/mascot.png", comparison: "That's you!" },
  { name: "Stegosaurus", height: 4.0, length: 9.0, weight: "5,000 kg", diet: "Herbivore", image: "/images/dinos/stegosaurus.png", comparison: "As long as a bus!" },
  { name: "Triceratops", height: 3.0, length: 9.0, weight: "6,000 kg", diet: "Herbivore", image: "/images/dinos/triceratops.png", comparison: "Heavy as an elephant!" },
  { name: "T-Rex", height: 5.6, length: 12.3, weight: "8,400 kg", diet: "Carnivore", image: "/images/dinos/trex.png", comparison: "Tall as a giraffe!" },
  { name: "Brachiosaurus", height: 13.0, length: 25.0, weight: "56,000 kg", diet: "Herbivore", image: "/images/dinos/brachiosaurus.png", comparison: "Could peek into a 4th-floor window!" },
  { name: "Argentinosaurus", height: 15.0, length: 35.0, weight: "100,000 kg", diet: "Herbivore", image: "/images/dinos/brachiosaurus.png", comparison: "Heavier than 14 elephants combined!" },
];

// Timeline data for Dino Timeline Explorer
export const timelineData = [
  { era: "Triassic", period: "Late Triassic", years: "230–201 MYA", color: "#E8652D", events: [
    { year: "230 MYA", title: "First Dinosaurs", desc: "Small, bipedal dinosaurs like Eoraptor appear in what is now Argentina.", image: "/images/dinos/velociraptor.png" },
    { year: "220 MYA", title: "Rise of Theropods", desc: "Herrerasaurus and other early predators begin to diversify." },
    { year: "201 MYA", title: "End-Triassic Extinction", desc: "Volcanic eruptions wipe out many species, allowing dinosaurs to dominate." },
  ]},
  { era: "Jurassic", period: "Early–Late Jurassic", years: "201–145 MYA", color: "#4CAF50", events: [
    { year: "200 MYA", title: "Dinosaurs Dominate", desc: "With competitors gone, dinosaurs become the rulers of the land." },
    { year: "155 MYA", title: "Giants Emerge", desc: "Brachiosaurus, Diplodocus, and other massive sauropods roam the Earth.", image: "/images/dinos/brachiosaurus.png" },
    { year: "150 MYA", title: "Stegosaurus Era", desc: "Plated dinosaurs with spiked tails thrive in lush forests.", image: "/images/dinos/stegosaurus.png" },
    { year: "150 MYA", title: "First Birds", desc: "Archaeopteryx — half dinosaur, half bird — takes flight in Germany." },
  ]},
  { era: "Cretaceous", period: "Early Cretaceous", years: "145–100 MYA", color: "#29B6F6", events: [
    { year: "130 MYA", title: "Feathered Dinosaurs", desc: "Sinosauropteryx and other feathered species discovered in China." },
    { year: "125 MYA", title: "Flowering Plants", desc: "The first flowers appear, transforming ecosystems worldwide." },
    { year: "112 MYA", title: "Spinosaurus", desc: "The largest known carnivore — bigger than T-Rex — hunts fish in rivers." },
  ]},
  { era: "Cretaceous", period: "Late Cretaceous", years: "100–66 MYA", color: "#D4A843", events: [
    { year: "80 MYA", title: "Triceratops Appears", desc: "Three-horned giants roam North America in vast herds.", image: "/images/dinos/triceratops.png" },
    { year: "68 MYA", title: "T-Rex Reigns", desc: "The most famous predator of all time dominates the Late Cretaceous.", image: "/images/dinos/trex.png" },
    { year: "66 MYA", title: "The Asteroid Impact", desc: "A 6-mile-wide asteroid strikes the Yucatán Peninsula. The age of dinosaurs ends." },
    { year: "66 MYA", title: "Birds Survive", desc: "Small feathered dinosaurs survive the extinction — evolving into today's birds." },
  ]},
];
