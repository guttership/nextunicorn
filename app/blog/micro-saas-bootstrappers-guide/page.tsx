"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { Language, detectLanguage } from "@/app/lib/i18n";
import { LanguageSelector } from "@/app/components/language-selector";
import { ArrowLeft, Calendar, Clock, TrendingUp, Users, DollarSign, Zap } from "lucide-react";

export default function BlogPostMicroSaaS() {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    setLang(detectLanguage());
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-slate-400 hover:text-pink-500 transition-colors font-mono text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>Blog</span>
          </Link>
          <LanguageSelector currentLang={lang} onChange={setLang} />
        </div>
      </div>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-4 py-12 pb-24">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-6">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            17 novembre 2025
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            12 min
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
          Micro-SaaS pour Bootstrappers : Le Guide Complet
        </h1>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          Comment lancer un micro-SaaS rentable sans lever de fonds, sans équipe, et sans sacrifier 
          votre santé mentale. Le playbook complet pour passer de 0 à 5k€ MRR en solo.
        </p>

        {/* Content */}
        <div className="prose prose-invert prose-pink max-w-none">
          <h2 className="text-2xl font-bold text-slate-200 mt-8 mb-4">🎯 Qu'est-ce qu'un Micro-SaaS ?</h2>
          
          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p>
                  Un <strong className="text-pink-400">micro-SaaS</strong> est un logiciel en ligne qui :
                </p>
                <ul className="space-y-2 ml-4">
                  <li>✓ Résout UN problème spécifique très bien</li>
                  <li>✓ Peut être construit et maintenu par 1 personne</li>
                  <li>✓ Génère 1k-20k€ de revenus récurrents mensuels (MRR)</li>
                  <li>✓ Ne nécessite pas de levée de fonds</li>
                  <li>✓ S'adresse à une niche précise</li>
                </ul>
                <div className="mt-4 p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded">
                  <p className="font-bold text-pink-300 mb-2">Exemples concrets :</p>
                  <ul className="space-y-1 text-sm">
                    <li>• Un outil de backup automatique pour bases PostgreSQL → 8k€ MRR</li>
                    <li>• Un générateur de screenshots API pour devs → 5k€ MRR</li>
                    <li>• Un service d'analytics RGPD-compliant → 12k€ MRR</li>
                    <li>• Un planificateur de threads Twitter → 3k€ MRR</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">💡 Comment trouver LA bonne idée</h2>

          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-pink-400 mb-3">Règle #1 : Résolvez VOTRE problème</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <p>
                    Les meilleurs micro-SaaS naissent de frustrations personnelles. Pourquoi ?
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>→ Vous comprenez le problème mieux que personne</li>
                    <li>→ Vous êtes votre propre beta-testeur</li>
                    <li>→ Vous connaissez déjà d'autres personnes avec ce problème</li>
                    <li>→ Vous savez exactement quelle solution vous satisferait</li>
                  </ul>
                  <div className="mt-4 p-4 bg-slate-800/50 rounded">
                    <p className="font-bold text-slate-200 mb-2">Exercice pratique :</p>
                    <p>Listez tous les outils/scripts que vous avez créés pour vous-même ces 12 derniers mois. 
                    L'un d'eux pourrait être votre prochain micro-SaaS.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-pink-400 mb-3">Règle #2 : Niche &gt; Large marché</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-red-900/20 border border-red-800/50 rounded">
                      <p className="font-bold text-red-400 mb-2">❌ Trop large :</p>
                      <ul className="space-y-1">
                        <li>"Un outil de gestion de projet"</li>
                        <li>"Un CRM pour tous"</li>
                        <li>"Analytics universel"</li>
                      </ul>
                      <p className="text-xs text-slate-400 mt-2">→ Concurrence de géants, impossible à marketer seul</p>
                    </div>
                    <div className="p-4 bg-green-900/20 border border-green-800/50 rounded">
                      <p className="font-bold text-green-400 mb-2">✅ Parfait (niche) :</p>
                      <ul className="space-y-1">
                        <li>"Gestion de projet pour dentistes"</li>
                        <li>"CRM pour coachs Notion"</li>
                        <li>"Analytics pour newsletters Substack"</li>
                      </ul>
                      <p className="text-xs text-slate-400 mt-2">→ Ciblé, facile à trouver, 0 concurrence</p>
                    </div>
                  </div>
                  <p className="text-pink-400 mt-4">
                    <strong>Formule magique :</strong> [Outil générique] pour [Niche ultra-précise]
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-pink-400 mb-3">Règle #3 : B2B &gt; B2C (toujours)</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <p>Pour un bootstrapper solo, le B2B est 10x plus rentable :</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs mt-4">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2"></th>
                          <th className="text-left p-2 text-red-400">B2C</th>
                          <th className="text-left p-2 text-green-400">B2B</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-slate-800">
                          <td className="p-2 font-bold">Prix moyen</td>
                          <td className="p-2">5-10€/mois</td>
                          <td className="p-2">50-500€/mois</td>
                        </tr>
                        <tr className="border-b border-slate-800">
                          <td className="p-2 font-bold">Churn</td>
                          <td className="p-2">15-30%/mois</td>
                          <td className="p-2">3-8%/mois</td>
                        </tr>
                        <tr className="border-b border-slate-800">
                          <td className="p-2 font-bold">Support</td>
                          <td className="p-2">Intense + émotionnel</td>
                          <td className="p-2">Professionnel + rationnel</td>
                        </tr>
                        <tr className="border-b border-slate-800">
                          <td className="p-2 font-bold">Décision d'achat</td>
                          <td className="p-2">Impulsive</td>
                          <td className="p-2">Rationnelle (ROI clair)</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold">Pour 5k€ MRR</td>
                          <td className="p-2">500-1000 clients</td>
                          <td className="p-2">10-100 clients</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-pink-400 mt-4">
                    10 clients B2B à 500€/mois = 5k€ MRR. Gérable en solo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">🛠️ Stack technique minimaliste</h2>

          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <p className="text-slate-300 mb-4">
                En solo, votre stack doit être <strong className="text-pink-400">boring mais fiable</strong>. 
                Pas le moment d'expérimenter avec des technos hype.
              </p>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-slate-800/50 rounded">
                  <p className="font-bold text-pink-400 mb-2">Stack recommandée (2025) :</p>
                  <ul className="space-y-2 text-slate-300">
                    <li><strong>Frontend :</strong> Next.js 14+ (App Router) + Tailwind CSS + shadcn/ui</li>
                    <li><strong>Backend :</strong> Next.js API Routes (ou Serverless Functions)</li>
                    <li><strong>Base de données :</strong> PostgreSQL (Neon/Supabase) + Prisma ORM</li>
                    <li><strong>Auth :</strong> NextAuth.js (ou Clerk pour pas coder)</li>
                    <li><strong>Payments :</strong> Stripe (unique choix sérieux)</li>
                    <li><strong>Hosting :</strong> Vercel (deploy en 1 clic)</li>
                    <li><strong>Email :</strong> Resend (API simple)</li>
                    <li><strong>Monitoring :</strong> Sentry (erreurs) + Vercel Analytics</li>
                  </ul>
                  <p className="text-pink-400 mt-4">
                    Coût total : 0-50€/mois jusqu'à vos 100 premiers clients
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded">
                  <p className="font-bold text-pink-300 mb-2">⚠️ Évitez ces erreurs :</p>
                  <ul className="space-y-1 text-slate-300">
                    <li>❌ Micro-services (vous êtes SEUL, pas Netflix)</li>
                    <li>❌ GraphQL (REST suffit largement)</li>
                    <li>❌ Docker/Kubernetes (overkill total)</li>
                    <li>❌ Tests E2E complets (testez manuellement au début)</li>
                    <li>❌ Architecture "scale to millions" (vous avez 0 users)</li>
                  </ul>
                  <p className="text-pink-400 mt-3 text-xs">
                    Règle : Si ça prend plus de 2h à setup, c'est trop complexe pour un MVP
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">💰 Pricing & Monétisation</h2>

          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-pink-400 mb-3">Les 3 modèles qui marchent</h3>
                    <div className="space-y-4 text-sm">
                      <div className="p-4 bg-slate-800/50 rounded">
                        <p className="font-bold text-slate-200 mb-2">1. Simple tiers (le plus courant)</p>
                        <div className="space-y-1 text-slate-300">
                          <p>• Starter : 29€/mois (limits basiques)</p>
                          <p>• Pro : 79€/mois (la plupart choisissent celui-ci)</p>
                          <p>• Business : 199€/mois (unlimited)</p>
                        </div>
                        <p className="text-pink-400 mt-2 text-xs">→ Objectif : 70% des clients sur Pro</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <p className="font-bold text-slate-200 mb-2">2. Usage-based (pour APIs/outils)</p>
                        <div className="space-y-1 text-slate-300">
                          <p>• Gratuit : 100 requêtes/mois</p>
                          <p>• 49€ : 10k requêtes/mois</p>
                          <p>• 149€ : 100k requêtes/mois</p>
                          <p>• 499€ : 1M requêtes/mois</p>
                        </div>
                        <p className="text-pink-400 mt-2 text-xs">→ Facile à comprendre, scale automatique</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <p className="font-bold text-slate-200 mb-2">3. Flat rate (ultra-simple)</p>
                        <div className="space-y-1 text-slate-300">
                          <p>• UN SEUL prix : 79€/mois, unlimited tout</p>
                          <p>• Pas de tiers, pas de confusion</p>
                        </div>
                        <p className="text-pink-400 mt-2 text-xs">→ Conversion max, support minimal</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold text-pink-400 mb-3">Règles de pricing en or</h3>
                <div className="space-y-3 text-slate-300 text-sm">
                  <div className="p-3 bg-slate-800/50 rounded">
                    <p className="font-bold text-pink-300">→ Commencez à 2-3x ce que vous pensez</p>
                    <p className="text-xs mt-1">Si vous hésitez entre 30€ et 50€, mettez 50€. Vous pourrez toujours baisser.</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded">
                    <p className="font-bold text-pink-300">→ Prix basé sur la VALEUR créée, pas le coût</p>
                    <p className="text-xs mt-1">Votre tool économise 10h/mois ? Valeur = 500-1000€/mois minimum.</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded">
                    <p className="font-bold text-pink-300">→ Annuel = Mensuel x10 (pas x12)</p>
                    <p className="text-xs mt-1">79€/mois ou 790€/an (2 mois gratuits). Cash flow immédiat + moins de churn.</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded">
                    <p className="font-bold text-pink-300">→ Pas de plan gratuit (sauf freemium calculé)</p>
                    <p className="text-xs mt-1">Gratuit = support infini + 0 revenus. Trial 14 jours &gt; Free tier.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">📈 Distribution : Comment trouver vos premiers clients</h2>

          <Card className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-pink-800/50 mb-6">
            <CardContent className="pt-6">
              <p className="font-bold text-pink-300 mb-4">
                La vérité qui fait mal : Votre produit ne se vendra PAS tout seul.
              </p>
              <p className="text-slate-300 text-sm">
                Distribution &gt; Product. Toujours. Un produit médiocre avec une bonne distribution bat 
                un produit génial sans distribution. 100% du temps.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Users className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-pink-400 mb-3">Clients 1-10 : Hustle manuel</h3>
                    <div className="space-y-3 text-sm text-slate-300">
                      <p className="font-bold text-slate-200">Semaines 1-4 post-launch :</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Reddit</strong> : Trouvez 5 subreddits de votre niche, postez votre solution (avec valeur, pas de spam)</li>
                        <li>• <strong>LinkedIn</strong> : Contactez 50 personnes en DM qui ont votre problème</li>
                        <li>• <strong>Cold email</strong> : 20 emails/jour ciblés (personnalisés, pas de blast)</li>
                        <li>• <strong>Forums/Slack</strong> : Rejoignez des communautés, aidez genuinement, mentionnez votre tool</li>
                        <li>• <strong>Product Hunt</strong> : Launch day 1, mais n'attendez pas tout de PH</li>
                      </ul>
                      <div className="p-4 bg-slate-800/50 rounded mt-4">
                        <p className="font-bold text-pink-300 mb-2">Template cold email qui marche :</p>
                        <div className="text-xs text-slate-400 space-y-2 font-mono">
                          <p>Sujet: [Problème] en 2 minutes au lieu de 2 heures</p>
                          <p className="mt-2">Salut [Prénom],</p>
                          <p>J'ai vu que tu [contexte spécifique lié au problème].</p>
                          <p>J'ai construit [Tool] qui fait [résultat] en [temps/facilité].</p>
                          <p>[Lien vers demo 30 sec]</p>
                          <p>Intéressé pour tester gratuitement 14 jours ?</p>
                          <p className="mt-2">- [Ton prénom]</p>
                        </div>
                        <p className="text-pink-400 mt-3 text-xs">Taux de réponse : 15-25% si bien ciblé</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-pink-400 mb-3">Clients 10-100 : Canaux scalables</h3>
                    <div className="space-y-3 text-sm text-slate-300">
                      <p className="font-bold text-slate-200">Mois 2-6 :</p>
                      <div className="space-y-4">
                        <div className="p-4 bg-slate-800/50 rounded">
                          <p className="font-bold text-slate-200 mb-2">SEO de contenu (long-terme)</p>
                          <ul className="space-y-1 ml-4 text-xs">
                            <li>• 1 article/semaine ciblant [problème] + alternatives à concurrents</li>
                            <li>• Ex: "10 alternatives à [Concurrent] en 2025"</li>
                            <li>• Résultats après 3-6 mois, mais traffic gratuit ensuite</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded">
                          <p className="font-bold text-slate-200 mb-2">Build in public (Twitter/LinkedIn)</p>
                          <ul className="space-y-1 ml-4 text-xs">
                            <li>• Partagez vos metrics chaque semaine (MRR, clients, learnings)</li>
                            <li>• Les gens aiment suivre un journey authentique</li>
                            <li>• 1-2 posts/jour, focus sur lessons learned</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded">
                          <p className="font-bold text-slate-200 mb-2">Intégrations & Partnerships</p>
                          <ul className="space-y-1 ml-4 text-xs">
                            <li>• Intégrez votre tool avec des plateformes populaires (Notion, Slack, etc.)</li>
                            <li>• Listez-vous sur leurs marketplaces</li>
                            <li>• Contactez des tools complémentaires pour co-marketing</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded">
                          <p className="font-bold text-slate-200 mb-2">Affiliés (si marge &gt; 50%)</p>
                          <ul className="space-y-1 ml-4 text-xs">
                            <li>• 20-30% de commission récurrente</li>
                            <li>• Contactez des influenceurs/créateurs de contenu de votre niche</li>
                            <li>• Utilisez Rewardful ou PartnerStack</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">⏱️ Timeline réaliste</h2>

          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-sm">
                <div className="p-4 border-l-4 border-pink-500 bg-slate-800/50">
                  <p className="font-bold text-slate-200 mb-2">Mois 0 : Validation</p>
                  <ul className="space-y-1 text-slate-300 text-xs ml-4">
                    <li>• Semaine 1-2 : Interviews (20 personnes)</li>
                    <li>• Semaine 3 : Landing page + pricing</li>
                    <li>• Semaine 4 : Pré-ventes (objectif : 3-5 personnes)</li>
                  </ul>
                  <p className="text-pink-400 mt-2 text-xs">→ Si &lt; 3 pré-ventes : pivot ou nouvelle idée</p>
                </div>

                <div className="p-4 border-l-4 border-pink-500 bg-slate-800/50">
                  <p className="font-bold text-slate-200 mb-2">Mois 1-2 : Build MVP</p>
                  <ul className="space-y-1 text-slate-300 text-xs ml-4">
                    <li>• 4-8 semaines de dev (feature principale uniquement)</li>
                    <li>• Launch aux pré-acheteurs en beta</li>
                    <li>• Itérations rapides basées sur feedback</li>
                  </ul>
                  <p className="text-pink-400 mt-2 text-xs">→ Objectif fin mois 2 : 5-10 clients payants</p>
                </div>

                <div className="p-4 border-l-4 border-pink-500 bg-slate-800/50">
                  <p className="font-bold text-slate-200 mb-2">Mois 3-6 : Traction</p>
                  <ul className="space-y-1 text-slate-300 text-xs ml-4">
                    <li>• Hustle distribution (Reddit, cold emails, content)</li>
                    <li>• Amélioration produit basée sur top 3 demandes</li>
                    <li>• Première tentative SEO + build in public</li>
                  </ul>
                  <p className="text-pink-400 mt-2 text-xs">→ Objectif fin mois 6 : 1-3k€ MRR (20-40 clients)</p>
                </div>

                <div className="p-4 border-l-4 border-pink-500 bg-slate-800/50">
                  <p className="font-bold text-slate-200 mb-2">Mois 7-12 : Scale</p>
                  <ul className="space-y-1 text-slate-300 text-xs ml-4">
                    <li>• Double down sur les canaux qui marchent</li>
                    <li>• Automatisation du support/onboarding</li>
                    <li>• Premières intégrations/partnerships</li>
                  </ul>
                  <p className="text-pink-400 mt-2 text-xs">→ Objectif fin an 1 : 5-10k€ MRR (50-100 clients)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">🎯 Checklist de lancement</h2>

          <Card className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-pink-800/50 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2 text-slate-300 text-sm">
                <p className="font-bold text-pink-300 mb-3">Avant de lancer :</p>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>J'ai 3+ pré-ventes confirmées</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>Mon MVP fait la fonctionnalité principale parfaitement</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>Stripe est configuré et testé (test mode)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>J'ai un email d'onboarding automatique</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>Mon pricing est 2x ce que je pensais initialement</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>J'ai une liste de 50+ prospects à contacter day 1</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>J'ai un canal de support (email ou chat)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" disabled />
                    <span>Analytics configuré (Vercel Analytics ou Plausible)</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">💪 Le mindset du bootstrapper</h2>

          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300 text-sm">
                <p className="font-bold text-pink-400">Ce qui vous attend (soyez prêt) :</p>
                <ul className="space-y-2 ml-4">
                  <li>→ <strong>Mois 1-3</strong> : Vous allez douter. "Ça ne marchera jamais". Normal.</li>
                  <li>→ <strong>Mois 4-6</strong> : Croissance lente. 1-2 clients/semaine si vous husslez fort.</li>
                  <li>→ <strong>Mois 7-9</strong> : Ça commence à rouler. Vous voyez la lumière.</li>
                  <li>→ <strong>Mois 10-12</strong> : Vous avez un vrai business. Fierté méritée.</li>
                </ul>
                <div className="p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded mt-6">
                  <p className="font-bold text-pink-300 mb-2">Règles d'or :</p>
                  <ul className="space-y-2">
                    <li>✓ Ship rapide, itère vite</li>
                    <li>✓ Parlez à vos clients CHAQUE semaine</li>
                    <li>✓ Distribution &gt; features (toujours)</li>
                    <li>✓ Boring tech &gt; hype tech</li>
                    <li>✓ Niche &gt; large marché</li>
                    <li>✓ B2B &gt; B2C</li>
                    <li>✓ Revenus &gt; vanity metrics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-pink-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-300 mb-4">
                Prêt à lancer votre micro-SaaS ? Trouvez l'inspiration parmi des centaines d'idées validées.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <Link 
                  href="/"
                  className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded transition-all"
                >
                  Découvrir les idées NextUnicorn →
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-3">Articles liés :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/blog/50-idees-saas-developpeurs-2025" className="text-pink-400 hover:text-pink-300 text-sm underline">
                    50 idées de SaaS pour développeurs
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link href="/blog/comment-trouver-idee-business-profitable" className="text-pink-400 hover:text-pink-300 text-sm underline">
                    Comment trouver une idée profitable
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </article>
    </div>
  );
}
