export const getAssetPath = (path: string): string => {
  // In development, use the direct path
  if (import.meta.env.DEV) {
    return path;
  }
  
  // In production (GitHub Pages), prepend the repo name
  return `/AstroImageGallery${path}`;
}