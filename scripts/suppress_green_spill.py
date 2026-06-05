#!/usr/bin/env python3
import os
import glob
from PIL import Image

METER_DIR = "/Users/vivek/Documents/2020Generators/DinoDeets_Website/public/images/meter"

def suppress_green_spill(img_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        width, height = img.size
        pixels = img.load()

        modified = False
        for y in range(height):
            for x in range(width):
                r, g, b, a = pixels[x, y]
                if a == 0:
                    continue

                # Green spill detection: green is stronger than both red and blue
                if g > r and g > b:
                    # Cap green to the max of red and blue (despill)
                    # We can use a soft limit to preserve some natural hues if desired,
                    # but capping to max(r, b) is highly effective for chroma-key spill.
                    new_g = max(r, b)
                    pixels[x, y] = (r, new_g, b, a)
                    modified = True

        if modified:
            img.save(img_path, "WEBP", quality=85)
            print(f"Despilled green reflection in: {os.path.basename(img_path)}")
            return True
        return False
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return False

def main():
    pattern = os.path.join(METER_DIR, "*.webp")
    webp_files = glob.glob(pattern)
    
    print(f"Scanning {len(webp_files)} profile WebP images for green spill...")
    despilled_count = 0
    
    for fpath in webp_files:
        # Skip the human silhouette (not generated on green)
        if os.path.basename(fpath) == "human.webp":
            continue
            
        if suppress_green_spill(fpath):
            despilled_count += 1
            
    print(f"Despill complete. Color-corrected {despilled_count} images.")

if __name__ == "__main__":
    main()
