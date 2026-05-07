export const SITE_URL = "https://nextunicorn.app";

export function absoluteUrl(path: string = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedPath === "/" ? SITE_URL : `${SITE_URL}${normalizedPath}`;
}

export function truncateMetaDescription(text: string, maxLength: number = 155) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const safeSlice = normalized.slice(0, maxLength - 1);
  const cutAt = safeSlice.lastIndexOf(" ");
  const base = cutAt > 80 ? safeSlice.slice(0, cutAt) : safeSlice;
  return `${base}.`;
}
