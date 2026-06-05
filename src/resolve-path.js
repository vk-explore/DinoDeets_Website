export function resolveAssetPath(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('/DinoDeets_Website/')) {
    return path;
  }
  let clean = path;
  if (clean.startsWith('./')) {
    clean = clean.substring(2);
  } else if (clean.startsWith('../')) {
    clean = clean.substring(3);
  } else if (clean.startsWith('/')) {
    clean = clean.substring(1);
  }
  return `/DinoDeets_Website/${clean}`;
}

export function normalizeAllImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/DinoDeets_Website/')) {
      img.setAttribute('src', resolveAssetPath(src));
    }
  });
}
