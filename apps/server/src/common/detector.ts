export function getExtFromContentType(contentType: string): string | undefined {
  const extMap = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/bmp': '.bmp',
    'image/tiff': '.tiff'
  };

  return extMap[contentType as keyof typeof extMap];
}
