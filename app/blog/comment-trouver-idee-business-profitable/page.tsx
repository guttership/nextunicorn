"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import Link from "next/link";
import { Language, detectLanguage } from "@/app/lib/i18n";
import { LanguageSelector } from "@/app/components/language-selector";
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from "lucide-react";

export default function BlogPostCommentTrouver() {
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
            18 novembre 2025
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            10 min
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent">
          Comment Trouver une Idée de Business Profitable en 2025
        </h1>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          La plupart des entrepreneurs échouent non pas par manque d'exécution, mais parce qu'ils résolvent 
          le mauvais problème. Voici la méthode complète pour identifier, valider et lancer une idée qui 
          génère du revenu récurrent.
        </p>

        {/* Content */}
        <div className="prose prose-invert prose-pink max-w-none">
          <h2 className="text-2xl font-bold text-slate-200 mt-8 mb-4">❌ Les 3 erreurs fatales</h2>
          
          <Card className="bg-red-900/20 border-red-800/50 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p><strong className="text-red-400">1. "J'ai une idée géniale !"</strong> → Vous n'avez pas validé si quelqu'un paierait pour ça</p>
                <p><strong className="text-red-400">2. "Je vais construire d'abord, vendre ensuite"</strong> → 6 mois de dev, 0 clients</p>
                <p><strong className="text-red-400">3. "Mon produit se vendra tout seul"</strong> → Distribution &gt; Product, toujours</p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">✅ La méthode en 5 étapes</h2>

          <div className="space-y-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Étape 1: Identifiez VOS problèmes</h3>
                    <p className="text-slate-300 mb-4">
                      Les meilleures idées viennent de problèmes que vous avez personnellement. Pourquoi ?
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li>→ Vous comprenez le problème intimement</li>
                      <li>→ Vous êtes votre premier client (validation gratuite)</li>
                      <li>→ Vous connaissez déjà la solution qui VOUS satisferait</li>
                      <li>→ Vous avez accès à des gens similaires</li>
                    </ul>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded">
                      <p className="text-sm text-slate-400 mb-2"><strong>Exercice pratique:</strong></p>
                      <p className="text-sm text-slate-300">
                        Listez 10 choses qui vous frustrent dans votre travail quotidien. 
                        Pour chacune, demandez-vous : "Combien je paierais pour ne plus avoir ce problème ?"
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Étape 2: Validez AVANT de coder</h3>
                    <p className="text-slate-300 mb-4">
                      Ne touchez pas à votre éditeur de code tant que vous n'avez pas validé ces 3 choses :
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">A. Le problème existe vraiment</h4>
                        <p className="text-slate-300 text-sm mb-2">Parlez à 20 personnes qui ont potentiellement ce problème :</p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• "Racontez-moi la dernière fois que vous avez eu [problème]"</li>
                          <li>• "Comment vous faites actuellement pour régler ça ?"</li>
                          <li>• "Combien de temps/argent ça vous coûte ?"</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">→ Si 15/20 confirment le problème : GO</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">B. Les gens PAIENT pour le résoudre</h4>
                        <p className="text-slate-300 text-sm mb-2">
                          "C'est chiant mais gratuit" ≠ Business. Vérifiez :
                        </p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• Existe-t-il déjà des solutions payantes ?</li>
                          <li>• Les gens utilisent-ils des outils détournés ?</li>
                          <li>• Le problème coûte-t-il de l'argent/temps mesurable ?</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">→ Si oui : le marché existe</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">C. Vous pouvez atteindre ces gens</h4>
                        <p className="text-slate-300 text-sm mb-2">
                          La meilleure idée sans distribution = 0€. Avant de commencer :
                        </p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>• Où traînent vos clients potentiels ? (Reddit, LinkedIn, forums...)</li>
                          <li>• Pouvez-vous les contacter directement ?</li>
                          <li>• Avez-vous accès à une audience existante ?</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">→ Distribution &gt; Product, toujours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Étape 3: Vendez AVANT de construire</h3>
                    <p className="text-slate-300 mb-4">
                      Le test ultime : faire payer des gens pour un produit qui n'existe pas encore.
                    </p>
                    <div className="space-y-3 text-slate-300">
                      <div className="p-4 bg-gradient-to-r from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded">
                        <p className="font-bold text-pink-300 mb-2">Le protocole de pré-vente :</p>
                        <ol className="space-y-2 text-sm">
                          <li><strong>Jour 1-2</strong> : Landing page basique (problème + solution + pricing + "Accès beta")</li>
                          <li><strong>Jour 3-5</strong> : Postez sur 5 endroits où traînent vos clients</li>
                          <li><strong>Jour 6-10</strong> : Contactez 50 personnes en direct (cold email/DM)</li>
                          <li><strong>Jour 11-14</strong> : Analysez les résultats</li>
                        </ol>
                      </div>
                      <p className="text-sm">
                        <strong className="text-pink-400">Règle d'or :</strong> Si vous n'avez pas au moins 3 pré-ventes 
                        à 50€+ après 2 semaines → L'idée ne vaut pas la peine d'être développée.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Étape 4: MVP en 2 semaines max</h3>
                    <p className="text-slate-300 mb-4">
                      Vous avez des pré-ventes ? Parfait. Maintenant construisez le MINIMUM pour délivrer de la valeur.
                    </p>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded">
                          <p className="font-bold text-red-400 mb-2">❌ PAS un MVP :</p>
                          <ul className="space-y-1">
                            <li>• Auth avec OAuth + email + 2FA</li>
                            <li>• Design parfait pixel-perfect</li>
                            <li>• 15 fonctionnalités "au cas où"</li>
                            <li>• Tests unitaires complets</li>
                            <li>• Multi-langue dès le départ</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-green-900/20 border border-green-800/50 rounded">
                          <p className="font-bold text-green-400 mb-2">✅ UN MVP :</p>
                          <ul className="space-y-1">
                            <li>• UNE fonctionnalité principale</li>
                            <li>• Auth simple (email + password)</li>
                            <li>• Design propre mais basique</li>
                            <li>• Stripe Checkout basique</li>
                            <li>• Anglais seulement</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-pink-400 mt-4">
                        <strong>Objectif :</strong> Livrer aux 3 premiers clients en 2 semaines. 
                        Pas en 2 mois. Pas "quand ce sera parfait". En 2 semaines.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">Étape 5: Itérez avec les VRAIS clients</h3>
                    <p className="text-slate-300 mb-4">
                      Vos 3-10 premiers clients sont en OR. Ils vous disent exactement quoi construire.
                    </p>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <p><strong className="text-pink-400">Semaine 1 post-launch :</strong></p>
                      <ul className="space-y-2 ml-4">
                        <li>• Call avec chaque client (30 min) : comment ils utilisent le produit</li>
                        <li>• Notez les 3 features les plus demandées</li>
                        <li>• Identifiez les points de friction majeurs</li>
                      </ul>
                      <p className="mt-4"><strong className="text-pink-400">Semaines 2-4 :</strong></p>
                      <ul className="space-y-2 ml-4">
                        <li>• Fixez les bugs bloquants immédiatement</li>
                        <li>• Ajoutez UNE feature demandée par 80% des users</li>
                        <li>• Ignorez tout ce qui n'est pas demandé par la majorité</li>
                      </ul>
                      <div className="mt-4 p-4 bg-slate-800/50 rounded">
                        <p className="font-bold text-slate-200 mb-2">Le cycle d'itération rapide :</p>
                        <p>Ship → Feedback → Fix → Ship → Repeat</p>
                        <p className="text-pink-400 mt-2">Objectif : 1 release/semaine minimum pendant 3 mois</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">🎯 Checklist de validation complète</h2>
          
          <Card className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border-pink-800/50 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>J'ai parlé à 20 personnes qui ont ce problème</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>Au moins 15/20 confirment que c'est un vrai problème</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>Des solutions payantes existent déjà (= marché validé)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>Je sais exactement où trouver 100+ clients potentiels</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>J'ai une landing page avec pricing clair</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>Au moins 3 personnes ont payé pour la beta</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>Je peux livrer un MVP fonctionnel en 2 semaines</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>J'ai un plan de distribution pour les 3 premiers mois</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">💰 Pricing : La question à 1M€</h2>
          
          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p className="font-bold text-pink-400">Règle #1 : Chargez dès le jour 1</p>
                <p className="text-sm">
                  Un produit gratuit ne sera JAMAIS pris au sérieux. Vous n'aurez pas de vrais retours. 
                  Les gens ne valorisent que ce qu'ils paient.
                </p>
                
                <p className="font-bold text-pink-400 mt-6">Règle #2 : Commencez plus cher que vous pensez</p>
                <div className="text-sm space-y-2">
                  <p>Multipliez votre prix "confortable" par 3. Sérieusement.</p>
                  <ul className="ml-4 space-y-1">
                    <li>• Vous pensez 10€/mois ? → Essayez 30€</li>
                    <li>• Vous pensez 50€/mois ? → Essayez 150€</li>
                    <li>• Vous pensez 200€/mois ? → Essayez 600€</li>
                  </ul>
                  <p className="text-pink-400 mt-2">
                    Si personne ne dit "c'est trop cher", c'est que c'est trop cheap.
                  </p>
                </div>

                <p className="font-bold text-pink-400 mt-6">Règle #3 : Prix basé sur la VALEUR, pas le coût</p>
                <div className="text-sm">
                  <p className="mb-2">Votre SaaS fait économiser 5h/semaine à un dev payé 50€/h ?</p>
                  <p className="text-pink-400">→ Valeur = 250€/semaine = 1000€/mois</p>
                  <p className="mt-2">Vous pouvez charger 200-400€/mois facilement, même si vos coûts = 5€/mois.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">🚀 Et après ?</h2>
          
          <p className="text-slate-300 mb-4">
            Vous avez validé votre idée, lancé votre MVP, et vos 10 premiers clients paient. Maintenant quoi ?
          </p>

          <div className="space-y-3 text-slate-300 text-sm mb-8">
            <p><strong className="text-pink-400">Mois 1-3 :</strong> Objectif = 10 → 25 clients payants</p>
            <p><strong className="text-pink-400">Mois 4-6 :</strong> Objectif = 25 → 50 clients payants</p>
            <p><strong className="text-pink-400">Mois 7-12 :</strong> Objectif = 50 → 100 clients payants</p>
            <p className="text-pink-400 mt-4">
              100 clients à 100€/mois = 10k MRR = Vous avez un vrai business.
            </p>
          </div>

          <Card className="bg-slate-900 border-pink-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-300 mb-4">
                Besoin d'inspiration pour votre prochaine idée ? Découvrez des centaines d'idées validées sur NextUnicorn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <Link 
                  href="/"
                  className="inline-block bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded transition-all"
                >
                  Voir les idées du jour →
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-3">Articles liés :</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/blog/50-idees-saas-developpeurs-2025" className="text-pink-400 hover:text-pink-300 text-sm underline">
                    50 idées de SaaS pour développeurs
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link href="/blog/micro-saas-bootstrappers-guide" className="text-pink-400 hover:text-pink-300 text-sm underline">
                    Guide micro-SaaS pour bootstrappers
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
