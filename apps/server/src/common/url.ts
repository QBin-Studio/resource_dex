export function url_normalize(_url: string | URL) {
  const url = new URL(_url);
  return `${url.protocol}//${url.host}${url.pathname}`;
}
