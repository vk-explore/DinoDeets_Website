import json

with open('src/data/encyclopedia.json', 'r') as f:
    data = json.load(f)

cretaceous_dinos = [dino for dino in data if 'Cretaceous' in dino.get('period', '') and not dino.get('image')]
print(f"Total Cretaceous dinos missing images: {len(cretaceous_dinos)}")
for d in cretaceous_dinos:
    print(d['name'], "-", d['description'][:50] + "...")
