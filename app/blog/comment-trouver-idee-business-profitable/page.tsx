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

  const content = {
    fr: {
      date: "18 novembre 2025",
      readTime: "10 min",
      title: "Comment Trouver une Idée de Business Profitable en 2025",
      intro: "La plupart des entrepreneurs échouent non pas par manque d'exécution, mais parce qu'ils résolvent le mauvais problème. Voici la méthode complète pour identifier, valider et lancer une idée qui génère du revenu récurrent.",
      fatalErrors: "❌ Les 3 erreurs fatales",
      error1: "\"J'ai une idée géniale !\"",
      error1Text: "Vous n'avez pas validé si quelqu'un paierait pour ça",
      error2: "\"Je vais construire d'abord, vendre ensuite\"",
      error2Text: "6 mois de dev, 0 clients",
      error3: "\"Mon produit se vendra tout seul\"",
      error3Text: "Distribution > Product, toujours",
      method: "✅ La méthode en 5 étapes",
      step1Title: "Étape 1: Identifiez VOS problèmes",
      step1Intro: "Les meilleures idées viennent de problèmes que vous avez personnellement. Pourquoi ?",
      step1Point1: "→ Vous comprenez le problème intimement",
      step1Point2: "→ Vous êtes votre premier client (validation gratuite)",
      step1Point3: "→ Vous connaissez déjà la solution qui VOUS satisferait",
      step1Point4: "→ Vous avez accès à des gens similaires",
      step1Exercise: "Exercice pratique:",
      step1ExerciseText: "Listez 10 choses qui vous frustrent dans votre travail quotidien. Pour chacune, demandez-vous : \"Combien je paierais pour ne plus avoir ce problème ?\"",
      step2Title: "Étape 2: Validez AVANT de coder",
      step2Intro: "Ne touchez pas à votre éditeur de code tant que vous n'avez pas validé ces 3 choses :",
      step2ATitle: "A. Le problème existe vraiment",
      step2AText: "Parlez à 20 personnes qui ont potentiellement ce problème :",
      step2AQ1: "• \"Racontez-moi la dernière fois que vous avez eu [problème]\"",
      step2AQ2: "• \"Comment vous faites actuellement pour régler ça ?\"",
      step2AQ3: "• \"Combien de temps/argent ça vous coûte ?\"",
      step2AResult: "→ Si 15/20 confirment le problème : GO",
      step2BTitle: "B. Les gens PAIENT pour le résoudre",
      step2BText: "\"C'est chiant mais gratuit\" ≠ Business. Vérifiez :",
      step2BQ1: "• Existe-t-il déjà des solutions payantes ?",
      step2BQ2: "• Les gens utilisent-ils des outils détournés ?",
      step2BQ3: "• Le problème coûte-t-il de l'argent/temps mesurable ?",
      step2BResult: "→ Si oui : le marché existe",
      step2CTitle: "C. Vous pouvez atteindre ces gens",
      step2CText: "La meilleure idée sans distribution = 0€. Avant de commencer :",
      step2CQ1: "• Où traînent vos clients potentiels ? (Reddit, LinkedIn, forums...)",
      step2CQ2: "• Pouvez-vous les contacter directement ?",
      step2CQ3: "• Avez-vous accès à une audience existante ?",
      step2CResult: "→ Distribution > Product, toujours",
      step3Title: "Étape 3: Vendez AVANT de construire",
      step3Intro: "Le test ultime : faire payer des gens pour un produit qui n'existe pas encore.",
      step3Protocol: "Le protocole de pré-vente :",
      step3Day1: "Jour 1-2 : Landing page basique (problème + solution + pricing + \"Accès beta\")",
      step3Day3: "Jour 3-5 : Postez sur 5 endroits où traînent vos clients",
      step3Day6: "Jour 6-10 : Contactez 50 personnes en direct (cold email/DM)",
      step3Day11: "Jour 11-14 : Analysez les résultats",
      step3GoldenRule: "Règle d'or :",
      step3GoldenRuleText: "Si vous n'avez pas au moins 3 pré-ventes à 50€+ après 2 semaines → L'idée ne vaut pas la peine d'être développée.",
      step4Title: "Étape 4: MVP en 2 semaines max",
      step4Intro: "Vous avez des pré-ventes ? Parfait. Maintenant construisez le MINIMUM pour délivrer de la valeur.",
      step4NotMVP: "❌ PAS un MVP :",
      step4NotMVP1: "• Auth avec OAuth + email + 2FA",
      step4NotMVP2: "• Design parfait pixel-perfect",
      step4NotMVP3: "• 15 fonctionnalités \"au cas où\"",
      step4NotMVP4: "• Tests unitaires complets",
      step4NotMVP5: "• Multi-langue dès le départ",
      step4IsMVP: "✅ UN MVP :",
      step4IsMVP1: "• UNE fonctionnalité principale",
      step4IsMVP2: "• Auth simple (email + password)",
      step4IsMVP3: "• Design propre mais basique",
      step4IsMVP4: "• Stripe Checkout basique",
      step4IsMVP5: "• Anglais seulement",
      step4Goal: "Objectif :",
      step4GoalText: "Livrer aux 3 premiers clients en 2 semaines. Pas en 2 mois. Pas \"quand ce sera parfait\". En 2 semaines.",
      step5Title: "Étape 5: Itérez avec les VRAIS clients",
      step5Intro: "Vos 3-10 premiers clients sont en OR. Ils vous disent exactement quoi construire.",
      step5Week1: "Semaine 1 post-launch :",
      step5Week1Point1: "• Call avec chaque client (30 min) : comment ils utilisent le produit",
      step5Week1Point2: "• Notez les 3 features les plus demandées",
      step5Week1Point3: "• Identifiez les points de friction majeurs",
      step5Week2: "Semaines 2-4 :",
      step5Week2Point1: "• Fixez les bugs bloquants immédiatement",
      step5Week2Point2: "• Ajoutez UNE feature demandée par 80% des users",
      step5Week2Point3: "• Ignorez tout ce qui n'est pas demandé par la majorité",
      step5Cycle: "Le cycle d'itération rapide :",
      step5CycleText: "Ship → Feedback → Fix → Ship → Repeat",
      step5CycleGoal: "Objectif : 1 release/semaine minimum pendant 3 mois",
      checklistTitle: "🎯 Checklist de validation complète",
      checklist1: "J'ai parlé à 20 personnes qui ont ce problème",
      checklist2: "Au moins 15/20 confirment que c'est un vrai problème",
      checklist3: "Des solutions payantes existent déjà (= marché validé)",
      checklist4: "Je sais exactement où trouver 100+ clients potentiels",
      checklist5: "J'ai une landing page avec pricing clair",
      checklist6: "Au moins 3 personnes ont payé pour la beta",
      checklist7: "Je peux livrer un MVP fonctionnel en 2 semaines",
      checklist8: "J'ai un plan de distribution pour les 3 premiers mois",
      pricingTitle: "💰 Pricing : La question à 1M€",
      pricingRule1: "Règle #1 : Chargez dès le jour 1",
      pricingRule1Text: "Un produit gratuit ne sera JAMAIS pris au sérieux. Vous n'aurez pas de vrais retours. Les gens ne valorisent que ce qu'ils paient.",
      pricingRule2: "Règle #2 : Commencez plus cher que vous pensez",
      pricingRule2Intro: "Multipliez votre prix \"confortable\" par 3. Sérieusement.",
      pricingRule2Ex1: "• Vous pensez 10€/mois ? → Essayez 30€",
      pricingRule2Ex2: "• Vous pensez 50€/mois ? → Essayez 150€",
      pricingRule2Ex3: "• Vous pensez 200€/mois ? → Essayez 600€",
      pricingRule2Conclusion: "Si personne ne dit \"c'est trop cher\", c'est que c'est trop cheap.",
      pricingRule3: "Règle #3 : Prix basé sur la VALEUR, pas le coût",
      pricingRule3Q: "Votre SaaS fait économiser 5h/semaine à un dev payé 50€/h ?",
      pricingRule3A: "→ Valeur = 250€/semaine = 1000€/mois",
      pricingRule3Conclusion: "Vous pouvez charger 200-400€/mois facilement, même si vos coûts = 5€/mois.",
      afterTitle: "🚀 Et après ?",
      afterIntro: "Vous avez validé votre idée, lancé votre MVP, et vos 10 premiers clients paient. Maintenant quoi ?",
      afterMonth1: "Mois 1-3 : Objectif = 10 → 25 clients payants",
      afterMonth4: "Mois 4-6 : Objectif = 25 → 50 clients payants",
      afterMonth7: "Mois 7-12 : Objectif = 50 → 100 clients payants",
      afterGoal: "100 clients à 100€/mois = 10k MRR = Vous avez un vrai business.",
      cta: "Besoin d'inspiration pour votre prochaine idée ? Découvrez des centaines d'idées validées sur NextUnicorn.",
      ctaButton: "Voir les idées du jour →",
      relatedArticles: "Articles liés :",
      related1: "50 idées de SaaS pour développeurs",
      related2: "Guide micro-SaaS pour bootstrappers"
    },
    en: {
      date: "November 18, 2025",
      readTime: "10 min",
      title: "How to Find a Profitable Business Idea in 2025",
      intro: "Most entrepreneurs fail not from lack of execution, but because they solve the wrong problem. Here's the complete method to identify, validate, and launch an idea that generates recurring revenue.",
      fatalErrors: "❌ The 3 Fatal Mistakes",
      error1: "\"I have a great idea!\"",
      error1Text: "You haven't validated if anyone would pay for it",
      error2: "\"I'll build first, sell later\"",
      error2Text: "6 months of dev, 0 customers",
      error3: "\"My product will sell itself\"",
      error3Text: "Distribution > Product, always",
      method: "✅ The 5-Step Method",
      step1Title: "Step 1: Identify YOUR problems",
      step1Intro: "The best ideas come from problems you have personally. Why?",
      step1Point1: "→ You understand the problem intimately",
      step1Point2: "→ You are your first customer (free validation)",
      step1Point3: "→ You already know the solution that would satisfy YOU",
      step1Point4: "→ You have access to similar people",
      step1Exercise: "Practical exercise:",
      step1ExerciseText: "List 10 things that frustrate you in your daily work. For each, ask yourself: \"How much would I pay to not have this problem anymore?\"",
      step2Title: "Step 2: Validate BEFORE coding",
      step2Intro: "Don&apos;t touch your code editor until you&apos;ve validated these 3 things:",
      step2ATitle: "A. The problem really exists",
      step2AText: "Talk to 20 people who potentially have this problem:",
      step2AQ1: "• \"Tell me about the last time you had [problem]\"",
      step2AQ2: "• \"How do you currently solve this?\"",
      step2AQ3: "• \"How much time/money does it cost you?\"",
      step2AResult: "→ If 15/20 confirm the problem: GO",
      step2BTitle: "B. People PAY to solve it",
      step2BText: "\"Annoying but free\" ≠ Business. Check:",
      step2BQ1: "• Do paid solutions already exist?",
      step2BQ2: "• Are people using workaround tools?",
      step2BQ3: "• Does the problem cost measurable money/time?",
      step2BResult: "→ If yes: the market exists",
      step2CTitle: "C. You can reach these people",
      step2CText: "Best idea without distribution = $0. Before starting:",
      step2CQ1: "• Where do your potential customers hang out? (Reddit, LinkedIn, forums...)",
      step2CQ2: "• Can you contact them directly?",
      step2CQ3: "• Do you have access to an existing audience?",
      step2CResult: "→ Distribution > Product, always",
      step3Title: "Step 3: Sell BEFORE building",
      step3Intro: "The ultimate test: get people to pay for a product that doesn't exist yet.",
      step3Protocol: "The pre-sale protocol:",
      step3Day1: "Day 1-2: Basic landing page (problem + solution + pricing + \"Beta access\")",
      step3Day3: "Day 3-5: Post in 5 places where your customers hang out",
      step3Day6: "Day 6-10: Contact 50 people directly (cold email/DM)",
      step3Day11: "Day 11-14: Analyze results",
      step3GoldenRule: "Golden rule:",
      step3GoldenRuleText: "If you don&apos;t have at least 3 pre-sales at $50+ after 2 weeks → The idea isn&apos;t worth developing.",
      step4Title: "Step 4: MVP in 2 weeks max",
      step4Intro: "You have pre-sales? Perfect. Now build the MINIMUM to deliver value.",
      step4NotMVP: "❌ NOT an MVP:",
      step4NotMVP1: "• Auth with OAuth + email + 2FA",
      step4NotMVP2: "• Pixel-perfect design",
      step4NotMVP3: "• 15 \"just in case\" features",
      step4NotMVP4: "• Complete unit tests",
      step4NotMVP5: "• Multi-language from day 1",
      step4IsMVP: "✅ AN MVP:",
      step4IsMVP1: "• ONE core feature",
      step4IsMVP2: "• Simple auth (email + password)",
      step4IsMVP3: "• Clean but basic design",
      step4IsMVP4: "• Basic Stripe Checkout",
      step4IsMVP5: "• English only",
      step4Goal: "Goal:",
      step4GoalText: "Deliver to the first 3 customers in 2 weeks. Not 2 months. Not \"when it&apos;s perfect\". In 2 weeks.",
      step5Title: "Step 5: Iterate with REAL customers",
      step5Intro: "Your first 3-10 customers are GOLD. They tell you exactly what to build.",
      step5Week1: "Week 1 post-launch:",
      step5Week1Point1: "• Call with each customer (30 min): how they use the product",
      step5Week1Point2: "• Note the top 3 most requested features",
      step5Week1Point3: "• Identify major friction points",
      step5Week2: "Weeks 2-4:",
      step5Week2Point1: "• Fix blocking bugs immediately",
      step5Week2Point2: "• Add ONE feature requested by 80% of users",
      step5Week2Point3: "• Ignore everything not requested by the majority",
      step5Cycle: "The rapid iteration cycle:",
      step5CycleText: "Ship → Feedback → Fix → Ship → Repeat",
      step5CycleGoal: "Goal: 1 release/week minimum for 3 months",
      checklistTitle: "🎯 Complete Validation Checklist",
      checklist1: "I've talked to 20 people who have this problem",
      checklist2: "At least 15/20 confirm it&apos;s a real problem",
      checklist3: "Paid solutions already exist (= validated market)",
      checklist4: "I know exactly where to find 100+ potential customers",
      checklist5: "I have a landing page with clear pricing",
      checklist6: "At least 3 people paid for the beta",
      checklist7: "I can deliver a functional MVP in 2 weeks",
      checklist8: "I have a distribution plan for the first 3 months",
      pricingTitle: "💰 Pricing: The $1M Question",
      pricingRule1: "Rule #1: Charge from day 1",
      pricingRule1Text: "A free product will NEVER be taken seriously. You won&apos;t get real feedback. People only value what they pay for.",
      pricingRule2: "Rule #2: Start higher than you think",
      pricingRule2Intro: "Multiply your \"comfortable\" price by 3. Seriously.",
      pricingRule2Ex1: "• You think $10/month? → Try $30",
      pricingRule2Ex2: "• You think $50/month? → Try $150",
      pricingRule2Ex3: "• You think $200/month? → Try $600",
      pricingRule2Conclusion: "If nobody says \"too expensive\", it&apos;s too cheap.",
      pricingRule3: "Rule #3: Price based on VALUE, not cost",
      pricingRule3Q: "Your SaaS saves 5h/week for a dev earning $50/h?",
      pricingRule3A: "→ Value = $250/week = $1000/month",
      pricingRule3Conclusion: "You can charge $200-400/month easily, even if your costs = $5/month.",
      afterTitle: "🚀 What's next?",
      afterIntro: "You&apos;ve validated your idea, launched your MVP, and your first 10 customers are paying. Now what?",
      afterMonth1: "Months 1-3: Goal = 10 → 25 paying customers",
      afterMonth4: "Months 4-6: Goal = 25 → 50 paying customers",
      afterMonth7: "Months 7-12: Goal = 50 → 100 paying customers",
      afterGoal: "100 customers at $100/month = $10k MRR = You have a real business.",
      cta: "Need inspiration for your next idea? Discover hundreds of validated ideas on NextUnicorn.",
      ctaButton: "See today's ideas →",
      relatedArticles: "Related articles:",
      related1: "50 SaaS ideas for developers",
      related2: "Micro-SaaS guide for bootstrappers"
    },
    de: {
      date: "18. November 2025",
      readTime: "10 Min",
      title: "Wie man 2025 eine profitable Geschäftsidee findet",
      intro: "Die meisten Unternehmer scheitern nicht an mangelnder Umsetzung, sondern weil sie das falsche Problem lösen. Hier ist die vollständige Methode, um eine Idee zu identifizieren, zu validieren und zu starten, die wiederkehrende Einnahmen generiert.",
      fatalErrors: "❌ Die 3 fatalen Fehler",
      error1: "\"Ich habe eine großartige Idee!\"",
      error1Text: "Sie haben nicht validiert, ob jemand dafür bezahlen würde",
      error2: "\"Ich baue zuerst, verkaufe später\"",
      error2Text: "6 Monate Entwicklung, 0 Kunden",
      error3: "\"Mein Produkt wird sich von selbst verkaufen\"",
      error3Text: "Vertrieb > Produkt, immer",
      method: "✅ Die 5-Schritte-Methode",
      step1Title: "Schritt 1: Identifizieren Sie IHRE Probleme",
      step1Intro: "Die besten Ideen kommen von Problemen, die Sie persönlich haben. Warum?",
      step1Point1: "→ Sie verstehen das Problem intim",
      step1Point2: "→ Sie sind Ihr erster Kunde (kostenlose Validierung)",
      step1Point3: "→ Sie kennen bereits die Lösung, die SIE zufriedenstellen würde",
      step1Point4: "→ Sie haben Zugang zu ähnlichen Menschen",
      step1Exercise: "Praktische Übung:",
      step1ExerciseText: "Listen Sie 10 Dinge auf, die Sie in Ihrer täglichen Arbeit frustrieren. Fragen Sie sich für jede: \"Wie viel würde ich zahlen, um dieses Problem nicht mehr zu haben?\"",
      step2Title: "Schritt 2: Validieren Sie VOR dem Codieren",
      step2Intro: "Berühren Sie Ihren Code-Editor nicht, bis Sie diese 3 Dinge validiert haben:",
      step2ATitle: "A. Das Problem existiert wirklich",
      step2AText: "Sprechen Sie mit 20 Personen, die möglicherweise dieses Problem haben:",
      step2AQ1: "• \"Erzählen Sie mir vom letzten Mal, als Sie [Problem] hatten\"",
      step2AQ2: "• \"Wie lösen Sie das derzeit?\"",
      step2AQ3: "• \"Wie viel Zeit/Geld kostet Sie das?\"",
      step2AResult: "→ Wenn 15/20 das Problem bestätigen: LOS",
      step2BTitle: "B. Menschen ZAHLEN, um es zu lösen",
      step2BText: "\"Nervig aber kostenlos\" ≠ Geschäft. Prüfen Sie:",
      step2BQ1: "• Existieren bereits bezahlte Lösungen?",
      step2BQ2: "• Verwenden Menschen Workaround-Tools?",
      step2BQ3: "• Kostet das Problem messbar Geld/Zeit?",
      step2BResult: "→ Wenn ja: der Markt existiert",
      step2CTitle: "C. Sie können diese Menschen erreichen",
      step2CText: "Beste Idee ohne Vertrieb = 0€. Vor dem Start:",
      step2CQ1: "• Wo halten sich Ihre potenziellen Kunden auf? (Reddit, LinkedIn, Foren...)",
      step2CQ2: "• Können Sie sie direkt kontaktieren?",
      step2CQ3: "• Haben Sie Zugang zu einem bestehenden Publikum?",
      step2CResult: "→ Vertrieb > Produkt, immer",
      step3Title: "Schritt 3: Verkaufen Sie VOR dem Bauen",
      step3Intro: "Der ultimative Test: Bringen Sie Menschen dazu, für ein Produkt zu zahlen, das noch nicht existiert.",
      step3Protocol: "Das Vorverkaufsprotokoll:",
      step3Day1: "Tag 1-2: Einfache Landing Page (Problem + Lösung + Preis + \"Beta-Zugang\")",
      step3Day3: "Tag 3-5: Posten Sie an 5 Orten, wo Ihre Kunden sich aufhalten",
      step3Day6: "Tag 6-10: Kontaktieren Sie 50 Personen direkt (Cold Email/DM)",
      step3Day11: "Tag 11-14: Analysieren Sie die Ergebnisse",
      step3GoldenRule: "Goldene Regel:",
      step3GoldenRuleText: "Wenn Sie nach 2 Wochen nicht mindestens 3 Vorverkäufe zu 50€+ haben → Die Idee ist es nicht wert, entwickelt zu werden.",
      step4Title: "Schritt 4: MVP in maximal 2 Wochen",
      step4Intro: "Sie haben Vorverkäufe? Perfekt. Bauen Sie jetzt das MINIMUM, um Wert zu liefern.",
      step4NotMVP: "❌ KEIN MVP:",
      step4NotMVP1: "• Auth mit OAuth + E-Mail + 2FA",
      step4NotMVP2: "• Pixelgenaues Design",
      step4NotMVP3: "• 15 \"für alle Fälle\" Features",
      step4NotMVP4: "• Vollständige Unit-Tests",
      step4NotMVP5: "• Mehrsprachig von Tag 1",
      step4IsMVP: "✅ EIN MVP:",
      step4IsMVP1: "• EIN Hauptfeature",
      step4IsMVP2: "• Einfache Auth (E-Mail + Passwort)",
      step4IsMVP3: "• Sauberes aber einfaches Design",
      step4IsMVP4: "• Einfacher Stripe Checkout",
      step4IsMVP5: "• Nur Englisch",
      step4Goal: "Ziel:",
      step4GoalText: "Liefern Sie an die ersten 3 Kunden in 2 Wochen. Nicht in 2 Monaten. Nicht \"wenn es perfekt ist\". In 2 Wochen.",
      step5Title: "Schritt 5: Iterieren Sie mit ECHTEN Kunden",
      step5Intro: "Ihre ersten 3-10 Kunden sind GOLD. Sie sagen Ihnen genau, was Sie bauen sollen.",
      step5Week1: "Woche 1 nach dem Start:",
      step5Week1Point1: "• Anruf mit jedem Kunden (30 Min): wie sie das Produkt nutzen",
      step5Week1Point2: "• Notieren Sie die 3 am meisten gewünschten Features",
      step5Week1Point3: "• Identifizieren Sie große Reibungspunkte",
      step5Week2: "Wochen 2-4:",
      step5Week2Point1: "• Beheben Sie blockierende Bugs sofort",
      step5Week2Point2: "• Fügen Sie EIN Feature hinzu, das von 80% der Nutzer gewünscht wird",
      step5Week2Point3: "• Ignorieren Sie alles, was nicht von der Mehrheit gewünscht wird",
      step5Cycle: "Der schnelle Iterationszyklus:",
      step5CycleText: "Ausliefern → Feedback → Beheben → Ausliefern → Wiederholen",
      step5CycleGoal: "Ziel: mindestens 1 Release/Woche für 3 Monate",
      checklistTitle: "🎯 Vollständige Validierungs-Checkliste",
      checklist1: "Ich habe mit 20 Personen gesprochen, die dieses Problem haben",
      checklist2: "Mindestens 15/20 bestätigen, dass es ein echtes Problem ist",
      checklist3: "Bezahlte Lösungen existieren bereits (= validierter Markt)",
      checklist4: "Ich weiß genau, wo ich 100+ potenzielle Kunden finde",
      checklist5: "Ich habe eine Landing Page mit klarer Preisgestaltung",
      checklist6: "Mindestens 3 Personen haben für die Beta bezahlt",
      checklist7: "Ich kann ein funktionales MVP in 2 Wochen liefern",
      checklist8: "Ich habe einen Vertriebsplan für die ersten 3 Monate",
      pricingTitle: "💰 Preisgestaltung: Die 1M€-Frage",
      pricingRule1: "Regel #1: Verlangen Sie Geld ab Tag 1",
      pricingRule1Text: "Ein kostenloses Produkt wird NIEMALS ernst genommen. Sie erhalten kein echtes Feedback. Menschen schätzen nur, wofür sie bezahlen.",
      pricingRule2: "Regel #2: Starten Sie höher als Sie denken",
      pricingRule2Intro: "Multiplizieren Sie Ihren \"bequemen\" Preis mit 3. Ernsthaft.",
      pricingRule2Ex1: "• Sie denken 10€/Monat? → Probieren Sie 30€",
      pricingRule2Ex2: "• Sie denken 50€/Monat? → Probieren Sie 150€",
      pricingRule2Ex3: "• Sie denken 200€/Monat? → Probieren Sie 600€",
      pricingRule2Conclusion: "Wenn niemand sagt \"zu teuer\", ist es zu billig.",
      pricingRule3: "Regel #3: Preis basiert auf WERT, nicht auf Kosten",
      pricingRule3Q: "Ihr SaaS spart 5h/Woche für einen Entwickler, der 50€/h verdient?",
      pricingRule3A: "→ Wert = 250€/Woche = 1000€/Monat",
      pricingRule3Conclusion: "Sie können leicht 200-400€/Monat verlangen, selbst wenn Ihre Kosten = 5€/Monat.",
      afterTitle: "🚀 Was kommt als Nächstes?",
      afterIntro: "Sie haben Ihre Idee validiert, Ihr MVP gestartet und Ihre ersten 10 Kunden zahlen. Was jetzt?",
      afterMonth1: "Monate 1-3: Ziel = 10 → 25 zahlende Kunden",
      afterMonth4: "Monate 4-6: Ziel = 25 → 50 zahlende Kunden",
      afterMonth7: "Monate 7-12: Ziel = 50 → 100 zahlende Kunden",
      afterGoal: "100 Kunden zu 100€/Monat = 10k MRR = Sie haben ein echtes Geschäft.",
      cta: "Brauchen Sie Inspiration für Ihre nächste Idee? Entdecken Sie Hunderte validierter Ideen auf NextUnicorn.",
      ctaButton: "Heutige Ideen ansehen →",
      relatedArticles: "Verwandte Artikel:",
      related1: "50 SaaS-Ideen für Entwickler",
      related2: "Micro-SaaS Guide für Bootstrapper"
    },
    es: {
      date: "18 de noviembre de 2025",
      readTime: "10 min",
      title: "Cómo Encontrar una Idea de Negocio Rentable en 2025",
      intro: "La mayoría de los emprendedores fracasan no por falta de ejecución, sino porque resuelven el problema equivocado. Aquí está el método completo para identificar, validar y lanzar una idea que genere ingresos recurrentes.",
      fatalErrors: "❌ Los 3 errores fatales",
      error1: "\"¡Tengo una gran idea!\"",
      error1Text: "No has validado si alguien pagaría por ello",
      error2: "\"Construiré primero, venderé después\"",
      error2Text: "6 meses de desarrollo, 0 clientes",
      error3: "\"Mi producto se venderá solo\"",
      error3Text: "Distribución > Producto, siempre",
      method: "✅ El método de 5 pasos",
      step1Title: "Paso 1: Identifique SUS problemas",
      step1Intro: "Las mejores ideas vienen de problemas que tienes personalmente. ¿Por qué?",
      step1Point1: "→ Entiendes el problema íntimamente",
      step1Point2: "→ Eres tu primer cliente (validación gratuita)",
      step1Point3: "→ Ya sabes la solución que te satisfaría a TI",
      step1Point4: "→ Tienes acceso a personas similares",
      step1Exercise: "Ejercicio práctico:",
      step1ExerciseText: "Lista 10 cosas que te frustran en tu trabajo diario. Para cada una, pregúntate: \"¿Cuánto pagaría por no tener más este problema?\"",
      step2Title: "Paso 2: Valida ANTES de codificar",
      step2Intro: "No toques tu editor de código hasta que hayas validado estas 3 cosas:",
      step2ATitle: "A. El problema realmente existe",
      step2AText: "Habla con 20 personas que potencialmente tienen este problema:",
      step2AQ1: "• \"Cuéntame sobre la última vez que tuviste [problema]\"",
      step2AQ2: "• \"¿Cómo resuelves esto actualmente?\"",
      step2AQ3: "• \"¿Cuánto tiempo/dinero te cuesta?\"",
      step2AResult: "→ Si 15/20 confirman el problema: ADELANTE",
      step2BTitle: "B. La gente PAGA para resolverlo",
      step2BText: "\"Molesto pero gratis\" ≠ Negocio. Verifica:",
      step2BQ1: "• ¿Ya existen soluciones de pago?",
      step2BQ2: "• ¿La gente usa herramientas alternativas?",
      step2BQ3: "• ¿El problema cuesta dinero/tiempo medible?",
      step2BResult: "→ Si sí: el mercado existe",
      step2CTitle: "C. Puedes alcanzar a estas personas",
      step2CText: "Mejor idea sin distribución = 0€. Antes de empezar:",
      step2CQ1: "• ¿Dónde se encuentran tus clientes potenciales? (Reddit, LinkedIn, foros...)",
      step2CQ2: "• ¿Puedes contactarlos directamente?",
      step2CQ3: "• ¿Tienes acceso a una audiencia existente?",
      step2CResult: "→ Distribución > Producto, siempre",
      step3Title: "Paso 3: Vende ANTES de construir",
      step3Intro: "La prueba definitiva: hacer que la gente pague por un producto que aún no existe.",
      step3Protocol: "El protocolo de preventa:",
      step3Day1: "Día 1-2: Landing page básica (problema + solución + precio + \"Acceso beta\")",
      step3Day3: "Día 3-5: Publica en 5 lugares donde tus clientes se encuentran",
      step3Day6: "Día 6-10: Contacta 50 personas directamente (cold email/DM)",
      step3Day11: "Día 11-14: Analiza los resultados",
      step3GoldenRule: "Regla de oro:",
      step3GoldenRuleText: "Si no tienes al menos 3 preventas a 50€+ después de 2 semanas → La idea no vale la pena desarrollarla.",
      step4Title: "Paso 4: MVP en 2 semanas máximo",
      step4Intro: "¿Tienes preventas? Perfecto. Ahora construye lo MÍNIMO para entregar valor.",
      step4NotMVP: "❌ NO es un MVP:",
      step4NotMVP1: "• Auth con OAuth + email + 2FA",
      step4NotMVP2: "• Diseño pixel-perfect",
      step4NotMVP3: "• 15 funciones \"por si acaso\"",
      step4NotMVP4: "• Tests unitarios completos",
      step4NotMVP5: "• Multi-idioma desde el día 1",
      step4IsMVP: "✅ UN MVP:",
      step4IsMVP1: "• UNA función principal",
      step4IsMVP2: "• Auth simple (email + contraseña)",
      step4IsMVP3: "• Diseño limpio pero básico",
      step4IsMVP4: "• Stripe Checkout básico",
      step4IsMVP5: "• Solo inglés",
      step4Goal: "Objetivo:",
      step4GoalText: "Entregar a los primeros 3 clientes en 2 semanas. No en 2 meses. No \"cuando sea perfecto\". En 2 semanas.",
      step5Title: "Paso 5: Itera con clientes REALES",
      step5Intro: "Tus primeros 3-10 clientes son ORO. Te dicen exactamente qué construir.",
      step5Week1: "Semana 1 post-lanzamiento:",
      step5Week1Point1: "• Llamada con cada cliente (30 min): cómo usan el producto",
      step5Week1Point2: "• Anota las 3 funciones más solicitadas",
      step5Week1Point3: "• Identifica los principales puntos de fricción",
      step5Week2: "Semanas 2-4:",
      step5Week2Point1: "• Soluciona bugs bloqueantes inmediatamente",
      step5Week2Point2: "• Añade UNA función solicitada por el 80% de los usuarios",
      step5Week2Point3: "• Ignora todo lo que no sea solicitado por la mayoría",
      step5Cycle: "El ciclo de iteración rápida:",
      step5CycleText: "Lanzar → Feedback → Arreglar → Lanzar → Repetir",
      step5CycleGoal: "Objetivo: mínimo 1 release/semana durante 3 meses",
      checklistTitle: "🎯 Lista de verificación de validación completa",
      checklist1: "He hablado con 20 personas que tienen este problema",
      checklist2: "Al menos 15/20 confirman que es un problema real",
      checklist3: "Ya existen soluciones de pago (= mercado validado)",
      checklist4: "Sé exactamente dónde encontrar 100+ clientes potenciales",
      checklist5: "Tengo una landing page con precio claro",
      checklist6: "Al menos 3 personas pagaron por la beta",
      checklist7: "Puedo entregar un MVP funcional en 2 semanas",
      checklist8: "Tengo un plan de distribución para los primeros 3 meses",
      pricingTitle: "💰 Precio: La pregunta del millón",
      pricingRule1: "Regla #1: Cobra desde el día 1",
      pricingRule1Text: "Un producto gratuito NUNCA será tomado en serio. No obtendrás retroalimentación real. La gente solo valora lo que paga.",
      pricingRule2: "Regla #2: Empieza más caro de lo que piensas",
      pricingRule2Intro: "Multiplica tu precio \"cómodo\" por 3. En serio.",
      pricingRule2Ex1: "• ¿Piensas 10€/mes? → Prueba 30€",
      pricingRule2Ex2: "• ¿Piensas 50€/mes? → Prueba 150€",
      pricingRule2Ex3: "• ¿Piensas 200€/mes? → Prueba 600€",
      pricingRule2Conclusion: "Si nadie dice \"demasiado caro\", es demasiado barato.",
      pricingRule3: "Regla #3: Precio basado en el VALOR, no en el costo",
      pricingRule3Q: "¿Tu SaaS ahorra 5h/semana a un dev que gana 50€/h?",
      pricingRule3A: "→ Valor = 250€/semana = 1000€/mes",
      pricingRule3Conclusion: "Puedes cobrar 200-400€/mes fácilmente, incluso si tus costos = 5€/mes.",
      afterTitle: "🚀 ¿Y después?",
      afterIntro: "Has validado tu idea, lanzado tu MVP y tus primeros 10 clientes están pagando. ¿Ahora qué?",
      afterMonth1: "Meses 1-3: Objetivo = 10 → 25 clientes de pago",
      afterMonth4: "Meses 4-6: Objetivo = 25 → 50 clientes de pago",
      afterMonth7: "Meses 7-12: Objetivo = 50 → 100 clientes de pago",
      afterGoal: "100 clientes a 100€/mes = 10k MRR = Tienes un negocio real.",
      cta: "¿Necesitas inspiración para tu próxima idea? Descubre cientos de ideas validadas en NextUnicorn.",
      ctaButton: "Ver ideas de hoy →",
      relatedArticles: "Artículos relacionados:",
      related1: "50 ideas de SaaS para desarrolladores",
      related2: "Guía micro-SaaS para bootstrappers"
    }
  };

  const t = content[lang];

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
            {t.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {t.readTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-linear-to-r from-pink-500 via-rose-400 to-pink-500 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-clicker)' }}>
          {t.title}
        </h1>

        <p className="text-lg text-slate-300 mb-8 leading-relaxed">
          {t.intro}
        </p>

        {/* Content */}
        <div className="prose prose-invert prose-pink max-w-none">
          <h2 className="text-2xl font-bold text-slate-200 mt-8 mb-4">{t.fatalErrors}</h2>
          
          <Card className="bg-red-900/20 border-red-800/50 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p><strong className="text-red-400">1. {t.error1}</strong> → {t.error1Text}</p>
                <p><strong className="text-red-400">2. {t.error2}</strong> → {t.error2Text}</p>
                <p><strong className="text-red-400">3. {t.error3}</strong> → {t.error3Text}</p>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">{t.method}</h2>

          <div className="space-y-8">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-pink-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold text-pink-400 mb-2">{t.step1Title}</h3>
                    <p className="text-slate-300 mb-4">
                      {t.step1Intro}
                    </p>
                    <ul className="space-y-2 text-slate-300">
                      <li>{t.step1Point1}</li>
                      <li>{t.step1Point2}</li>
                      <li>{t.step1Point3}</li>
                      <li>{t.step1Point4}</li>
                    </ul>
                    <div className="mt-4 p-4 bg-slate-800/50 rounded">
                      <p className="text-sm text-slate-400 mb-2"><strong>{t.step1Exercise}</strong></p>
                      <p className="text-sm text-slate-300">
                        {t.step1ExerciseText}
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
                    <h3 className="text-xl font-bold text-pink-400 mb-2">{t.step2Title}</h3>
                    <p className="text-slate-300 mb-4">
                      {t.step2Intro}
                    </p>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">{t.step2ATitle}</h4>
                        <p className="text-slate-300 text-sm mb-2">{t.step2AText}</p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>{t.step2AQ1}</li>
                          <li>{t.step2AQ2}</li>
                          <li>{t.step2AQ3}</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">{t.step2AResult}</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">{t.step2BTitle}</h4>
                        <p className="text-slate-300 text-sm mb-2">
                          {t.step2BText}
                        </p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>{t.step2BQ1}</li>
                          <li>{t.step2BQ2}</li>
                          <li>{t.step2BQ3}</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">{t.step2BResult}</p>
                      </div>

                      <div className="p-4 bg-slate-800/50 rounded">
                        <h4 className="font-bold text-slate-200 mb-2">{t.step2CTitle}</h4>
                        <p className="text-slate-300 text-sm mb-2">
                          {t.step2CText}
                        </p>
                        <ul className="space-y-1 text-slate-300 text-sm">
                          <li>{t.step2CQ1}</li>
                          <li>{t.step2CQ2}</li>
                          <li>{t.step2CQ3}</li>
                        </ul>
                        <p className="text-pink-400 text-sm mt-2">{t.step2CResult}</p>
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
                    <h3 className="text-xl font-bold text-pink-400 mb-2">{t.step3Title}</h3>
                    <p className="text-slate-300 mb-4">
                      {t.step3Intro}
                    </p>
                    <div className="space-y-3 text-slate-300">
                      <div className="p-4 bg-linear-to-r from-pink-900/20 to-rose-900/20 border border-pink-800/30 rounded">
                        <p className="font-bold text-pink-300 mb-2">{t.step3Protocol}</p>
                        <ol className="space-y-2 text-sm">
                          <li>{t.step3Day1}</li>
                          <li>{t.step3Day3}</li>
                          <li>{t.step3Day6}</li>
                          <li>{t.step3Day11}</li>
                        </ol>
                      </div>
                      <p className="text-sm">
                        <strong className="text-pink-400">{t.step3GoldenRule}</strong> {t.step3GoldenRuleText}
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
                    <h3 className="text-xl font-bold text-pink-400 mb-2">{t.step4Title}</h3>
                    <p className="text-slate-300 mb-4">
                      {t.step4Intro}
                    </p>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-4 bg-red-900/20 border border-red-800/50 rounded">
                          <p className="font-bold text-red-400 mb-2">{t.step4NotMVP}</p>
                          <ul className="space-y-1">
                            <li>{t.step4NotMVP1}</li>
                            <li>{t.step4NotMVP2}</li>
                            <li>{t.step4NotMVP3}</li>
                            <li>{t.step4NotMVP4}</li>
                            <li>{t.step4NotMVP5}</li>
                          </ul>
                        </div>
                        <div className="p-4 bg-green-900/20 border border-green-800/50 rounded">
                          <p className="font-bold text-green-400 mb-2">{t.step4IsMVP}</p>
                          <ul className="space-y-1">
                            <li>{t.step4IsMVP1}</li>
                            <li>{t.step4IsMVP2}</li>
                            <li>{t.step4IsMVP3}</li>
                            <li>{t.step4IsMVP4}</li>
                            <li>{t.step4IsMVP5}</li>
                          </ul>
                        </div>
                      </div>
                      <p className="text-pink-400 mt-4">
                        <strong>{t.step4Goal}</strong> {t.step4GoalText}
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
                    <h3 className="text-xl font-bold text-pink-400 mb-2">{t.step5Title}</h3>
                    <p className="text-slate-300 mb-4">
                      {t.step5Intro}
                    </p>
                    <div className="space-y-3 text-slate-300 text-sm">
                      <p><strong className="text-pink-400">{t.step5Week1}</strong></p>
                      <ul className="space-y-2 ml-4">
                        <li>{t.step5Week1Point1}</li>
                        <li>{t.step5Week1Point2}</li>
                        <li>{t.step5Week1Point3}</li>
                      </ul>
                      <p className="mt-4"><strong className="text-pink-400">{t.step5Week2}</strong></p>
                      <ul className="space-y-2 ml-4">
                        <li>{t.step5Week2Point1}</li>
                        <li>{t.step5Week2Point2}</li>
                        <li>{t.step5Week2Point3}</li>
                      </ul>
                      <div className="mt-4 p-4 bg-slate-800/50 rounded">
                        <p className="font-bold text-slate-200 mb-2">{t.step5Cycle}</p>
                        <p>{t.step5CycleText}</p>
                        <p className="text-pink-400 mt-2">{t.step5CycleGoal}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">{t.checklistTitle}</h2>
          
          <Card className="bg-linear-to-br from-pink-900/20 to-rose-900/20 border-pink-800/50 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-2 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist2}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist3}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist4}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist5}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist6}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist7}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" disabled />
                  <span>{t.checklist8}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">{t.pricingTitle}</h2>
          
          <Card className="bg-slate-900/50 border-slate-800 mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4 text-slate-300">
                <p className="font-bold text-pink-400">{t.pricingRule1}</p>
                <p className="text-sm">
                  {t.pricingRule1Text}
                </p>
                
                <p className="font-bold text-pink-400 mt-6">{t.pricingRule2}</p>
                <div className="text-sm space-y-2">
                  <p>{t.pricingRule2Intro}</p>
                  <ul className="ml-4 space-y-1">
                    <li>{t.pricingRule2Ex1}</li>
                    <li>{t.pricingRule2Ex2}</li>
                    <li>{t.pricingRule2Ex3}</li>
                  </ul>
                  <p className="text-pink-400 mt-2">
                    {t.pricingRule2Conclusion}
                  </p>
                </div>

                <p className="font-bold text-pink-400 mt-6">{t.pricingRule3}</p>
                <div className="text-sm">
                  <p className="mb-2">{t.pricingRule3Q}</p>
                  <p className="text-pink-400">{t.pricingRule3A}</p>
                  <p className="mt-2">{t.pricingRule3Conclusion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <h2 className="text-2xl font-bold text-slate-200 mt-12 mb-4">{t.afterTitle}</h2>
          
          <p className="text-slate-300 mb-4">
            {t.afterIntro}
          </p>

          <div className="space-y-3 text-slate-300 text-sm mb-8">
            <p><strong className="text-pink-400">{t.afterMonth1}</strong></p>
            <p><strong className="text-pink-400">{t.afterMonth4}</strong></p>
            <p><strong className="text-pink-400">{t.afterMonth7}</strong></p>
            <p className="text-pink-400 mt-4">
              {t.afterGoal}
            </p>
          </div>

          <Card className="bg-slate-900 border-pink-500/30">
            <CardContent className="pt-6 text-center">
              <p className="text-slate-300 mb-4">
                {t.cta}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                <Link 
                  href="/"
                  className="inline-block bg-linear-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold py-3 px-6 rounded transition-all"
                >
                  {t.ctaButton}
                </Link>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-800">
                <p className="text-slate-400 text-sm mb-3">{t.relatedArticles}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link href="/blog/50-idees-saas-developpeurs-2025" className="text-pink-400 hover:text-pink-300 text-sm underline">
                    {t.related1}
                  </Link>
                  <span className="text-slate-600">•</span>
                  <Link href="/blog/micro-saas-bootstrappers-guide" className="text-pink-400 hover:text-pink-300 text-sm underline">
                    {t.related2}
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
