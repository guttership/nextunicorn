"use client";

import { Language } from "@/app/lib/i18n";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  currentLang: Language;
  onChange: (lang: Language) => void;
}

export function LanguageSelector({ currentLang, onChange }: LanguageSelectorProps) {
  const languages: { code: Language; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
    { code: "es", label: "ES" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Globe className="w-4 h-4 text-slate-400" />
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded px-2 sm:px-3 py-1 sm:py-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
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
