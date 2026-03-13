"use client";

import { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { getDailyDuel, handleVote } from "@/app/lib/actions/duel";
import Link from "next/link";
import { ThumbsUp, X } from "lucide-react";
import { Language, detectLanguage, t } from "@/app/lib/i18n";
import { getTranslatedIdea } from "@/app/lib/ideas-translations";
import { LanguageSelector } from "@/app/components/language-selector";
import SubmitIdeaForm from "@/app/components/submit-idea-form";
import AdCard from "@/app/components/ad-card";
import { MobileIdeaStack } from "@/app/components/mobile-idea-stack";
import Image from "next/image";

interface Idea {
  id: number;
  title: string;
  slogan: string;
  description: string;
  aiPromptId: string;
  aiPrompt?: string;
  translations?: Array<{
    language: string;
    title: string;
    slogan: string;
    description: string;
    aiPrompt: string;
  }>;
}

interface DuelData {
  ideaA: Idea;
  ideaB: Idea;
  noMoreDuels?: boolean;
}

export default function DuelPage() {
  const [duel, setDuel] = useState<DuelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [voting, setVoting] = useState(false);
  const [selectedCard, setSelectedCard] = useState<"A" | "B" | null>(null);
  const [lang, setLang] = useState<Language>("en");
  const [loserCard, setLoserCard] = useState<"A" | "B" | null>(null);
  const [generationStep, setGenerationStep] = useState<string>("");
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [showExitAnimation, setShowExitAnimation] = useState(false);
  const [voterId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("voterId");
      if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("voterId", id);
      }
      return id;
    }
    return "";
  });

  useEffect(() => {
    setLang(detectLanguage());
    loadDuel();
  }, []);

  // Trigger entry animation when new duel loads (no loserCard, not loading)
  const isEntering = duel && loserCard === null && !loading;
  // Exit animation ONLY when showExitAnimation is true
  const isExiting = showExitAnimation;

  const getIdeaText = (idea: Idea) => {
    // Try manual translations first
    const translated = getTranslatedIdea(idea.aiPromptId, lang);
    if (translated) return translated;

    // If no manual translation and lang is not English, check AI translations
    if (lang !== 'en' && idea.translations) {
      const translation = idea.translations.find(t => t.language === lang);
      console.log('Duel - Looking for translation:', { ideaId: idea.id, lang, translations: idea.translations, found: translation });
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
    console.log('Duel - Using fallback for idea:', idea.id, 'lang:', lang, 'has translations:', !!idea.translations);
    return {
      title: idea.title,
      slogan: idea.slogan,
      description: idea.description,
      aiPrompt: idea.aiPrompt
    };
  };

  const loadDuel = async (excludeId?: number, excludeOpponentId?: number, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      setSelectedCard(null);
      setLoserCard(null);
      const duelData = await getDailyDuel(excludeId, voterId, excludeOpponentId);
      
      if (!duelData) {
        setError("no-ideas");
        setDuel(null);
      } else if ('noMoreDuels' in duelData && duelData.noMoreDuels) {
        setError("no-more-duels");
        setDuel(null);
      } else if ('ideaA' in duelData && 'ideaB' in duelData) {
        setDuel(duelData as DuelData);
      }
    } catch (error) {
      console.error("Failed to load duel:", error);
      setError("no-ideas");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleGenerateIdeas = async () => {
    try {
      setGenerating(true);
      setError(null);
      setLoading(true);
      
      // Simulate progressive steps for better UX
      setGenerationStep(lang === "fr" ? "Préparation du prochain lot d'idées..." : "Preparing the next idea batch...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGenerationStep(lang === "fr" ? "Analyse des signaux de vote..." : "Analyzing voting signals...");
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setGenerationStep(lang === "fr" ? "Génération de nouvelles idées à fort potentiel..." : "Generating new high-potential ideas...");
      const response = await fetch('/api/ideas/generate', { method: 'POST' });
      
      if (response.ok) {
        setGenerationStep(lang === "fr" ? "Mise en ligne des nouvelles idées..." : "Publishing fresh ideas...");
        await loadDuel();
        setGenerating(false);
        setLoading(false);
        setGenerationStep("");
      } else {
        const result = await response.json();
        setError(result.error || "Failed to generate ideas");
        setGenerating(false);
        setLoading(false);
        setGenerationStep("");
      }
    } catch (error) {
      console.error("Failed to generate ideas:", error);
      setError("Failed to generate ideas");
      setGenerating(false);
      setLoading(false);
      setGenerationStep("");
    }
  };

  const handleVoteClick = async (winnerId: number, loserId: number, choice: "A" | "B") => {
    if (!voterId || voting) return;
    
    const loser = choice === "A" ? "B" : "A";
    
    try {
      setVoting(true);
      setSelectedCard(choice);
      setLoserCard(loser); // Mark loser but DON'T animate yet
      
      // Wait to show the selection (1000ms to see which card won)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // NOW trigger exit animation
      setShowExitAnimation(true);
      
      // Register vote
      await handleVote(winnerId, loserId, voterId);
      
      // Wait for animations to complete (300ms)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Load next duel silently and avoid re-proposing the immediate opponent
      await loadDuel(winnerId, loserId, false);
      
      // Reset everything
      setSelectedCard(null);
      setLoserCard(null);
      setShowExitAnimation(false);
      setVoting(false);
    } catch (error) {
      console.error("Vote failed:", error);
      alert("Vote failed. You may have already voted in this matchup.");
      setSelectedCard(null);
      setLoserCard(null);
      setShowExitAnimation(false);
      setVoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <style>{`
        * {
          -webkit-overflow-scrolling: touch;
        }
        html, body {
          overflow-x: hidden;
          width: 100%;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideOutLeft {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(-100%); opacity: 0; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-slide-out-left {
          animation: slideOutLeft 0.3s ease-in-out forwards;
        }
        .animate-slide-out-right {
          animation: slideOutRight 0.3s ease-in-out forwards;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-in-out forwards;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-in-out forwards;
        }
      `}</style>

      <div className="flex flex-col min-h-screen w-full overflow-x-hidden pb-24">
        {/* Main flex row for ads and content */}
        <div className="flex flex-col lg:flex-row gap-4 flex-1 max-w-7xl mx-auto w-full">
          {/* Left Ad Spot - Hidden on mobile/tablet */}
          <div className="hidden lg:block shrink-0 pt-24">
            <div className="text-[10px] text-slate-500 font-mono mb-2 text-center">Sponsors :</div>
            <AdCard position="left" />
          </div>

          {/* Center Content */}
          <div className="flex-1 flex flex-col w-full">
            {/* Header avec langues, bouton génération et leaderboard */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 pt-4 sm:pt-6 pb-4 gap-3 sm:gap-0 shrink-0">
              <LanguageSelector currentLang={lang} onChange={(newLang) => {
                setLang(newLang);
                localStorage.setItem("language", newLang);
                window.dispatchEvent(new Event("languagechange"));
              }} />
              <div className="flex gap-2 sm:gap-4 items-center flex-wrap justify-center">
                <button
                  onClick={() => setShowSubmitForm(true)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-mono font-bold py-2 px-3 sm:px-4 rounded-lg transition-all text-xs sm:text-sm"
                >
                  {lang === "fr" ? "+ Soumettre" : "+ Submit"}
                </button>
                <Link href="/leaderboard">
                  <Button className="btn-secondary font-mono text-xs sm:text-sm">[ {t("leaderboard", lang)} ]</Button>
                </Link>
              </div>
            </div>

            {/* Titre avec licorne */}
            <div className="text-center py-6 px-4 shrink-0 mb-8 sm:mb-0">
              <div className="mb-6 flex justify-center">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-linear-to-r from-white/20 via-pink-300/40 to-rose-400/30 blur-3xl rounded-full scale-150"></div>
                  <Image 
                    src="/unicorne.png" 
                    alt="Unicorn" 
                    width={128}
                    height={128}
                    priority
                    className="relative z-10 w-full h-full object-contain"
                  />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-[1.2] pb-1 font-normal text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-rose-500 mb-4" style={{ fontFamily: 'var(--font-clicker)' }}>
                {t("hero_headline", lang)}
              </h1>
              <div className="text-slate-400 font-mono text-[10px] sm:text-sm space-y-1">
                <p>{t("hero_subheadline_line1", lang)}</p>
                <p>{t("hero_subheadline_line2", lang)}</p>
                <p className="text-pink-600 font-semibold">{t("hero_subheadline_line3", lang)}</p>
                <p className="text-slate-500">{t("hero_one_liner", lang)}</p>
                <div className="pt-2">
                  <Link
                    href="/startup-ideas"
                    className="inline-block rounded border border-slate-700 px-3 py-1 text-[10px] sm:text-xs font-mono font-bold text-slate-200 transition-colors hover:border-pink-600 hover:text-white"
                  >
                    {t("hero_cta", lang)}
                  </Link>
                </div>
              </div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-4">

          {loading && (
            <div className="text-center max-w-lg">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-pink-500/30 to-rose-500/30 blur-2xl rounded-full animate-pulse"></div>
                  <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-4 border-slate-700 border-t-pink-500 mx-auto"></div>
                  </div>
                </div>
              </div>
              {generationStep ? (
                <div className="space-y-3">
                  <p className="text-xl font-mono font-bold text-pink-400 animate-pulse">
                    {generationStep}
                  </p>
                  <p className="text-sm text-slate-500 font-mono">
                    {lang === "fr" ? "Cela peut prendre jusqu'à 60 secondes..." : "This may take up to 60 seconds..."}
                  </p>
                </div>
              ) : (
                <p className="text-slate-400 font-mono">{t("loading", lang)}</p>
              )}
            </div>
          )}

          {!loading && error === "no-ideas" && (
            <div className="text-center max-w-md px-4">
              <div className="mb-6">
                <span className="text-3xl font-mono text-pink-500">NEXT</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 font-mono mb-4">
                {lang === "fr" ? "Le duel arrive" : "The duel is almost ready"}
              </h2>
              <p className="text-slate-400 mb-6 font-mono text-sm">
                {lang === "fr" 
                  ? "Aucune idée active pour l'instant. Lancez une génération pour alimenter le prochain round." 
                  : "No active ideas yet. Generate a fresh batch to start the next round."}
              </p>
              <button
                onClick={handleGenerateIdeas}
                disabled={generating}
                className="bg-linear-to-r from-pink-500 to-rose-500 text-white font-mono font-bold py-3 px-6 rounded-lg hover:shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating 
                  ? (lang === "fr" ? "Génération en cours..." : "Generating...") 
                  : (lang === "fr" ? "Lancer une nouvelle vague" : "Generate fresh ideas")}
              </button>
            </div>
          )}

          {!loading && error === "no-more-duels" && (
            <div className="text-center max-w-md px-4">
              <div className="mb-6">
                <span className="text-3xl font-mono text-pink-500">DONE</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 font-mono mb-4">
                {lang === "fr" ? "Round terminé" : "Round completed"}
              </h2>
              <p className="text-slate-400 mb-6 font-mono text-sm">
                {lang === "fr" 
                  ? "Vous avez voté sur tous les duels disponibles. Consultez le classement ou revenez au prochain batch." 
                  : "You voted on every available matchup. Check the leaderboard or come back for the next batch."}
              </p>
              <div className="space-y-3">
                <a
                  href="/leaderboard"
                  className="block bg-pink-600 hover:bg-pink-700 text-white font-mono font-bold py-3 px-6 rounded-lg transition-all"
                >
                  {lang === "fr" ? "Voir le classement" : "Open leaderboard"}
                </a>
                <p className="text-xs text-slate-500 font-mono">
                  {lang === "fr" 
                    ? "De nouvelles idées sont publiées chaque jour" 
                    : "Fresh ideas are published daily"}
                </p>
              </div>
            </div>
          )}

          {!loading && !error && duel && (
          <>
            {/* Mobile Stack View */}
            <div className="md:hidden w-full">
              <MobileIdeaStack lang={lang} voterId={voterId} />
            </div>
            
            {/* Desktop Duel View - Side by Side */}
            <div className={`hidden md:grid grid-cols-2 gap-4 sm:gap-6 lg:gap-12 w-full max-w-6xl px-12 pt-24 pb-12 relative overflow-hidden`}>
            {/* VS Badge */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-linear-to-r from-pink-500 to-rose-500 rounded-full w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center shadow-2xl border-4 border-slate-900">
                <span className="text-white font-mono font-black text-xl lg:text-2xl">VS</span>
              </div>
            </div>
            
            {/* IDEA A - Vote */}
            <div className="relative">
              {isEntering && selectedCard !== "A" && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 -rotate-12">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 font-black text-4xl tracking-wider drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]" style={{ fontFamily: 'var(--font-clicker)' }}>
                    {t("winner", lang)}
                  </span>
                </div>
              )}
            <Card className={`bg-slate-900 border-slate-800 shadow-xl transition-all duration-300 will-change-transform ${
              isExiting ? "animate-slide-out-left" : isEntering ? "animate-slide-in-left" : ""
            } ${
              !isExiting && selectedCard === "A" ? "border-pink-500 shadow-pink-500/30 scale-105" : "border-slate-800"
            } ${
              !isExiting && selectedCard !== "A" ? "hover:border-pink-600" : ""
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl sm:text-2xl font-mono text-slate-100">
                  {getIdeaText(duel.ideaA).title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm font-mono text-slate-300 mt-2">
                  &quot;{getIdeaText(duel.ideaA).slogan}&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6 text-xs sm:text-sm leading-relaxed">{getIdeaText(duel.ideaA).description}</p>
                {getIdeaText(duel.ideaA).aiPrompt && (
                  <p className="text-slate-400 mb-6 text-xs italic border-l-2 border-pink-500 pl-3 bg-slate-800/50 py-2 px-3 rounded">
                    &quot;{getIdeaText(duel.ideaA).aiPrompt}&quot;
                  </p>
                )}
                <button
                  onClick={() => handleVoteClick(duel.ideaA.id, duel.ideaB.id, "A")}
                  disabled={voting || loserCard !== null}
                  className={`w-full text-lg py-4 font-mono font-bold flex items-center justify-center gap-3 rounded-full transition-all duration-300 ${
                    selectedCard === "A"
                      ? "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/50"
                      : loserCard === "A"
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg hover:shadow-pink-500/50"
                  }`}
                >
                  {loserCard === "A" ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <ThumbsUp className="w-5 h-5" />
                  )}
                  {loserCard === "A" ? "DEFEATED" : "VOTE"}
                </button>
              </CardContent>
            </Card>
            </div>

            {/* IDEA B - Vote */}
            <div className="relative">
              {isEntering && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 rotate-12">
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-400 via-yellow-300 to-yellow-500 font-black text-4xl tracking-wider drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]" style={{ fontFamily: 'var(--font-clicker)' }}>
                    {t("challenger", lang)}
                  </span>
                </div>
              )}
            <Card className={`bg-slate-900 border-slate-800 shadow-xl transition-all duration-300 will-change-transform ${
              isExiting ? "animate-slide-out-right" : isEntering ? "animate-slide-in-right" : ""
            } ${
              !isExiting && selectedCard === "B" ? "border-pink-500 shadow-pink-500/30 scale-105" : "border-slate-800"
            } ${
              !isExiting && selectedCard !== "B" ? "hover:border-pink-600" : ""
            }`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl sm:text-2xl font-mono text-slate-100">
                  {getIdeaText(duel.ideaB).title}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm font-mono text-slate-300 mt-2">
                  &quot;{getIdeaText(duel.ideaB).slogan}&quot;
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 mb-6 text-xs sm:text-sm leading-relaxed">{getIdeaText(duel.ideaB).description}</p>
                {getIdeaText(duel.ideaB).aiPrompt && (
                  <p className="text-slate-400 mb-6 text-xs italic border-l-2 border-pink-500 pl-3 bg-slate-800/50 py-2 px-3 rounded">
                    &quot;{getIdeaText(duel.ideaB).aiPrompt}&quot;
                  </p>
                )}
                <button
                  onClick={() => handleVoteClick(duel.ideaB.id, duel.ideaA.id, "B")}
                  disabled={voting || loserCard !== null}
                  className={`w-full text-lg py-4 font-mono font-bold flex items-center justify-center gap-3 rounded-full transition-all duration-300 ${
                    selectedCard === "B"
                      ? "bg-pink-600 hover:bg-pink-700 text-white shadow-lg shadow-pink-500/50"
                      : loserCard === "B"
                      ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg hover:shadow-pink-500/50"
                  }`}
                >
                  {loserCard === "B" ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <ThumbsUp className="w-5 h-5" />
                  )}
                  {loserCard === "B" ? "DEFEATED" : "VOTE"}
                </button>
              </CardContent>
            </Card>
            </div>
            </div>
          </>
          )}

            </div>
          </div>

          {/* Right Ad Spot - Hidden on mobile/tablet */}
          <div className="hidden lg:block shrink-0 pt-24">
            <div className="text-[10px] text-slate-500 font-mono mb-2 text-center">Sponsors :</div>
            <AdCard position="right" />
          </div>
        </div>

        {/* SEO Content - Hidden but crawlable */}
        <div className="sr-only" aria-hidden="true">
          {/* French SEO */}
          <h1>NextUnicorn - Idées de SaaS et Business pour Entrepreneurs</h1>
          <h2>Trouvez votre prochaine idée de startup profitable</h2>
          <p>
            NextUnicorn est la plateforme gratuite qui vous aide à trouver des idées de business innovantes. 
            Que vous cherchiez des idées de SaaS pour développeurs, des idées de micro-SaaS, 
            des idées de projets side-project, ou des idées d'entreprise à monter, notre repository 
            d'idées générées par IA vous offre une source inépuisable d'inspiration.
          </p>
          <p>
            Pour les entrepreneurs, développeurs, indie hackers et créateurs : découvrez quotidiennement 
            de nouvelles idées de startups, idées de business en ligne, idées de SaaS B2B, idées pour 
            bootstrapper votre entreprise. Votez pour vos idées préférées et trouvez l'inspiration 
            pour votre prochain projet rentable.
          </p>
          <p>
            Idées de business 2025, idées de SaaS rentables, idées pour développeurs, idées de micro-entreprise, 
            idées de projets tech, idées d'applications web, idées de startups innovantes, idées pour makers, 
            idées de side hustles, idées de business models SaaS.
          </p>

          {/* English SEO */}
          <h1>NextUnicorn - SaaS Ideas and Business Ideas for Entrepreneurs</h1>
          <h2>Find your next unicorn startup idea - Vote on the next unicorn app</h2>
          <p>
            NextUnicorn is the free platform that helps you discover your next unicorn startup idea. 
            Whether you&apos;re looking for the next unicorn app, SaaS ideas for developers, micro-SaaS ideas, 
            side project ideas, or business ideas to launch, our repository of 
            AI-generated ideas offers you an endless source of inspiration to find the next unicorn.
          </p>
          <p>
            For entrepreneurs, developers, indie hackers and makers: discover daily 
            new startup ideas, online business ideas, B2B SaaS ideas, ideas to 
            bootstrap your company. Vote for your favorite ideas and find inspiration 
            for your next profitable project.
          </p>
          <p>
            Business ideas 2025, profitable SaaS ideas, ideas for developers, micro-business ideas, 
            tech project ideas, web application ideas, innovative startup ideas, maker ideas, 
            side hustle ideas, SaaS business model ideas.
          </p>

          {/* German SEO */}
          <h1>NextUnicorn - SaaS-Ideen und Geschäftsideen für Unternehmer</h1>
          <h2>Finden Sie Ihre nächste profitable Startup-Idee</h2>
          <p>
            NextUnicorn ist die kostenlose Plattform, die Ihnen hilft, innovative Geschäftsideen zu finden. 
            Ob Sie nach SaaS-Ideen für Entwickler, Micro-SaaS-Ideen, 
            Nebenprojekt-Ideen oder Geschäftsideen zum Starten suchen, unser Repository von 
            KI-generierten Ideen bietet Ihnen eine unerschöpfliche Inspirationsquelle.
          </p>
          <p>
            Für Unternehmer, Entwickler, Indie-Hacker und Macher: entdecken Sie täglich 
            neue Startup-Ideen, Online-Geschäftsideen, B2B-SaaS-Ideen, Ideen zum 
            Bootstrappen Ihres Unternehmens. Stimmen Sie für Ihre Lieblingsideen ab und finden Sie Inspiration 
            für Ihr nächstes profitables Projekt.
          </p>
          <p>
            Geschäftsideen 2025, profitable SaaS-Ideen, Ideen für Entwickler, Micro-Business-Ideen, 
            Tech-Projekt-Ideen, Webanwendungsideen, innovative Startup-Ideen, Maker-Ideen, 
            Nebenverdienst-Ideen, SaaS-Geschäftsmodell-Ideen.
          </p>

          {/* Spanish SEO */}
          <h1>NextUnicorn - Ideas de SaaS e Ideas de Negocio para Emprendedores</h1>
          <h2>Encuentra tu próxima idea de startup rentable</h2>
          <p>
            NextUnicorn es la plataforma gratuita que te ayuda a encontrar ideas de negocio innovadoras. 
            Ya sea que busques ideas de SaaS para desarrolladores, ideas de micro-SaaS, 
            ideas de proyectos paralelos o ideas de negocio para lanzar, nuestro repositorio de 
            ideas generadas por IA te ofrece una fuente inagotable de inspiración.
          </p>
          <p>
            Para emprendedores, desarrolladores, indie hackers y creadores: descubre diariamente 
            nuevas ideas de startups, ideas de negocios online, ideas de SaaS B2B, ideas para 
            bootstrappear tu empresa. Vota por tus ideas favoritas y encuentra inspiración 
            para tu próximo proyecto rentable.
          </p>
          <p>
            Ideas de negocio 2025, ideas de SaaS rentables, ideas para desarrolladores, ideas de micro-empresas, 
            ideas de proyectos tech, ideas de aplicaciones web, ideas de startups innovadoras, ideas para makers, 
            ideas de side hustles, ideas de modelos de negocio SaaS.
          </p>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 flex flex-wrap items-center justify-center gap-4 px-4 py-3 text-center text-slate-500 font-mono text-xs border-t border-slate-700 bg-slate-950 z-50">
          <Link href="/advertise" className="hover:text-pink-600 transition-colors">{t("advertise", lang)}</Link>
          <span className="text-slate-600">•</span>
          <Link href="/about" className="hover:text-pink-600 transition-colors">About</Link>
          <span className="text-slate-600">•</span>
          <Link href="/contact" className="hover:text-pink-600 transition-colors">Contact</Link>
          <span className="text-slate-600">•</span>
          <Link href="/blog" className="hover:text-pink-600 transition-colors">Blog</Link>
          <span className="text-slate-600">•</span>
          <Link href="/cgu" className="hover:text-pink-600 transition-colors">CGU</Link>
          <span className="text-slate-600">•</span>
          <Link href="/confidentialite" className="hover:text-pink-600 transition-colors">Confidentialité</Link>
          <span className="text-slate-600">•</span>
          <Link href="/mentions" className="hover:text-pink-600 transition-colors">Mentions Légales</Link>
          <span className="text-slate-600">•</span>
          <a href="mailto:designmoiunmouton@gmail.com" className="hover:text-pink-600 transition-colors">designmoiunmouton@gmail.com</a>
          <span className="text-slate-600">•</span>
          <a 
            href="https://www.saashub.com/nextunicorn-app?utm_source=badge&utm_campaign=badge&utm_content=nextunicorn-app&badge_variant=color&badge_kind=approved" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://cdn-b.saashub.com/img/badges/approved-color.png?v=1" 
              alt="NextUnicorn App badge" 
              style={{ maxWidth: '150px' }}
              className="h-5"
            />
          </a>
          <span className="text-slate-600">•</span>
          <a 
            href="https://www.producthunt.com/products/nextunicorn?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-nextunicorn" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <img 
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1046541&theme=dark&t=1764944139684" 
              alt="NextUnicorn - Tinder for SaaS ideas - Vote & discover tomorrow's unicorns | Product Hunt" 
              style={{ width: '150px', height: '32px' }}
              width={150}
              height={32}
            />
          </a>
          <span className="text-slate-600">•</span>
          <a 
            href="https://dmum.eu" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-pink-600 transition-colors flex items-center gap-1"
          >
            <Image 
              src="/logo.png" 
              alt="dmum" 
              width={14} 
              height={14}
              className="w-3.5 h-3.5"
            />
            <span>dmum</span>
          </a>
        </div>
      </div>

      {showSubmitForm && (
        <SubmitIdeaForm lang={lang} onClose={() => setShowSubmitForm(false)} />
      )}
    </div>
  );
}
