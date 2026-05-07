import type { Metadata } from "next";

import LeaderboardPage from "@/app/components/leaderboard-page";
import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Leaderboard - Top Startup Ideas Ranked by Community Votes | NextUnicorn",
  description: "Explore the NextUnicorn leaderboard to discover startup ideas ranked by live community votes and trend signals.",
  alternates: {
    canonical: absoluteUrl('/leaderboard'),
  },
  openGraph: {
    title: "Leaderboard - Top Startup Ideas Ranked by Community Votes",
    description: "Explore the NextUnicorn leaderboard to discover startup ideas ranked by live community votes and trend signals.",
    url: absoluteUrl('/leaderboard'),
    type: "website",
  },
};

export default function Leaderboard() {
  return <LeaderboardPage />;
}
