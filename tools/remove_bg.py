import argparse
from rembg import remove
from PIL import Image
import os
import sys

def remove_background(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: Input file '{input_path}' not found.")
        sys.exit(1)

    print(f"Processing: {input_path}...")
    try:
        input_image = Image.open(input_path)
        
        # remove() automatically handles ML subject detection and masking
        output_image = remove(input_image)
        
        # Save as PNG to preserve transparency
        output_image.save(output_path, format="PNG")
        print(f"Success! Saved transparent image to: {output_path}")
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Remove solid backgrounds from AI-generated images using ML.")
    parser.add_argument("input", help="Path to the input image file (e.g., input.jpg)")
    parser.add_argument("output", help="Path to save the output transparent image (e.g., output.png)")
    
    args = parser.parse_args()
    
    remove_background(args.input, args.output)
