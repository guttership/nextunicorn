"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";
import { Language, detectLanguage, t } from "@/app/lib/i18n";
import { LanguageSelector } from "@/app/components/language-selector";
import { ArrowLeft, Calendar, Clock } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  lang: Language;
}

const blogPosts: BlogPost[] = [
  {
    slug: "50-idees-saas-developpeurs-2025",
    title: "50 Idées de SaaS pour Développeurs en 2025",
    excerpt: "Une liste complète d'idées de micro-SaaS profitables que vous pouvez construire en solo ou en petit équipe. De l'automatisation au B2B, découvrez les niches rentables.",
    date: "2025-11-19",
    readTime: "8 min",
    lang: "fr"
  },
  {
    slug: "comment-trouver-idee-business-profitable",
    title: "Comment Trouver une Idée de Business Profitable en 2025",
    excerpt: "Méthode complète pour identifier, valider et lancer votre idée de startup. Évitez les erreurs classiques et concentrez-vous sur ce qui marche vraiment.",
    date: "2025-11-18",
    readTime: "10 min",
    lang: "fr"
  },
  {
    slug: "micro-saas-bootstrappers-guide",
    title: "Micro-SaaS pour Bootstrappers : Le Guide Complet",
    excerpt: "Comment lancer un micro-SaaS rentable sans lever de fonds. Stratégies, outils, pricing et marketing pour réussir en solo.",
    date: "2025-11-17",
    readTime: "12 min",
    lang: "fr"
  },
  {
    slug: "50-saas-ideas-developers-2025",
    title: "50 SaaS Ideas for Developers in 2025",
    excerpt: "A comprehensive list of profitable micro-SaaS ideas you can build solo or with a small team. From automation to B2B, discover profitable niches.",
    date: "2025-11-19",
    readTime: "8 min",
    lang: "en"
  },
  {
    slug: "how-to-find-profitable-business-idea",
    title: "How to Find a Profitable Business Idea in 2025",
    excerpt: "Complete method to identify, validate and launch your startup idea. Avoid common mistakes and focus on what really works.",
    date: "2025-11-18",
    readTime: "10 min",
    lang: "en"
  }
];

export default function BlogPage() {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  const filteredPosts = blogPosts.filter(post => post.lang === lang);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors font-mono text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>{lang === "fr" ? "Retour" : lang === "de" ? "Zurück" : lang === "es" ? "Volver" : "Back"}</span>
          </Link>
          <LanguageSelector lang={lang} setLang={setLang} />
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-5xl mx-auto px-4 py-12 pb-24">
        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
            {lang === "fr" ? "Blog NextUnicorn" : "NextUnicorn Blog"}
          </h1>
          <p className="text-slate-400 font-mono text-sm md:text-base max-w-2xl mx-auto">
            {lang === "fr" 
              ? "Guides, idées et stratégies pour entrepreneurs et développeurs"
              : lang === "de"
              ? "Anleitungen, Ideen und Strategien für Unternehmer und Entwickler"
              : lang === "es"
              ? "Guías, ideas y estrategias para emprendedores y desarrolladores"
              : "Guides, ideas and strategies for entrepreneurs and developers"
            }
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="bg-slate-900/50 border-slate-800 hover:border-pink-500/50 transition-all h-full cursor-pointer group">
                <CardHeader>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(post.date).toLocaleDateString(lang === "fr" ? "fr-FR" : lang === "de" ? "de-DE" : lang === "es" ? "es-ES" : "en-US")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl text-slate-100 group-hover:text-pink-400 transition-colors" style={{ fontFamily: 'var(--font-clicker)' }}>
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-400">
                    {post.excerpt}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* SEO Content */}
        <div className="mt-16 prose prose-invert max-w-none">
          <div className="text-slate-500 text-sm space-y-4">
            <p>
              {lang === "fr" ? (
                <>Le blog NextUnicorn vous accompagne dans votre parcours entrepreneurial avec des guides pratiques, des listes d'idées validées et des stratégies éprouvées pour réussir votre projet SaaS ou startup tech.</>
              ) : (
                <>The NextUnicorn blog guides you through your entrepreneurial journey with practical guides, validated idea lists and proven strategies to succeed with your SaaS or tech startup project.</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
