"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Language, t } from "@/app/lib/i18n";
import { ThumbsUp, X } from "lucide-react";
import Image from "next/image";
import { getTranslatedIdea } from "@/app/lib/ideas-translations";

interface Idea {
  id: number;
  title: string;
  slogan: string;
  description: string;
  aiPrompt?: string;
  aiPromptId?: string;
  translations?: Array<{
    language: string;
    title: string;
    slogan: string;
    description: string;
    aiPrompt: string;
  }>;
}

interface Advertiser {
  id: number;
  saasName: string;
  logoUrl: string;
  targetUrl: string;
}

interface IdeaItem {
  type: "idea" | "ad";
  data: Idea | Advertiser;
}

interface MobileIdeaStackProps {
  lang: Language;
  voterId: string;
}

export function MobileIdeaStack({ lang, voterId }: MobileIdeaStackProps) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [ads, setAds] = useState<Advertiser[]>([]);
  const [stack, setStack] = useState<IdeaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const getIdeaText = (idea: Idea) => {
    // Try manual translations first
    if (idea.aiPromptId) {
      const translated = getTranslatedIdea(idea.aiPromptId, lang);
      if (translated) return translated;
    }

    // If no manual translation and lang is not English, check AI translations
    if (lang !== 'en' && idea.translations) {
      const translation = idea.translations.find(t => t.language === lang);
      console.log('Mobile - Looking for translation:', { ideaId: idea.id, lang, translations: idea.translations, found: translation });
      if (translation) {
        return {
          title: translation.title,
          slogan: translation.slogan,
          description: translation.description,
          aiPrompt: translation.aiPrompt,
        };
      }
    }

    // Fallback to English
    console.log('Mobile - Using fallback for idea:', idea.id, 'lang:', lang, 'has translations:', !!idea.translations);
    return {
      title: idea.title,
      slogan: idea.slogan,
      description: idea.description,
      aiPrompt: idea.aiPrompt
    };
  };

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setLoading(true);
      // Get top ideas
      const ideasResponse = await fetch("/api/ranking?limit=100");
      const ideasData = await ideasResponse.json();
      setIdeas(ideasData);

      // Get ads
      const adsResponse = await fetch("/api/ads/active?position=left");
      const adsData = await adsResponse.json();
      const adsList = adsData.cards?.[0]?.recto ? [adsData.cards[0].recto] : [];
      setAds(adsList);

      // Build stack
      const newStack: IdeaItem[] = [];
      let adIndex = 0;

      ideasData.forEach((idea: Idea, index: number) => {
        newStack.push({ type: "idea", data: idea });
        // Add ad every 3 ideas
        if ((index + 1) % 3 === 0 && adIndex < adsList.length) {
          newStack.push({ type: "ad", data: adsList[adIndex++] });
        }
      });

      setStack(newStack);
    } catch (error) {
      console.error("Error loading ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (ideaId: number, value: "up" | "down") => {
    if (!voterId) return;

    try {
      await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId, voterId, value }),
      });
    } catch (error) {
      console.error("Vote error:", error);
    }

    moveToNext();
  };

  const moveToNext = () => {
    setCurrentIndex(prev => prev + 1);
    setTranslateX(0);
    setSwipeDirection(null);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);

    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (translateX > 100) {
      handleVote(currentItem?.type === "idea" ? (currentItem.data as Idea).id : 0, "up");
    } else if (translateX < -100) {
      moveToNext();
    } else {
      setTranslateX(0);
      setSwipeDirection(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-pink-500 mx-auto mb-4"></div>
        <p className="text-slate-400 font-mono">{t("loading", lang)}</p>
      </div>
    );
  }

  if (currentIndex >= stack.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 font-mono mb-4">No more ideas to review</p>
        <button
          onClick={() => setCurrentIndex(0)}
          className="bg-pink-600 hover:bg-pink-700 text-white font-mono font-bold py-3 px-6 rounded-lg transition-all"
        >
          Start Over
        </button>
      </div>
    );
  }

  const currentItem = stack[currentIndex];

  if (currentItem.type === "ad") {
    const ad = currentItem.data as Advertiser;
    return (
      <div
        className="w-full max-w-md mx-auto px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: "none" }}
      >
        <div
          style={{
            transform: `translateX(${translateX}px)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          <Card className="bg-slate-900 border-slate-800 shadow-xl overflow-hidden">
            <div className="absolute top-2 left-2 z-10">
              <span className="text-xs font-mono text-slate-500">* {t("sponsored", lang)}</span>
            </div>

            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-mono text-pink-400">
                {ad.saasName}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {ad.logoUrl && (
                <div className="flex justify-center">
                  <div className="relative w-24 h-24">
                    <Image
                      src={ad.logoUrl}
                      alt={ad.saasName}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}

              <a
                href={ad.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-mono font-bold py-4 text-center rounded-lg transition-all shadow-lg hover:shadow-pink-500/50"
              >
                Visit Website
              </a>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => moveToNext()}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-mono font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Skip
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Swipe Indicators */}
        {swipeDirection && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-400 font-mono">
              {swipeDirection === "right"
                ? "Continue to visit"
                : "Skip to next"}
            </p>
          </div>
        )}
      </div>
    );
  }

  const idea = currentItem.data as Idea;

  return (
    <div
      className="w-full max-w-md mx-auto px-4 pb-32"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: "none" }}
    >
      <div
        style={{
          transform: `translateX(${translateX}px) rotateZ(${Math.min(Math.max(translateX / 50, -15), 15)}deg)`,
          transition: isDragging ? "none" : "transform 0.3s ease-out",
          opacity: Math.max(0.7, 1 - Math.abs(translateX) / 500),
        }}
        className="h-96"
      >
        <Card className="bg-slate-900 border-slate-800 shadow-xl h-full overflow-hidden flex flex-col">
          <CardHeader className="pb-2 shrink-0">
            <CardTitle className="text-lg font-mono text-slate-100">
              {getIdeaText(idea).title}
            </CardTitle>
            <p className="text-xs font-mono text-slate-300 mt-2">
              &quot;{getIdeaText(idea).slogan}&quot;
            </p>
          </CardHeader>

          <CardContent className="overflow-y-auto flex-1">
            <p className="text-slate-300 mb-4 text-sm leading-relaxed">
              {getIdeaText(idea).description}
            </p>
            {getIdeaText(idea).aiPrompt && (
              <p className="text-slate-400 mb-4 text-xs italic border-l-2 border-pink-500 pl-3 bg-slate-800/50 py-2 px-3 rounded">
                &quot;{getIdeaText(idea).aiPrompt}&quot;
              </p>
            )}
          </CardContent>

          <div className="shrink-0 border-t border-slate-800 p-3 space-y-2">
            <button
              onClick={() => handleVote(idea.id, "up")}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-mono font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              {t("swipeVote", lang)}
            </button>
            <button
              onClick={() => moveToNext()}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-mono font-bold py-3 rounded-full transition-all flex items-center justify-center gap-2 text-sm"
            >
              <X className="w-4 h-4" />
              {t("swipeNext", lang)}
            </button>
          </div>
        </Card>
      </div>

      {/* Swipe Indicators */}
      {swipeDirection && (
        <>
          {swipeDirection === "right" && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-start p-6">
              <div
                className="text-pink-500 font-black text-6xl opacity-70 rotate-12 drop-shadow-lg"
                style={{ fontFamily: "var(--font-clicker)" }}
              >
                {t("swipeVote", lang)}
              </div>
            </div>
          )}
          {swipeDirection === "left" && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-end p-6">
              <div
                className="text-slate-400 font-black text-6xl opacity-70 -rotate-12 drop-shadow-lg"
                style={{ fontFamily: "var(--font-clicker)" }}
              >
                {t("swipeNext", lang)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
