#!/usr/bin/env python3
# Script pour extraire automatiquement toutes les traductions nécessaires

import re
import json

# Lire le fichier source
with open('app/blog/micro-saas-bootstrappers-guide/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Extraire tout le texte dans les balises HTML (texte entre > et <)
html_texts = re.findall(r'>([^<>]+)<', content)

# Nettoyer et filtrer
unique_texts = set()
for text in html_texts:
    text = text.strip()
    # Ignorer les textes vides, les espaces, et les variables React
    if text and not text.startswith('{') and len(text) > 1 and not text.isspace():
        # Ignorer les symboles seuls
        if not text in ['•', '→', '✓', '❌', '✅', ':', '...']:
            unique_texts.add(text)

# Trier par longueur pour avoir les phrases complètes en premier
sorted_texts = sorted(unique_texts, key=len, reverse=True)

print("=== TEXTES À TRADUIRE ===")
print(f"Total: {len(sorted_texts)} chaînes uniques\n")

for i, text in enumerate(sorted_texts[:50], 1):  # Afficher les 50 premiers
    print(f"{i}. {text[:100]}...")

print(f"\n... et {len(sorted_texts) - 50} autres textes")
