"use client";

import { Language } from "@/app/lib/i18n";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface LanguageSelectorProps {
  currentLang: Language;
  onChange?: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onChange }: LanguageSelectorProps) {
  const pathname = usePathname();
  const router = useRouter();

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
    { code: "es", label: "ES" },
  ];

  // Map des articles multilingues
  const articleMap: Record<string, Record<Language, string>> = {
    "/blog/50-idees-saas-developpeurs-2025": {
      fr: "/blog/50-idees-saas-developpeurs-2025",
      en: "/blog/50-saas-ideas-developers-2025",
      de: "/blog/50-idees-saas-developpeurs-2025", // Pas encore traduit
      es: "/blog/50-idees-saas-developpeurs-2025", // Pas encore traduit
    },
    "/blog/50-saas-ideas-developers-2025": {
      fr: "/blog/50-idees-saas-developpeurs-2025",
      en: "/blog/50-saas-ideas-developers-2025",
      de: "/blog/50-saas-ideas-developers-2025",
      es: "/blog/50-saas-ideas-developers-2025",
    },
    "/blog/comment-trouver-idee-business-profitable": {
      fr: "/blog/comment-trouver-idee-business-profitable",
      en: "/blog/how-to-find-profitable-business-idea",
      de: "/blog/comment-trouver-idee-business-profitable",
      es: "/blog/comment-trouver-idee-business-profitable",
    },
    "/blog/how-to-find-profitable-business-idea": {
      fr: "/blog/comment-trouver-idee-business-profitable",
      en: "/blog/how-to-find-profitable-business-idea",
      de: "/blog/how-to-find-profitable-business-idea",
      es: "/blog/how-to-find-profitable-business-idea",
    },
    "/blog/micro-saas-bootstrappers-guide": {
      fr: "/blog/micro-saas-bootstrappers-guide",
      en: "/blog/micro-saas-bootstrappers-guide-en",
      de: "/blog/micro-saas-bootstrappers-guide-de",
      es: "/blog/micro-saas-bootstrappers-guide-es",
    },
    "/blog/micro-saas-bootstrappers-guide-en": {
      fr: "/blog/micro-saas-bootstrappers-guide",
      en: "/blog/micro-saas-bootstrappers-guide-en",
      de: "/blog/micro-saas-bootstrappers-guide-de",
      es: "/blog/micro-saas-bootstrappers-guide-es",
    },
    "/blog/micro-saas-bootstrappers-guide-de": {
      fr: "/blog/micro-saas-bootstrappers-guide",
      en: "/blog/micro-saas-bootstrappers-guide-en",
      de: "/blog/micro-saas-bootstrappers-guide-de",
      es: "/blog/micro-saas-bootstrappers-guide-es",
    },
    "/blog/micro-saas-bootstrappers-guide-es": {
      fr: "/blog/micro-saas-bootstrappers-guide",
      en: "/blog/micro-saas-bootstrappers-guide-en",
      de: "/blog/micro-saas-bootstrappers-guide-de",
      es: "/blog/micro-saas-bootstrappers-guide-es",
    },
  };

  const handleLanguageChange = (lang: Language) => {
    // Si on est sur un article avec versions multilingues
    if (articleMap[pathname]) {
      const newPath = articleMap[pathname][lang];
      router.push(newPath);
    } else if (onChange) {
      // Sinon, utiliser le callback traditionnel (pour les articles avec traductions inline)
      onChange(lang);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Globe className="w-4 h-4 text-slate-400" />
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded px-2 sm:px-3 py-1 sm:py-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2 sm:px-3 py-1 rounded transition-all font-mono text-xs sm:text-sm font-bold ${
              currentLang === lang.code
                ? "bg-linear-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                : "bg-transparent text-slate-400 hover:text-pink-400 hover:bg-slate-800/50"
            }`}
            title={lang.label}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
