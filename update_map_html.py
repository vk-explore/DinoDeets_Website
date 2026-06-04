import re

html_path = 'explore/dino-map.html'
with open(html_path, 'r') as f:
    content = f.read()

map_html = """
<!-- Map Page Content -->
<main class="dino-map-layout">
  <div class="map-container">
    <h1 class="map-title">Global Discovery Map</h1>
    <p class="map-subtitle">Click the glowing nodes to see which dinosaurs were discovered there!</p>
    
    <div class="vector-map-wrapper" id="vector-map-wrapper">
      <!-- We will inject the world map SVG and markers via JS to keep this file clean -->
    </div>
  </div>

  <aside class="map-side-panel" id="map-side-panel">
    <div class="panel-header">
      <h2 id="panel-location-title" class="panel-title">Explore Locations</h2>
      <p id="panel-location-desc" class="panel-desc">Select a marker on the map to begin.</p>
    </div>
    <div class="panel-content" id="panel-dino-grid">
      <!-- Dino tiles injected here via JS -->
      <div class="panel-placeholder">
        <img src="../images/icons/logo.png" alt="Dino Deets Logo" style="width: 100px; opacity: 0.5;">
      </div>
    </div>
  </aside>
</main>
"""

# Insert between nav and footer
# The nav ends with: </nav>
# The footer starts with: <!-- Footer -->

new_content = re.sub(r'(</nav>\s*)(<!-- Footer -->)', r'\1' + map_html + r'\n\2', content)

with open(html_path, 'w') as f:
    f.write(new_content)

print("Updated dino-map.html")
