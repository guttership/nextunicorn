import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.SEO_BASE_URL || "https://nextunicorn.app";
const CANONICAL_ORIGIN = "https://nextunicorn.app";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "";

function normalizeUrl(url) {
  const parsed = new URL(url, BASE_URL);
  parsed.hash = "";
  if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
    parsed.pathname = parsed.pathname.replace(/\/+$/, "");
  }
  return parsed.toString();
}

function parseSitemapLocs(xml) {
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/gi;
  let match;

  while ((match = regex.exec(xml)) !== null) {
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

function isBlockedByRobots(pathname, rules) {
  const allowMatches = rules.allow.filter((rule) => rule && pathname.startsWith(rule));
  const disallowMatches = rules.disallow.filter((rule) => rule && pathname.startsWith(rule));

  const bestAllow = allowMatches.sort((a, b) => b.length - a.length)[0] || "";
  const bestDisallow = disallowMatches.sort((a, b) => b.length - a.length)[0] || "";

  if (!bestDisallow) {
    return false;
  }

  return bestDisallow.length > bestAllow.length;
}

async function fetchText(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

async function ensureIndexNowKeyFile(baseOrigin, key) {
  const keyFilePath = path.resolve(process.cwd(), "public", `${key}.txt`);
  if (!fs.existsSync(keyFilePath)) {
    fs.writeFileSync(keyFilePath, key, "utf8");
    console.log(`Created verification file: public/${key}.txt`);
  }

  return `${baseOrigin}/${key}.txt`;
}

async function submitIndexNow({ host, key, keyLocation, urlList }) {
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      host,
      key,
      keyLocation,
      urlList,
    }),
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`IndexNow error ${response.status}: ${body}`);
  }

  return body;
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");

  if (!INDEXNOW_KEY && !dryRun) {
    console.error("INDEXNOW_KEY is required.");
    console.error("Example (PowerShell): $env:INDEXNOW_KEY='your-key'; npm run seo:indexnow");
    process.exit(1);
  }

  const canonicalOrigin = new URL(CANONICAL_ORIGIN).origin;
  const [sitemapXml, robotsTxt] = await Promise.all([
    fetchText(`${BASE_URL}/sitemap.xml`),
    fetchText(`${BASE_URL}/robots.txt`),
  ]);

  const robotsRules = parseRobots(robotsTxt);
  const sitemapUrls = parseSitemapLocs(sitemapXml)
    .map((url) => normalizeUrl(url))
    .filter((url) => url.startsWith(canonicalOrigin));

  const eligibleUrls = sitemapUrls.filter((url) => {
    const pathname = new URL(url).pathname;
    return !isBlockedByRobots(pathname, robotsRules);
  });

  if (eligibleUrls.length === 0) {
    console.log("No eligible public canonical URLs found in sitemap.");
    return;
  }

  console.log(`Eligible URLs for IndexNow: ${eligibleUrls.length}`);
  if (dryRun) {
    console.log("Dry-run mode enabled. No submission sent.");
    return;
  }

  const keyLocation = await ensureIndexNowKeyFile(canonicalOrigin, INDEXNOW_KEY);

  const responseBody = await submitIndexNow({
    host: new URL(canonicalOrigin).hostname,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: eligibleUrls,
  });

  console.log("IndexNow submission completed.");
  if (responseBody) {
    console.log(responseBody);
  }
}

main().catch((error) => {
  console.error("IndexNow submission failed:", error.message);
  process.exit(1);
});
