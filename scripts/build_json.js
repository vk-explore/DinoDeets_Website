import fs from 'fs';

// Since we are in a module environment (package.json has "type": "module"), we can import directly.
import { dinoFacts, fossilData } from '../src/data/dino-facts.js';
import { discoveryData } from '../src/data/map-data.js';
import { quizQuestions, dinoGlossary, dinoSizes, timelineData } from '../src/data/phase3-data.js';
import { creatorParts, fanArtGallery, coloringPages, dinoNameParts } from '../src/data/phase4-data.js';

// Construct the encyclopedia from the fragments we have
const encyclopediaMap = new Map();

function getDino(name) {
    if (!encyclopediaMap.has(name)) {
        encyclopediaMap.set(name, {
            name: name,
            diet: "Unknown",
            period: "Unknown",
            location: "Unknown",
            length: "Unknown",
            weight: "Unknown",
            description: "",
            image: ""
        });
    }
    return encyclopediaMap.get(name);
}

// Map sizes
dinoSizes.forEach(s => {
    if (s.name.includes("Human")) return;
    const dino = getDino(s.name);
    dino.diet = s.diet;
    dino.length = s.length + "m";
    dino.weight = s.weight;
    dino.image = s.image;
    dino.description = s.comparison;
});

// Map discoveries
discoveryData.forEach(d => {
    d.dinosaurs.forEach(dinoName => {
        const dino = getDino(dinoName);
        dino.period = d.era;
        dino.location = d.location;
    });
});

// Map facts
dinoFacts.forEach(f => {
    if (f.dino !== "General" && f.dino !== "Theropods" && f.dino !== "Sauropods") {
        const dino = getDino(f.dino);
        dino.period = f.era;
        if (!dino.description || dino.description === "") {
            dino.description = f.fact;
        } else {
            dino.description += " " + f.fact;
        }
    }
});

const encyclopedia = Array.from(encyclopediaMap.values());

const finalJson = {
    encyclopedia,
    dinoFacts,
    fossilData,
    discoveryData,
    quizQuestions,
    dinoGlossary,
    dinoSizes,
    timelineData,
    creatorParts,
    fanArtGallery,
    coloringPages,
    dinoNameParts
};

fs.writeFileSync('./src/data/dino-data.json', JSON.stringify(finalJson, null, 2));
console.log("Successfully generated src/data/dino-data.json");
