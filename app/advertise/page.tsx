"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { Language, detectLanguage, t, formatPrice } from "@/app/lib/i18n";
import { LanguageSelector } from "@/app/components/language-selector";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PricingData {
  currentSpot: number;
  totalActiveSpots: number;
  pricing: {
    monthly: number;
    yearly: number;
    yearlySavings: number;
  };
  nextTier: {
    atSpot: number;
    monthly: number;
    yearly: number;
  } | null;
}

export default function AdvertisePage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return detectLanguage();
    }
    return "en";
  });
  const [selectedPlan, setSelectedPlan] = useState<"one-shot" | "monthly" | "yearly">("monthly");
  const [saasName, setSaasName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState<PricingData | null>(null);

  useEffect(() => {
    fetch("/api/ads/pricing")
      .then((res) => res.json())
      .then((data) => setPricing(data));
  }, []);

  if (!pricing) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-pink-500"></div>
      </div>
    );
  }

  const plans: {
    "one-shot": { 
      price: number;
      name: string;
      duration: string;
      spots: string;
      save?: string;
    };
    monthly: { 
      price: number;
      name: string;
      duration: string;
      spots: string;
      save?: string;
    };
    yearly: { 
      price: number;
      name: string;
      duration: string;
      spots: string;
      save?: string;
    };
  } = {
    "one-shot": { 
      price: pricing.pricing.monthly, 
      name: lang === "fr" ? "Paiement unique" : lang === "de" ? "Einmalzahlung" : lang === "es" ? "Pago único" : "One-Time", 
      duration: "30 " + t("days", lang), 
      spots: t("rotatingSpot", lang) 
    },
    monthly: { 
      price: pricing.pricing.monthly, 
      name: t("monthlySpot", lang) + " (Subscription)", 
      duration: t("durationMonth", lang), 
      spots: t("rotatingSpot", lang) 
    },
    yearly: { 
      price: pricing.pricing.yearly, 
      name: t("yearlySpot", lang) + " (Subscription)", 
      duration: t("durationYear", lang), 
      spots: t("rotatingSpot", lang), 
      save: `${t("save", lang)} ${formatPrice(pricing.pricing.yearlySavings, lang)}!` 
    },
  };

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/ads/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: selectedPlan,
          logoUrl,
          saasName,
          targetUrl,
          email,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Checkout error:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div className="flex-1 w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-pink-500 mb-2 sm:mb-4 leading-tight" style={{ fontFamily: 'var(--font-clicker)' }}>
              {t("advertiseTitle", lang)}
            </h1>
            <p className="text-slate-300 font-mono text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
              {t("advertiseSubtitle", lang)}
            </p>
          </div>
          <div className="shrink-0">
            <LanguageSelector currentLang={lang} onChange={setLang} />
          </div>
        </div>
        
        {/* Dynamic Pricing Alert */}
        <div className="bg-slate-900/50 border border-pink-500/30 rounded-lg p-3 sm:p-4 md:p-6 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto">
          <p className="text-center font-mono text-xs sm:text-sm md:text-base text-slate-200 space-y-1 sm:space-y-0">
            <span className="block sm:inline text-pink-400 font-bold">{t("currentSpot", lang)} #{pricing.currentSpot}</span>
            <span className="hidden sm:inline text-slate-400"> • </span>
            <span className="block sm:inline text-slate-400">{pricing.totalActiveSpots} {pricing.totalActiveSpots === 1 ? t("activeAdv", lang) : t("activeAdvPlural", lang)}</span>
            {pricing.nextTier && (
              <>
                <span className="hidden sm:inline text-slate-400"> • </span>
                <span className="block sm:inline text-slate-500">
                  {t("priceIncreases", lang)} {formatPrice(pricing.nextTier.monthly, lang)}/mo {t("atSpot", lang)} #{pricing.nextTier.atSpot}
                </span>
              </>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10 md:mb-12 max-w-6xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => (
            <Card
              key={key}
              onClick={() => setSelectedPlan(key as "one-shot" | "monthly" | "yearly")}
              className={`cursor-pointer transition-all shadow-xl ${
                selectedPlan === key
                  ? "bg-slate-900 border-pink-500 border-2 shadow-pink-500/30"
                  : "bg-slate-900 border-slate-800 hover:border-pink-600 hover:shadow-pink-500/20"
              }`}
            >
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="font-mono text-pink-400 text-base sm:text-lg md:text-xl">{plan.name}</CardTitle>
                <CardDescription className="font-mono text-slate-300 text-sm sm:text-base md:text-lg font-bold">
                  {formatPrice(plan.price, lang)}/{plan.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm md:text-base font-mono text-slate-200">
                  <li>✓ {plan.spots}</li>
                  <li>✓ {t("rotatingCard", lang)}</li>
                  <li>✓ {t("clickTracking", lang)}</li>
                  <li>✓ {plan.duration} {t("visibility", lang)}</li>
                  {plan.save && (
                    <li className="text-pink-400 font-bold">★ {plan.save}</li>
                  )}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-slate-900 border-slate-800 shadow-xl mx-auto max-w-2xl">
          <CardHeader className="pb-2 sm:pb-3 md:pb-4">
            <CardTitle className="font-mono text-pink-400 text-lg sm:text-xl md:text-2xl">{t("completeListingTitle", lang)}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 md:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm md:text-base font-mono text-slate-300 mb-1 sm:mb-2 font-semibold">
                {t("saasName", lang)}
              </label>
              <input
                type="text"
                value={saasName}
                onChange={(e) => setSaasName(e.target.value)}
                placeholder={t("saasNamePlaceholder", lang)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm md:text-base focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm md:text-base font-mono text-slate-300 mb-1 sm:mb-2 font-semibold">
                {t("logoUrl", lang)}
              </label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder={t("logoUrlPlaceholder", lang)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm md:text-base focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm md:text-base font-mono text-slate-300 mb-1 sm:mb-2 font-semibold">
                {t("targetUrl", lang)}
              </label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder={t("targetUrlPlaceholder", lang)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm md:text-base focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm md:text-base font-mono text-slate-300 mb-1 sm:mb-2 font-semibold">
                {t("email", lang)}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder", lang)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded px-3 sm:px-4 py-2 sm:py-3 font-mono text-xs sm:text-sm md:text-base focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all placeholder:text-slate-500"
              />
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!saasName || !logoUrl || !targetUrl || !email || loading}
              className="w-full bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-mono font-bold py-3 sm:py-4 md:py-5 text-xs sm:text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-pink-500/50 mt-2 sm:mt-4"
            >
              {loading ? t("processing", lang) : `${t("payButton", lang)} ${formatPrice(plans[selectedPlan].price, lang)}`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
