#!/usr/bin/env python3
import sys
import argparse
from PIL import Image

def remove_green_matte(input_path, output_path, tolerance=50):
    try:
        # Open image and convert to RGBA (if not already)
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        new_data = []
        for item in datas:
            # item is (R, G, B, A)
            r, g, b, a = item
            
            # Simple green screen detection: 
            # If green is the dominant color by a certain tolerance, make it transparent
            # You can tweak the logic depending on the exact green used (#00FF00 etc)
            if g > r + tolerance and g > b + tolerance:
                # Target green pixel -> make transparent
                new_data.append((r, g, b, 0))
            else:
                new_data.append(item)

        img.putdata(new_data)
        img.save(output_path, "PNG")
        print(f"Successfully removed green matte and saved to {output_path}")

    except Exception as e:
        print(f"Error processing image: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Remove green matte from an image to make it transparent.")
    parser.add_argument("input", help="Path to input image")
    parser.add_argument("output", help="Path to save the transparent output PNG")
    parser.add_argument("--tolerance", type=int, default=30, help="Tolerance for green detection (default 30)")
    
    args = parser.parse_args()
    remove_green_matte(args.input, args.output, args.tolerance)
