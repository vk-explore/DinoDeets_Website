#!/usr/bin/env python3
"""Sync the DINO LOADER block from index.html to all other HTML files."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCE = os.path.join(ROOT, "index.html")

START_MARKER = "<!-- DINO LOADER START -->"
END_MARKER = "<!-- DINO LOADER END -->"

# Extract loader block from index.html
with open(SOURCE, "r", encoding="utf-8") as f:
    source_lines = f.readlines()

start_idx = None
end_idx = None
for i, line in enumerate(source_lines):
    if START_MARKER in line:
        start_idx = i
    if END_MARKER in line:
        end_idx = i
        break

if start_idx is None or end_idx is None:
    print("ERROR: Could not find loader markers in index.html")
    exit(1)

# The loader block (from START to END, inclusive), stripped of leading page-specific indentation
loader_block = source_lines[start_idx : end_idx + 1]
print(f"Extracted loader block: {len(loader_block)} lines from index.html (lines {start_idx+1}-{end_idx+1})")

# Find all HTML files with the loader
targets = []
for dirpath, _, filenames in os.walk(ROOT):
    # Skip node_modules, dist, .git
    if any(skip in dirpath for skip in ["node_modules", "dist", ".git", ".gemini"]):
        continue
    for fn in filenames:
        if fn.endswith(".html"):
            fpath = os.path.join(dirpath, fn)
            if fpath == SOURCE:
                continue
            with open(fpath, "r", encoding="utf-8") as f:
                content = f.read()
            if START_MARKER in content and END_MARKER in content:
                targets.append(fpath)

print(f"Found {len(targets)} target files to update")

for fpath in sorted(targets):
    with open(fpath, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    s_idx = None
    e_idx = None
    for i, line in enumerate(lines):
        if START_MARKER in line:
            s_idx = i
        if END_MARKER in line:
            e_idx = i
            break
    
    if s_idx is None or e_idx is None:
        print(f"  SKIP {os.path.relpath(fpath, ROOT)}: markers not found")
        continue
    
    # Detect indentation of the START marker in the target file
    target_indent = lines[s_idx][:len(lines[s_idx]) - len(lines[s_idx].lstrip())]
    source_indent = loader_block[0][:len(loader_block[0]) - len(loader_block[0].lstrip())]
    
    # Re-indent loader block to match target
    adjusted_block = []
    for line in loader_block:
        if line.strip() == "":
            adjusted_block.append("\n")
        elif line.startswith(source_indent):
            adjusted_block.append(target_indent + line[len(source_indent):])
        else:
            adjusted_block.append(line)
    
    new_lines = lines[:s_idx] + adjusted_block + lines[e_idx + 1:]
    
    with open(fpath, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    
    old_count = e_idx - s_idx + 1
    new_count = len(adjusted_block)
    rel = os.path.relpath(fpath, ROOT)
    print(f"  ✅ {rel}: replaced {old_count} lines → {new_count} lines")

print("\nDone!")
