export const SITE_URL = "https://nextunicorn.app";

export function absoluteUrl(path: string = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
}
