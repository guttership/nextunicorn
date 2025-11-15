"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { getIdeaRanking } from "@/app/lib/actions/duel";
import Link from "next/link";
import { Trophy, Flame, X } from "lucide-react";
import { Language, detectLanguage, t, formatPrice } from "@/app/lib/i18n";
import { getTranslatedIdea } from "@/app/lib/ideas-translations";
import { LanguageSelector } from "@/app/components/language-selector";
import Image from "next/image";
import { Card } from "@/app/components/ui/card";

interface RankedIdea {
  id: number;
  title: string;
  slogan: string;
  description?: string;
  score: number;
  aiPromptId?: string;
  translations?: Array<{
    language: string;
    slogan: string;
    description: string;
  }>;
}

interface AdvertiserRanking {
  rank: number;
  id: string;
  saasName: string;
  logoUrl: string;
  clicks: number;
  price: number;
  revenue: number;
}

const MEDALS = ["#1", "#2", "#3"];

export default function LeaderboardPage() {
  const [ranking, setRanking] = useState<RankedIdea[]>([]);
  const [advertisers, setAdvertisers] = useState<AdvertiserRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<Language>("en");
  const [selectedIdea, setSelectedIdea] = useState<RankedIdea | null>(null);

  useEffect(() => {
    setLang(detectLanguage());
    loadRanking();
    loadAdvertisers();
  }, []);

  const loadRanking = async () => {
    try {
      setLoading(true);
      const data = await getIdeaRanking(50);
      setRanking(data);
    } catch (error) {
      console.error("Failed to load ranking:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdvertisers = async () => {
    try {
      const response = await fetch("/api/advertisers/leaderboard");
      const data = await response.json();
      setAdvertisers(data);
    } catch (error) {
      console.error("Failed to load advertisers:", error);
    }
  };

  const getIdeaText = (idea: RankedIdea) => {
    // Try manual translations first
    const translated = idea.aiPromptId ? getTranslatedIdea(idea.aiPromptId, lang) : null;
    if (translated) return translated;

    // If no manual translation and lang is not English, check AI translations
    if (lang !== 'en' && idea.translations) {
      const translation = idea.translations.find(t => t.language === lang);
      if (translation) {
        return {
          title: idea.title,
          slogan: translation.slogan,
          description: translation.description,
        };
      }
    }

    // Fallback to English
    return {
      title: idea.title,
      slogan: idea.slogan,
      description: idea.description || idea.slogan
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
          </div>
          <p className="text-lg text-slate-400 font-mono">{t("loadingRanking", lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
                <Image src="/unicorne.png" alt="Unicorn" width={32} height={32} />
                <span className="text-xl font-black text-pink-600" style={{ fontFamily: 'var(--font-clicker)' }}>NextUnicorn</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector currentLang={lang} onChange={(newLang) => {
              setLang(newLang);
              localStorage.setItem("language", newLang);
            }} />
            <Link href="/">
              <button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-mono text-sm font-bold transition-colors">
                {t("back", lang)}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-pink-600 flex items-center justify-center gap-3 mb-2" style={{ fontFamily: 'var(--font-clicker)' }}>
            <Trophy className="w-8 h-8 md:w-12 md:h-12" />
            {t("hallOfFame", lang)}
          </h1>
          <p className="text-slate-400 font-mono text-sm md:text-base">{t("topIdeas", lang)}</p>
        </div>

        {/* Ideas Ranking Table - Desktop */}
        <div className="hidden md:block bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden mb-12">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent bg-slate-900">
                <TableHead className="text-pink-500 font-mono font-bold w-16">#</TableHead>
                <TableHead className="text-pink-500 font-mono font-bold">TITLE</TableHead>
                <TableHead className="text-pink-500 font-mono font-bold">SLOGAN</TableHead>
                <TableHead className="text-pink-500 font-mono font-bold text-right">SCORE</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ranking.length > 0 ? (
                ranking.map((idea, index) => (
                  <TableRow 
                    key={idea.id} 
                    className="border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedIdea(idea)}
                  >
                    <TableCell className="font-mono text-slate-300 font-bold">
                      {index < 3 ? MEDALS[index] : `${index + 1}.`}
                    </TableCell>
                    <TableCell className="font-mono text-slate-100 font-semibold">{getIdeaText(idea).title}</TableCell>
                    <TableCell className="text-slate-400 font-mono text-sm">{getIdeaText(idea).slogan}</TableCell>
                    <TableCell className="text-right font-mono font-bold text-lg">
                      <span className="text-pink-500 flex items-center justify-end gap-1">
                        {index === 0 && <Flame className="w-4 h-4 text-pink-500" />}
                        {idea.score}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-slate-400 font-mono">
                    $ {t("noIdeas", lang)}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Ideas Ranking Cards - Mobile */}
        <div className="md:hidden space-y-4 mb-12">
          {ranking.length > 0 ? (
            ranking.map((idea, index) => (
              <div 
                key={idea.id} 
                className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 hover:border-pink-500/50 transition-all cursor-pointer"
                onClick={() => setSelectedIdea(idea)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-2xl font-mono font-bold">
                    {index < 3 ? MEDALS[index] : `#${index + 1}`}
                  </span>
                  <span className="text-pink-500 font-mono font-bold text-xl flex items-center gap-1">
                    {index === 0 && <Flame className="w-5 h-5" />}
                    {idea.score}
                  </span>
                </div>
                <h3 className="font-mono text-slate-100 font-bold mb-1">{getIdeaText(idea).title}</h3>
                <p className="text-slate-400 font-mono text-sm">{getIdeaText(idea).slogan}</p>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-slate-400 font-mono">$ {t("noIdeas", lang)}</p>
          )}
        </div>

        {/* Advertisers Section */}
        {advertisers.length > 0 && (
          <div>
            <div className="mb-6 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black text-pink-600 font-mono flex items-center justify-center md:justify-start gap-2 mb-1">
                <Flame className="w-6 h-6" />
                TOP ADVERTISERS
              </h2>
              <p className="text-slate-400 font-mono text-sm">Most clicked ad placements</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {advertisers.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-slate-900/50 border border-slate-800 rounded-lg p-3 md:p-4 hover:border-pink-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs md:text-sm font-mono text-pink-500 font-bold">
                      #{ad.rank}
                    </span>
                  </div>

                  <div className="mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={ad.logoUrl}
                      alt={ad.saasName}
                      className="w-full h-12 md:h-16 object-contain rounded bg-slate-800/50 p-2"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/64?text=" + ad.saasName;
                      }}
                    />
                  </div>

                  <h3 className="text-xs md:text-sm font-mono font-bold text-slate-100 mb-2 truncate">
                    {ad.saasName}
                  </h3>

                  <div className="space-y-1 text-xs font-mono text-slate-400">
                    <div className="flex justify-between">
                      <span>Clicks:</span>
                      <span className="text-pink-500 font-bold">{ad.clicks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="text-green-400 font-bold">{formatPrice(ad.revenue, lang)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 text-center text-slate-500 font-mono text-xs">
          <p>{t("updates", lang)}</p>
        </div>
      </div>

      {/* Modal for idea details */}
      {selectedIdea && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setSelectedIdea(null)}
        >
          <div 
            className="bg-slate-900 border-2 border-pink-600 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSelectedIdea(null)}
                className="text-slate-400 hover:text-pink-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Rank badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl font-mono font-bold text-pink-500">
                #{ranking.findIndex(i => i.id === selectedIdea.id) + 1}
              </span>
              <div className="flex items-center gap-2 text-pink-500 font-mono font-bold text-2xl">
                <Flame className="w-6 h-6" />
                {selectedIdea.score}
              </div>
            </div>

            {/* Idea content */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-mono text-pink-500 mb-1">TITLE</h3>
                <p className="text-6xl font-bold text-slate-100" style={{ fontFamily: 'var(--font-clicker)' }}>
                  {getIdeaText(selectedIdea).title}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-mono text-pink-500 mb-1">SLOGAN</h3>
                <p className="text-base font-mono text-slate-300">
                  {getIdeaText(selectedIdea).slogan}
                </p>
              </div>

              {getIdeaText(selectedIdea).description && (
                <div>
                  <h3 className="text-sm font-mono text-pink-500 mb-1">DESCRIPTION</h3>
                  <p className="text-sm font-mono text-slate-400">
                    {getIdeaText(selectedIdea).description}
                  </p>
                </div>
              )}

              {selectedIdea.aiPromptId && (
                <div className="mt-6 pt-6 border-t border-slate-800">
                  <p className="text-xs font-mono text-slate-600">
                    AI Prompt ID: {selectedIdea.aiPromptId}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
