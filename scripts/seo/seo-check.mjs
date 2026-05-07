import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.SEO_BASE_URL || "https://nextunicorn.app";
const CANONICAL_ORIGIN = "https://nextunicorn.app";
const CHECK_ORIGIN = new URL(BASE_URL).origin;
const REQUEST_TIMEOUT_MS = Number(process.env.SEO_TIMEOUT_MS || 15000);
const PRIVATE_ROUTE_PREFIXES = [
  "/admin",
  "/api",
  "/ingest",
  "/reservation/success",
  "/advertise/success",
];
const IMPORTANT_PUBLIC_PATHS = [
  "/",
  "/leaderboard",
  "/startup-ideas",
  "/trending-startup-ideas",
  "/micro-saas-ideas",
  "/ai-saas-ideas",
  "/micro-saas-ideas-for-developers",
  "/advertise",
  "/about",
  "/contact",
  "/blog",
];

function normalizeUrl(rawUrl) {
  const url = new URL(rawUrl, CANONICAL_ORIGIN);
  url.hash = "";
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
  }
  return url.toString();
}

function toPathname(rawUrl) {
  const url = new URL(rawUrl, CANONICAL_ORIGIN);
  return url.pathname || "/";
}

function toCheckUrl(rawCanonicalUrl) {
  const canonical = new URL(rawCanonicalUrl, CANONICAL_ORIGIN);
  return `${CHECK_ORIGIN}${canonical.pathname}${canonical.search}`;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function parseSitemapUrls(xmlText) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/gi;
  let match;

  while ((match = regex.exec(xmlText)) !== null) {
    urls.push(match[1].trim());
  }

  return urls;
}

function parseRobots(robotsText) {
  const lines = robotsText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("#"));

  const groups = [];
  let current = { userAgents: [], allow: [], disallow: [] };

  for (const line of lines) {
    const [rawKey, ...rawValue] = line.split(":");
    if (!rawKey || rawValue.length === 0) {
      continue;
    }

    const key = rawKey.trim().toLowerCase();
    const value = rawValue.join(":").trim();

    if (key === "user-agent") {
      if (current.userAgents.length > 0 || current.allow.length > 0 || current.disallow.length > 0) {
        groups.push(current);
        current = { userAgents: [], allow: [], disallow: [] };
      }
      current.userAgents.push(value.toLowerCase());
      continue;
    }

    if (key === "allow") {
      current.allow.push(value);
      continue;
    }

    if (key === "disallow") {
      current.disallow.push(value);
    }
  }

  if (current.userAgents.length > 0 || current.allow.length > 0 || current.disallow.length > 0) {
    groups.push(current);
  }

  const wildcardGroup = groups.find((group) => group.userAgents.includes("*"));
  return wildcardGroup || { userAgents: ["*"], allow: [], disallow: [] };
}

function isBlockedByRobots(pathname, robotsRules) {
  const allowMatches = robotsRules.allow.filter((rule) => rule && pathname.startsWith(rule));
  const disallowMatches = robotsRules.disallow.filter((rule) => rule && pathname.startsWith(rule));

  const bestAllow = allowMatches.sort((a, b) => b.length - a.length)[0] || "";
  const bestDisallow = disallowMatches.sort((a, b) => b.length - a.length)[0] || "";

  if (!bestDisallow) {
    return false;
  }

  return bestDisallow.length > bestAllow.length;
}

function extractCanonical(html) {
  const canonicalRegex = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i;
  const match = html.match(canonicalRegex);
  return match ? match[1].trim() : null;
}

function hasNoindex(html) {
  const robotsMetaRegex = /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i;
  const googlebotMetaRegex = /<meta[^>]+name=["']googlebot["'][^>]*content=["']([^"']+)["'][^>]*>/i;
  const robots = html.match(robotsMetaRegex)?.[1]?.toLowerCase() || "";
  const googlebot = html.match(googlebotMetaRegex)?.[1]?.toLowerCase() || "";
  return robots.includes("noindex") || googlebot.includes("noindex");
}

function extractInternalLinks(html, sourceUrl) {
  const links = [];
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  const canonicalOrigin = new URL(CANONICAL_ORIGIN).origin;
  const checkOrigin = new URL(CHECK_ORIGIN).origin;
  let match;

  while ((match = anchorRegex.exec(html)) !== null) {
    const rawHref = match[1].trim();
    if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:") || rawHref.startsWith("javascript:")) {
      continue;
    }

    const relNofollow = /rel=["'][^"']*nofollow[^"']*["']/i.test(match[0]);
    const absolute = new URL(rawHref, sourceUrl);
    if (absolute.origin !== canonicalOrigin && absolute.origin !== checkOrigin) {
      continue;
    }

    links.push({
      url: normalizeUrl(`${canonicalOrigin}${absolute.pathname}${absolute.search}`),
      nofollow: relNofollow,
    });
  }

  return links;
}

function collectRoutePatterns(appDir) {
  const routes = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name === "page.tsx") {
        routes.push(fullPath);
      }
    }
  }

  walk(appDir);

  return routes.map((filePath) => {
    const relativePath = path.relative(appDir, filePath).replace(/\\/g, "/");
    const routeSegments = relativePath
      .replace(/\/page\.tsx$/, "")
      .split("/")
      .filter(Boolean)
      .filter((segment) => !segment.startsWith("(") && !segment.endsWith(")"));

    const routePath = routeSegments.length === 0 ? "/" : `/${routeSegments.join("/")}`;
    const routeRegex = new RegExp(
      `^${routePath
        .replace(/\//g, "\\/")
        .replace(/\[\.\.\.[^\]]+\]/g, ".+")
        .replace(/\[[^\]]+\]/g, "[^/]+")
      }$`
    );

    return {
      routePath,
      routeRegex,
    };
  });
}

function extractSourceHrefCandidates(appDir) {
  const hrefs = [];
  const staticAssetExtRegex = /\.(?:png|jpg|jpeg|webp|gif|svg|ico|txt|xml|webmanifest|json|css|js|map)$/i;

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, "utf8");
        const regex = /(?:href|Link\s+href)\s*=\s*["'](\/[^"'#?]*)["']/g;
        let match;

        while ((match = regex.exec(content)) !== null) {
          const href = match[1];
          if (!href || href === "/" || href.startsWith("/api/") || href.startsWith("/_next/")) {
            continue;
          }

          if (staticAssetExtRegex.test(href)) {
            continue;
          }

          hrefs.push({
            filePath: fullPath,
            href,
          });
        }
      }
    }
  }

  walk(appDir);
  return hrefs;
}

function printSection(title, items) {
  if (items.length === 0) {
    return;
  }

  console.log(`\n${title} (${items.length})`);
  for (const item of items.slice(0, 50)) {
    console.log(`- ${item}`);
  }

  if (items.length > 50) {
    console.log(`- ... ${items.length - 50} more`);
  }
}

async function checkInternalLinkHttp(url) {
  try {
    const checkUrl = toCheckUrl(url);
    let response = await fetchWithTimeout(checkUrl, { method: "HEAD", redirect: "manual" });
    if (response.status === 405) {
      response = await fetchWithTimeout(checkUrl, { method: "GET", redirect: "manual" });
    }

    return {
      status: response.status,
      redirected: response.status >= 300 && response.status < 400,
      broken: response.status >= 400,
    };
  } catch (error) {
    return {
      status: 0,
      redirected: false,
      broken: true,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  console.log(`SEO check base URL: ${BASE_URL}`);

  const sitemapResponse = await fetchWithTimeout(`${BASE_URL}/sitemap.xml`);
  if (!sitemapResponse.ok) {
    throw new Error(`Unable to fetch sitemap.xml: HTTP ${sitemapResponse.status}`);
  }

  const robotsResponse = await fetchWithTimeout(`${BASE_URL}/robots.txt`);
  if (!robotsResponse.ok) {
    throw new Error(`Unable to fetch robots.txt: HTTP ${robotsResponse.status}`);
  }

  const sitemapXml = await sitemapResponse.text();
  const robotsText = await robotsResponse.text();

  const sitemapUrls = parseSitemapUrls(sitemapXml).map((url) => normalizeUrl(url));
  const robotsRules = parseRobots(robotsText);

  if (sitemapUrls.length === 0) {
    throw new Error("Sitemap is empty");
  }

  const sitemapStatusErrors = [];
  const sitemapRedirects = [];
  const sitemapBlockedByRobots = [];
  const sitemapNoindex = [];
  const sitemapCanonicalIssues = [];
  const sitemapNonCanonicalOrigin = [];
  const privateRoutesInSitemap = [];
  const importantPublicBlocked = [];
  const importantPublicMissingFromSitemap = [];
  const pageFetchErrors = [];

  const incomingLinkCount = new Map();
  const internalLinksToCheck = new Set();
  const sitemapUrlSet = new Set(sitemapUrls);

  for (const publicPath of IMPORTANT_PUBLIC_PATHS) {
    const publicUrl = normalizeUrl(`${CANONICAL_ORIGIN}${publicPath}`);
    if (!sitemapUrlSet.has(publicUrl)) {
      importantPublicMissingFromSitemap.push(publicUrl);
    }

    if (isBlockedByRobots(publicPath, robotsRules)) {
      importantPublicBlocked.push(publicUrl);
    }
  }

  for (const url of sitemapUrls) {
    incomingLinkCount.set(url, 0);

    if (!url.startsWith(`${CANONICAL_ORIGIN}/`) && url !== CANONICAL_ORIGIN) {
      sitemapNonCanonicalOrigin.push(url);
    }

    const pathname = toPathname(url);
    if (isBlockedByRobots(pathname, robotsRules)) {
      sitemapBlockedByRobots.push(url);
    }

    if (PRIVATE_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
      privateRoutesInSitemap.push(url);
    }

    let response;
    try {
      response = await fetchWithTimeout(toCheckUrl(url), { redirect: "manual" });
    } catch (error) {
      pageFetchErrors.push(`${url} -> ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    if (response.status >= 300 && response.status < 400) {
      sitemapRedirects.push(`${url} -> HTTP ${response.status}`);
      continue;
    }

    if (response.status !== 200) {
      sitemapStatusErrors.push(`${url} -> HTTP ${response.status}`);
      continue;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      continue;
    }

    const html = await response.text();

    if (hasNoindex(html)) {
      sitemapNoindex.push(url);
    }

    const canonical = extractCanonical(html);
    if (!canonical) {
      sitemapCanonicalIssues.push(`${url} -> missing canonical`);
    } else {
      const normalizedCanonical = normalizeUrl(canonical);
      if (normalizedCanonical !== url) {
        sitemapCanonicalIssues.push(`${url} -> canonical ${normalizedCanonical}`);
      }
    }

    const links = extractInternalLinks(html, url);
    for (const link of links) {
      internalLinksToCheck.add(link.url);
      if (!link.nofollow && sitemapUrlSet.has(link.url)) {
        incomingLinkCount.set(link.url, (incomingLinkCount.get(link.url) || 0) + 1);
      }
    }
  }

  const internalLinkRedirects = [];
  const internalLinkBroken = [];
  for (const internalLink of internalLinksToCheck) {
    const linkStatus = await checkInternalLinkHttp(internalLink);
    if (linkStatus.redirected) {
      internalLinkRedirects.push(`${internalLink} -> HTTP ${linkStatus.status}`);
    } else if (linkStatus.broken) {
      internalLinkBroken.push(`${internalLink} -> HTTP ${linkStatus.status}`);
    }
  }

  const lowIncomingLinks = [];
  for (const [url, count] of incomingLinkCount.entries()) {
    if (count <= 1) {
      lowIncomingLinks.push(`${url} -> ${count} dofollow internal link(s)`);
    }
  }

  const appDir = path.resolve(process.cwd(), "app");
  const routePatterns = collectRoutePatterns(appDir);
  const sourceHrefCandidates = extractSourceHrefCandidates(appDir);
  const sourceHrefBroken = [];

  for (const candidate of sourceHrefCandidates) {
    const normalizedHref = candidate.href.length > 1 ? candidate.href.replace(/\/+$/, "") : candidate.href;
    const matchesRoute = routePatterns.some((route) => route.routeRegex.test(normalizedHref));
    if (!matchesRoute) {
      sourceHrefBroken.push(`${candidate.href} in ${path.relative(process.cwd(), candidate.filePath).replace(/\\/g, "/")}`);
    }
  }

  console.log("\nSEO check summary");
  console.log(`- Sitemap URLs: ${sitemapUrls.length}`);
  console.log(`- Internal links checked (HTTP): ${internalLinksToCheck.size}`);
  console.log(`- Source href references checked: ${sourceHrefCandidates.length}`);

  printSection("Sitemap URLs not on canonical origin", sitemapNonCanonicalOrigin);
  printSection("Private/technical URLs present in sitemap", privateRoutesInSitemap);
  printSection("Important public pages missing from sitemap", importantPublicMissingFromSitemap);
  printSection("Important public pages blocked by robots.txt", importantPublicBlocked);
  printSection("Sitemap URLs blocked by robots.txt", sitemapBlockedByRobots);
  printSection("Sitemap URLs with non-200", sitemapStatusErrors);
  printSection("Sitemap URLs that redirect", sitemapRedirects);
  printSection("Sitemap URLs with noindex", sitemapNoindex);
  printSection("Sitemap canonical issues", sitemapCanonicalIssues);
  printSection("Sitemap page fetch errors", pageFetchErrors);
  printSection("Broken internal links (HTTP)", internalLinkBroken);
  printSection("Redirected internal links (HTTP)", internalLinkRedirects);
  printSection("Likely broken internal hrefs in source", sourceHrefBroken);
  printSection("Low internal dofollow incoming links", lowIncomingLinks);

  const criticalIssueCount =
    sitemapNonCanonicalOrigin.length +
    privateRoutesInSitemap.length +
    importantPublicMissingFromSitemap.length +
    importantPublicBlocked.length +
    sitemapBlockedByRobots.length +
    sitemapStatusErrors.length +
    sitemapRedirects.length +
    sitemapNoindex.length +
    sitemapCanonicalIssues.length +
    pageFetchErrors.length +
    internalLinkBroken.length +
    internalLinkRedirects.length +
    sourceHrefBroken.length;

  if (criticalIssueCount > 0) {
    console.error(`\nSEO check failed with ${criticalIssueCount} critical issue(s).`);
    process.exit(1);
  }

  console.log("\nSEO check passed with no critical issues.");
}

main().catch((error) => {
  console.error("SEO check crashed:", error);
  process.exit(1);
});
