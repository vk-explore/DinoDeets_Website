import os
import re
from PIL import Image

workspace_dir = "/Users/vivek/Documents/2020Generators/DinoDeets_Website"
images_dir = os.path.join(workspace_dir, "public", "images")

# File extensions to optimize
source_extensions = {".png", ".jpg", ".jpeg"}

# Track files that were converted (basename mapping)
converted_files = {}

print("Step 1: Converting images to WebP...")

for root, dirs, files in os.walk(images_dir):
    for file in files:
        name, ext = os.path.splitext(file)
        ext_lower = ext.lower()
        if ext_lower in source_extensions:
            src_path = os.path.join(root, file)
            dest_path = os.path.join(root, name + ".webp")
            
            try:
                with Image.open(src_path) as img:
                    # Determine transparency/mode
                    # WebP supports RGB and RGBA.
                    has_trans = False
                    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                        has_trans = True
                    else:
                        try:
                            # Convert to RGBA and check alpha channel extrema
                            rgba_img = img.convert('RGBA')
                            extrema = rgba_img.getextrema()
                            if len(extrema) >= 4:
                                alpha_min, alpha_max = extrema[3]
                                if alpha_min < 255:
                                    has_trans = True
                        except Exception:
                            pass

                    if has_trans:
                        save_mode = 'RGBA'
                        converted_img = img.convert('RGBA')
                    else:
                        save_mode = 'RGB'
                        converted_img = img.convert('RGB')
                    
                    # Save as WebP with high quality
                    converted_img.save(dest_path, 'WEBP', quality=85)
                
                # Delete original file
                os.remove(src_path)
                
                # Record conversion
                rel_dir = os.path.relpath(root, images_dir)
                orig_rel_path = os.path.join("images", rel_dir, file).replace("\\", "/")
                new_rel_path = os.path.join("images", rel_dir, name + ".webp").replace("\\", "/")
                
                # Handle relative paths without leading directory structure if needed
                converted_files[orig_rel_path] = new_rel_path
                
                # Also record just the file name mapping
                converted_files[file] = name + ".webp"
                
                print(f"Converted: {file} -> {name}.webp ( transparency preserved: {save_mode == 'RGBA'} )")
            except Exception as e:
                print(f"Error converting {src_path}: {e}")

print(f"Total files converted: {len(converted_files) // 2}")

print("\nStep 2: Updating references in codebase...")

# Directories to search for references
search_dirs = [
    os.path.join(workspace_dir, "src"),
    os.path.join(workspace_dir, "games"),
    os.path.join(workspace_dir, "explore"),
    os.path.join(workspace_dir, "art")
]
search_files = [
    os.path.join(workspace_dir, "index.html")
]

# Walk through all directories and files
all_paths = list(search_files)
for s_dir in search_dirs:
    if os.path.exists(s_dir):
        for root, dirs, files in os.walk(s_dir):
            for file in files:
                # Update HTML, JS, JSON, CSS files
                if file.endswith(('.html', '.js', '.json', '.css')):
                    all_paths.append(os.path.join(root, file))

# Perform replacement in code files
update_count = 0
for file_path in all_paths:
    if not os.path.exists(file_path):
        continue
    
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
            
        modified = False
        
        # 1. Update full relative path matches (e.g., images/dinos/trex.png -> images/dinos/trex.webp)
        for orig, new in converted_files.items():
            if "/" in orig and orig in content:
                content = content.replace(orig, new)
                modified = True
                
        # 2. Update filename matches (e.g. trex.png -> trex.webp)
        for orig, new in converted_files.items():
            if "/" not in orig and orig in content:
                # Ensure it's not a download attribute replacement if not wanted, but downloads should also point to webp now
                # Let's replace filename matches safely
                # e.g., /trex.png -> /trex.webp or "trex.png" -> "trex.webp"
                content = content.replace(orig, new)
                modified = True
                
        # 3. Specifically replace any .png/.jpg/.jpeg download attributes for coloring or images
        # e.g., download="DinoDeets-trex.png" -> download="DinoDeets-trex.webp"
        if file_path.endswith('.js') or file_path.endswith('.html'):
            new_content = re.sub(r'(\.png|\.jpg|\.jpeg)(?=["\'\s])', '.webp', content, flags=re.IGNORECASE)
            if new_content != content:
                content = new_content
                modified = True

        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated references in: {os.path.relpath(file_path, workspace_dir)}")
            update_count += 1
            
    except Exception as e:
        print(f"Error processing {file_path}: {e}")

print(f"\nOptimization complete! References updated in {update_count} files.")
