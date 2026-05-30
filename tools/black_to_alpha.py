import sys
from PIL import Image

def process_fire_trail(input_path, output_path):
    print(f"Processing: {input_path}")
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        # Calculate luminance (brightness)
        lum = int((item[0] + item[1] + item[2]) / 3)
        # Use luminance as the alpha channel, making black perfectly transparent 
        # and bright fire opaque.
        newData.append((item[0], item[1], item[2], lum))
        
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent fire trail to: {output_path}")

if __name__ == "__main__":
    process_fire_trail(sys.argv[1], sys.argv[2])
