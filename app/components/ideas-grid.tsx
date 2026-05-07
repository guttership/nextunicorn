"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import AdCard from "@/app/components/ad-card";
import { Language, t } from "@/app/lib/i18n";
import { useState, useEffect } from "react";

interface Idea {
  id: number;
  title: string;
  slogan: string;
  description: string;
  votes: number;
  rank: number;
  origin?: string;
  isCommunityValidated?: boolean;
}

interface IdeasGridProps {
  ideas: Idea[];
  lang: Language;
}

export default function IdeasGrid({ ideas, lang }: IdeasGridProps) {
  const [hasAds, setHasAds] = useState(false);

  useEffect(() => {
    checkAds();
  }, []);

  const checkAds = async () => {
    try {
      const response = await fetch("/api/ads/active?position=grid");
      const data = await response.json();
      setHasAds(data && data.length > 0);
    } catch (error) {
      console.error("Error checking for ads:", error);
    }
  };

  // Build grid with ads every 3 items
  const gridItems: Array<
    | { type: "idea"; content: Idea; key: string }
    | { type: "ad"; content: number; key: string }
  > = [];
  let adIndex = 0;

  ideas.forEach((idea, index) => {
    gridItems.push({
      type: "idea",
      content: idea,
      key: `idea-${idea.id}`,
    });

    // Insert ad every 3 items
    if (hasAds && (index + 1) % 3 === 0 && index < ideas.length - 1) {
      gridItems.push({
        type: "ad",
        content: adIndex++,
        key: `ad-${adIndex}`,
      });
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {gridItems.map((item) => {
        if (item.type === "ad") {
          return (
            <div key={item.key} className="relative">
              <div className="absolute top-2 left-2 z-10">
                <span className="text-xs font-mono text-slate-500">* {t("sponsored", lang)}</span>
              </div>
              <AdCard position="grid" />
            </div>
          );
        }

        const idea = item.content as Idea;
        return (
          <Card
            key={item.key}
            className="bg-slate-900 border-slate-800 hover:border-pink-600 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-lg font-mono text-slate-100 flex-1">
                  {idea.title}
                </CardTitle>
                <div className="flex items-center gap-2 ml-2">
                  {idea.isCommunityValidated ? (
                    <span className="bg-green-700 text-green-100 text-xs font-mono px-2 py-1 rounded">Community-validated</span>
                  ) : idea.origin === 'COMMUNITY' ? (
                    <span className="bg-orange-600 text-orange-100 text-xs font-mono px-2 py-1 rounded">Community-submitted</span>
                  ) : (
                    <span className="bg-slate-700 text-slate-200 text-xs font-mono px-2 py-1 rounded">AI-generated</span>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <div className="text-pink-400 font-bold text-lg">#{idea.rank}</div>
                </div>
              </div>
              <CardDescription className="text-xs font-mono text-slate-300 mt-2">
                &quot;{idea.slogan}&quot;
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4 text-sm leading-relaxed">{idea.description}</p>
              <div className="flex items-center gap-2 text-slate-400 font-mono text-sm">
                <span className="text-pink-400 font-bold">{idea.votes}</span>
                <span>votes</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
