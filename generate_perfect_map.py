import urllib.request
import json
import re

print("Downloading GeoJSON...")
url = "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
response = urllib.request.urlopen(url)
geo_data = json.loads(response.read())

scale = 10
width = 360 * scale
height = 180 * scale

def lonlat_to_xy(lon, lat):
    x = (lon + 180) * scale
    y = (90 - lat) * scale
    return x, y

svg_paths = []

for feature in geo_data['features']:
    geom = feature['geometry']
    if not geom: continue
    
    geom_type = geom['type']
    coords = geom['coordinates']
    
    def process_polygon(polygon):
        path_str = ""
        for i, point in enumerate(polygon):
            lon, lat = point
            x, y = lonlat_to_xy(lon, lat)
            if i == 0:
                path_str += f"M {x:.2f} {y:.2f} "
            else:
                path_str += f"L {x:.2f} {y:.2f} "
        path_str += "Z "
        return path_str
        
    path_d = ""
    if geom_type == 'Polygon':
        for ring in coords:
            path_d += process_polygon(ring)
    elif geom_type == 'MultiPolygon':
        for poly in coords:
            for ring in poly:
                path_d += process_polygon(ring)
                
    if path_d:
        svg_paths.append(f'<path d="{path_d.strip()}" />')

svg_content = f'''<svg id="vector-world-map" class="world-map-svg" viewBox="0 0 {width} {height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
  <g id="map-continents">
    {"".join(svg_paths)}
  </g>
</svg>'''

html_path = 'explore/dino-map.html'
with open(html_path, 'r') as f:
    html = f.read()

# Replace the existing SVG
new_html = re.sub(r'<svg id="vector-world-map".*?</svg>', svg_content, html, flags=re.DOTALL)

with open(html_path, 'w') as f:
    f.write(new_html)

print("Generated exact Equirectangular SVG map and injected into HTML.")
