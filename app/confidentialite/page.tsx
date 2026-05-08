"use client";
import Link from "next/link";

export default function Confidentialite() {
  return (
    <div className="h-screen bg-slate-950 text-slate-100 overflow-y-auto flex flex-col">
      <div className="border-b border-slate-700 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-pink-600 hover:text-pink-500 font-mono text-sm mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-pink-600">Politique de Confidentialité</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 font-mono text-sm text-slate-300 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-pink-600 mb-2">1. Données collectées</h2>
          <p>NextUnicorn collecte uniquement les données nécessaires pour le fonctionnement du service.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-pink-600 mb-2">2. Utilisation des données</h2>
          <p>Vos données ne sont jamais partagées avec des tiers.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-pink-600 mb-2">3. Contact</h2>
          <p>Email: designmoiunmouton@gmail.com</p>
        </section>
      </div>
      <div className="max-w-4xl mx-auto px-4 pb-8 font-mono text-xs text-slate-500 flex gap-6 flex-wrap">
        <Link href="/cgu" className="hover:text-pink-500">CGU</Link>
        <Link href="/mentions" className="hover:text-pink-500">Mentions légales</Link>
        <Link href="/contact" className="hover:text-pink-500">Contact</Link>
        <Link href="/startup-ideas" className="hover:text-pink-500">Idées de startup</Link>
      </div>
    </div>
  );
}
