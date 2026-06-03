import json

with open('src/data/encyclopedia.json', 'r') as f:
    data = json.load(f)

jurassic_dinos = [dino for dino in data if 'Jurassic' in dino.get('period', '') and not dino.get('image')]
print(f"Total Jurassic dinos missing images: {len(jurassic_dinos)}")
for d in jurassic_dinos:
    print(d['name'], "-", d['description'][:50] + "...")
