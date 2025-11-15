"use client";

import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Language, detectLanguage, t } from "@/app/lib/i18n";

interface Advertiser {
  id: number;
  saasName: string;
  logoUrl: string;
  targetUrl: string;
}

interface CardData {
  recto: Advertiser | null;
  verso: Advertiser | null;
}

export default function AdCard({ position }: { position: "left" | "right" | "grid" }) {
  const [lang, setLang] = useState<Language>("en");
  const [cards, setCards] = useState<CardData[]>([]);

  useEffect(() => {
    setLang(detectLanguage());
    const posParam = position === "grid" ? "left" : position;
    fetch(`/api/ads/active?position=${posParam}`)
      .then((res) => res.json())
      .then((data) => setCards(data.cards || []));
  }, [position]);

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(detectLanguage());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languagechange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languagechange", handleStorageChange);
    };
  }, []);

  // Check if we have any cards at all
  const hasAnyContent = cards.length > 0;

  if (!hasAnyContent) {
    // Only show empty slot on LEFT position when there's no content
    if (position !== "left") {
      return null;
    }
    
    return (
      <div className="flex flex-col gap-4">
        <Card className="w-32 h-40 bg-slate-800/20 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center hover:border-pink-500 hover:bg-slate-800/40 transition-all cursor-pointer">
          <a
            href="/advertise"
            className="text-xs text-slate-500 hover:text-pink-400 text-center p-4 flex flex-col items-center justify-center gap-2 w-full h-full"
          >
            <div className="text-2xl">+</div>
            <span>{t("yourAdHere", lang)}</span>
          </a>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {cards.map((card, idx) => (
        <SingleCard key={idx} cardData={card} />
      ))}
    </div>
  );
}

function SingleCard({ cardData }: { cardData: CardData }) {
  const [flipped, setFlipped] = useState(false);
  const { recto, verso } = cardData;
  const [lang, setLang] = useState<Language>("en");

  // Always show flip animation, even if verso is null (empty back)
  useEffect(() => {
    setLang(detectLanguage());
    let interval: NodeJS.Timeout;
    const delay = Math.random() * 2000;
    
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setFlipped((prev) => !prev);
      }, 5000);
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setLang(detectLanguage());
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("languagechange", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("languagechange", handleStorageChange);
    };
  }, []);

  if (!recto && !verso) {
    // Completely empty card
    return (
      <Card className="w-32 h-40 bg-slate-800/20 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center hover:border-pink-500 hover:bg-slate-800/40 transition-all cursor-pointer">
        <a
          href="/advertise"
          className="text-xs text-slate-500 hover:text-pink-400 text-center p-4 flex flex-col items-center justify-center gap-2 w-full h-full"
        >
          <div className="text-2xl">+</div>
          <span>{t("yourAdHere", lang)}</span>
        </a>
      </Card>
    );
  }

  // Card with recto and verso (verso can be null = empty back)
  return (
    <div className="w-32 h-40" style={{ perspective: "1000px" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.7s ease-in-out",
        }}
      >
        {/* Front (Recto) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
          }}
        >
          {recto ? (
            <a
              href={recto.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Card className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-pink-500 transition-all p-4 flex flex-col items-center justify-center gap-3">
                {recto.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={recto.logoUrl}
                    alt={recto.saasName}
                    style={{
                      width: "auto",
                      objectFit: "contain"
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-2xl">🚀</span>
                )}
                <p className="text-xs text-slate-200 font-mono text-center font-bold">
                  {recto.saasName}
                </p>
              </Card>
            </a>
          ) : (
            <a href="/advertise" className="block w-full h-full">
              <Card className="w-full h-full bg-slate-800/20 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center hover:border-pink-500 hover:bg-slate-800/30 transition-all cursor-pointer">
                <div className="text-2xl mb-2">+</div>
                <span className="text-slate-500 text-xs font-mono text-center">{t("yourAdHere", lang)}</span>
              </Card>
            </a>
          )}
        </div>

        {/* Back (Verso) */}
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {verso ? (
            <a
              href={verso.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <Card className="w-full h-full bg-linear-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-pink-500 transition-all p-4 flex flex-col items-center justify-center gap-3">
                {verso.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={verso.logoUrl}
                    alt={verso.saasName}
                    style={{
                      width: "auto",
                      objectFit: "contain"
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-2xl">🚀</span>
                )}
                <p className="text-xs text-slate-200 font-mono text-center font-bold">
                  {verso.saasName}
                </p>
              </Card>
            </a>
          ) : recto ? (
            <a href="/advertise" className="block w-full h-full">
              <Card className="w-full h-full bg-slate-800/30 border-2 border-dashed border-slate-600 flex flex-col items-center justify-center p-4 hover:border-pink-500 hover:bg-slate-800/40 transition-all cursor-pointer">
                <div className="text-2xl mb-2">+</div>
                <span className="text-slate-400 text-xs font-mono text-center">{t("yourAdHere", lang)}</span>
              </Card>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
