import json

with open('src/data/encyclopedia.json', 'r') as f:
    data = json.load(f)

triassic_dinos = [dino for dino in data if 'Triassic' in dino.get('period', '') and not dino.get('image')]
print(f"Total Triassic dinos missing images: {len(triassic_dinos)}")
for d in triassic_dinos:
    print(d['name'], "-", d['description'][:50] + "...")
