#!/usr/bin/env python3
import os
import glob
import re
from PIL import Image

ARTIFACTS_DIR = "/Users/vivek/.gemini/antigravity-ide/brain/561f82da-4b5f-4c4d-9c46-4d061d02e9d9"
METER_DIR = "/Users/vivek/Documents/2020Generators/DinoDeets_Website/public/images/meter"
TOLERANCE = 30  # standard green screening tolerance

def remove_green_matte_and_convert_webp(input_path, output_path, tolerance=30):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            r, g, b, a = item
            # Detect green matte pixels
            if g > r + tolerance and g > b + tolerance:
                new_data.append((r, g, b, 0))
            else:
                # Apply despill to non-matte pixels where green is dominant
                if g > r and g > b:
                    new_g = max(r, b)
                    new_data.append((r, new_g, b, a))
                else:
                    new_data.append(item)

        img.putdata(new_data)
        
        # Crop transparent borders to fit dinosaur tightly
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
        img.save(output_path, "WEBP", quality=85)
        print(f"Processed: {os.path.basename(input_path)} -> {os.path.basename(output_path)}")
        return True
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return False

def main():
    # Find all PNG files in artifacts dir matching *_profile_matte_*.png
    pattern = os.path.join(ARTIFACTS_DIR, "*_profile_matte_*.png")
    matte_files = glob.glob(pattern)
    
    print(f"Found {len(matte_files)} generated profile matte images.")
    processed_count = 0
    
    for fpath in matte_files:
        fname = os.path.basename(fpath)
        # Extract dino name prefix (everything before _profile_matte)
        match = re.match(r"^([a-z0-9_]+)_profile_matte", fname, re.IGNORECASE)
        if not match:
            continue
            
        dino_name_slug = match.group(1).lower()
        # Convert underscores back to spaces or keep as slug?
        # Actually, in the webapp:
        # Tyrannosaurus Rex -> trex.webp (or we can map dino name to lowercase-without-spaces.webp)
        # Let's keep it simple: we will save it as dino_name_slug.webp
        # E.g. albertosaurus.webp, pteranodon.webp, etc.
        out_name = f"{dino_name_slug}.webp"
        out_path = os.path.join(METER_DIR, out_name)
        
        # Check if already processed
        if os.path.exists(out_path):
            # If the source file is newer, we reprocess it, otherwise skip
            if os.path.getmtime(out_path) >= os.path.getmtime(fpath):
                continue
                
        success = remove_green_matte_and_convert_webp(fpath, out_path, TOLERANCE)
        if success:
            processed_count += 1
            
    print(f"Successfully processed {processed_count} new images.")

if __name__ == "__main__":
    main()
