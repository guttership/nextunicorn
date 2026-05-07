"use client";

import { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { X, ThumbsUp } from "lucide-react";
import { Language, t } from "@/app/lib/i18n";

interface Idea {
  id: number;
  title: string;
  slogan: string;
  description: string;
  aiPrompt?: string;
}

interface SwipeDuelMobileProps {
  ideaA: Idea;
  ideaB: Idea;
  loserCard: "A" | "B" | null;
  selectedCard: "A" | "B" | null;
  voting: boolean;
  isEntering: boolean;
  isExiting: boolean;
  lang: Language;
  onVote: (choice: "A" | "B") => void;
}

export function SwipeDuelMobile({
  ideaA,
  loserCard,
  selectedCard,
  voting,
  isEntering,
  isExiting,
  lang,
  onVote,
}: SwipeDuelMobileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (voting || loserCard !== null) return;
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    setTranslateX(diff);

    // Determine swipe direction based on movement
    if (diff > 50) {
      setSwipeDirection("right");
    } else if (diff < -50) {
      setSwipeDirection("left");
    } else {
      setSwipeDirection(null);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Swipe right = Vote for A
    if (translateX > 100) {
      setTranslateX(0);
      setSwipeDirection(null);
      onVote("A");
    }
    // Swipe left = Vote for B
    else if (translateX < -100) {
      setTranslateX(0);
      setSwipeDirection(null);
      onVote("B");
    }
    // Not enough swipe = Reset
    else {
      setTranslateX(0);
      setSwipeDirection(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (voting || loserCard !== null) return;
    setStartX(e.clientX);
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handleWindowMouseMove = (event: MouseEvent) => {
      const diff = event.clientX - startX;
      setTranslateX(diff);

      if (diff > 50) {
        setSwipeDirection("right");
      } else if (diff < -50) {
        setSwipeDirection("left");
      } else {
        setSwipeDirection(null);
      }
    };

    const handleWindowMouseUp = () => {
      setIsDragging(false);

      if (translateX > 100) {
        setTranslateX(0);
        setSwipeDirection(null);
        onVote("A");
      } else if (translateX < -100) {
        setTranslateX(0);
        setSwipeDirection(null);
        onVote("B");
      } else {
        setTranslateX(0);
        setSwipeDirection(null);
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDragging, onVote, startX, translateX]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto px-4 md:hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      style={{ touchAction: "none" }}
    >
      {/* Swipe Hint */}
      {!selectedCard && !loserCard && (
        <div className="text-center mb-6 px-4">
          <p className="text-xs text-slate-400 font-mono mb-1">
            Swipe left/right or tap button
          </p>
          <p className="text-xs text-slate-600 font-mono">
            Drag to see the other idea
          </p>
        </div>
      )}

      {/* Stack Container - Shows current card on top */}
      <div
        className="relative h-96 sm:h-[500px]"
        style={{
          perspective: "1000px",
        }}
      >
        {/* Card - Always visible with swipe transform */}
        <div
          style={{
            transform: `translateX(${translateX}px) rotateZ(${Math.min(Math.max(translateX / 50, -15), 15)}deg)`,
            transition: isDragging ? "none" : "transform 0.3s ease-out",
            opacity: Math.max(0.7, 1 - Math.abs(translateX) / 500),
          }}
          className="absolute inset-0"
        >
          <Card
            className={`h-full bg-slate-900 border-slate-800 shadow-xl transition-all duration-300 flex flex-col ${
              isExiting ? "animate-slide-out-left" : isEntering ? "animate-slide-in-left" : ""
            } ${
              selectedCard === "A" ? "border-pink-500 shadow-pink-500/30" : "border-slate-800"
            }`}
          >
            <CardHeader className="pb-2 shrink-0">
              <CardTitle className="text-lg sm:text-xl font-mono text-slate-100">
                {ideaA.title}
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm font-mono text-slate-300 mt-2">
                &quot;{ideaA.slogan}&quot;
              </CardDescription>
            </CardHeader>
            <CardContent className="overflow-y-auto flex-1">
              <p className="text-slate-300 mb-4 text-xs sm:text-sm leading-relaxed">
                {ideaA.description}
              </p>
              {ideaA.aiPrompt && (
                <p className="text-slate-400 mb-4 text-xs italic border-l-2 border-pink-500 pl-3 bg-slate-800/50 py-2 px-3 rounded">
                  &quot;{ideaA.aiPrompt}&quot;
                </p>
              )}
            </CardContent>
            <div className="shrink-0 p-3 border-t border-slate-800">
              <button
                onClick={() => onVote("A")}
                disabled={voting || loserCard !== null}
                className={`w-full py-3 font-mono font-bold flex items-center justify-center gap-2 rounded-full transition-all duration-300 text-sm ${
                  selectedCard === "A"
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/50"
                    : loserCard === "A"
                    ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-700 text-white hover:shadow-lg hover:shadow-pink-500/50"
                }`}
              >
                {loserCard === "A" ? (
                  <X className="w-4 h-4" />
                ) : (
                  <ThumbsUp className="w-4 h-4" />
                )}
                {loserCard === "A" ? "DEFEATED" : "VOTE"}
              </button>
            </div>
          </Card>
        </div>

        {/* Swipe Indicators */}
        {swipeDirection && !loserCard && (
          <>
            {swipeDirection === "right" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-start p-6">
                <div className="text-pink-500 font-black text-6xl opacity-70 rotate-12 drop-shadow-lg" style={{ fontFamily: 'var(--font-clicker)' }}>
                  {t("swipeVote", lang)}
                </div>
              </div>
            )}
            {swipeDirection === "left" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-end p-6">
                <div className="text-slate-400 font-black text-6xl opacity-70 -rotate-12 drop-shadow-lg" style={{ fontFamily: 'var(--font-clicker)' }}>
                  {t("swipeNext", lang)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Current Idea Display (when swiping) */}
      {translateX !== 0 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400 font-mono">
            {swipeDirection === "right"
              ? "Vote for this idea"
              : swipeDirection === "left"
              ? "Vote for the other"
              : "Continue swiping"}
          </p>
        </div>
      )}
    </div>
  );
}
