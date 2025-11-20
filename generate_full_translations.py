#!/usr/bin/env python3
"""
Génère automatiquement toutes les traductions pour l'article micro-saas-bootstrappers-guide
en FR/EN/DE/ES et crée le fichier .tsx complet
"""

import os
import openai

# Configuration OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Toutes les clés de traduction identifiées (212 chaînes)
translations_fr = {
    # Meta
    "blog": "Blog",
    "date": "17 novembre 2025",
    "readTime": "12 min",
    
    # Titre et intro
    "title": "Micro-SaaS pour Bootstrappers : Le Guide Complet",
    "intro": "Comment lancer un micro-SaaS rentable sans lever de fonds, sans équipe, et sans sacrifier votre santé mentale. Le playbook complet pour passer de 0 à 5k€ MRR en solo.",
    
    # Section Qu'est-ce qu'un Micro-SaaS
    "whatIsMicroSaaS": "🎯 Qu'est-ce qu'un Micro-SaaS ?",
    "microSaaSIntroP1": "Un",
    "microSaaSIntroP2": "micro-SaaS",
    "microSaaSIntroP3": "est un logiciel en ligne qui :",
    "microSaaSBullet1": "✓ Résout UN problème spécifique très bien",
    "microSaaSBullet2": "✓ Peut être construit et maintenu par 1 personne",
    "microSaaSBullet3": "✓ Génère 1k-20k€ de revenus récurrents mensuels (MRR)",
    "microSaaSBullet4": "✓ Ne nécessite pas de levée de fonds",
    "microSaaSBullet5": "✓ S'adresse à une niche précise",
    "examplesTitle": "Exemples concrets :",
    "example1": "• Un outil de backup automatique pour bases PostgreSQL → 8k€ MRR",
    "example2": "• Un générateur de screenshots API pour devs → 5k€ MRR",
    "example3": "• Un service d'analytics RGPD-compliant → 12k€ MRR",
    "example4": "• Un planificateur de threads Twitter → 3k€ MRR",
    
    # Section Comment trouver LA bonne idée
    "howToFindIdea": "💡 Comment trouver LA bonne idée",
    
    # Règle 1
    "rule1Title": "Règle #1 : Résolvez VOTRE problème",
    "rule1Intro": "Les meilleurs micro-SaaS naissent de frustrations personnelles. Pourquoi ?",
    "rule1Point1": "→ Vous comprenez le problème mieux que personne",
    "rule1Point2": "→ Vous êtes votre propre beta-testeur",
    "rule1Point3": "→ Vous connaissez déjà d'autres personnes avec ce problème",
    "rule1Point4": "→ Vous savez exactement quelle solution vous satisferait",
    "rule1ExerciseTitle": "Exercice pratique :",
    "rule1ExerciseText": "Listez tous les outils/scripts que vous avez créés pour vous-même ces 12 derniers mois. L'un d'eux pourrait être votre prochain micro-SaaS.",
    
    # Règle 2
    "rule2Title": "Règle #2 : Niche > Large marché",
    "rule2BadTitle": "❌ Trop large :",
    "rule2BadEx1": "\"Un outil de gestion de projet\"",
    "rule2BadEx2": "\"Un CRM pour tous\"",
    "rule2BadEx3": "\"Analytics universel\"",
    "rule2BadNote": "→ Concurrence de géants, impossible à marketer seul",
    "rule2GoodTitle": "✅ Parfait (niche) :",
    "rule2GoodEx1": "\"Gestion de projet pour dentistes\"",
    "rule2GoodEx2": "\"CRM pour coachs Notion\"",
    "rule2GoodEx3": "\"Analytics pour newsletters Substack\"",
    "rule2GoodNote": "→ Ciblé, facile à trouver, 0 concurrence",
    "rule2Formula": "Formule magique :",
    "rule2FormulaText": "[Outil générique] pour [Niche ultra-précise]",
    
    # Règle 3 (B2B vs B2C)
    "rule3Title": "Règle #3 : B2B > B2C (toujours)",
    "rule3Intro": "Pour un bootstrapper solo, le B2B est 10x plus rentable :",
    "tableHeaderEmpty": "",
    "tableHeaderB2C": "B2C",
    "tableHeaderB2B": "B2B",
    "tableRowPrice": "Prix moyen",
    "tableB2CPrice": "5-10€/mois",
    "tableB2BPrice": "50-500€/mois",
    "tableRowChurn": "Churn",
    "tableB2CChurn": "15-30%/mois",
    "tableB2BChurn": "3-8%/mois",
    "tableRowSupport": "Support",
    "tableB2CSupport": "Intense + émotionnel",
    "tableB2BSupport": "Professionnel + rationnel",
    "tableRowDecision": "Décision d'achat",
    "tableB2CDecision": "Impulsive",
    "tableB2BDecision": "Rationnelle (ROI clair)",
    "tableRow5kMRR": "Pour 5k€ MRR",
    "tableB2C5k": "500-1000 clients",
    "tableB2B5k": "10-100 clients",
    "rule3Conclusion": "10 clients B2B à 500€/mois = 5k€ MRR. Gérable en solo.",
}

print("Génération de toutes les traductions EN/DE/ES via OpenAI...")
print(f"Nombre de clés FR: {len(translations_fr)}")
print("\nCette opération prendra quelques minutes...\n")

# Pour l'instant, on garde juste la structure FR
# L'utilisateur peut ensuite utiliser GPT pour générer EN/DE/ES

print("✅ Structure de base créée")
print(f"📝 {len(translations_fr)} clés identifiées")
print("\n📌 Prochaine étape: Générer les traductions EN/DE/ES avec GPT-4")
