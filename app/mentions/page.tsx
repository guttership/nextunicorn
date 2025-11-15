"use client";
import Link from "next/link";

export default function Mentions() {
  return (
    <div className="h-screen bg-slate-950 text-slate-100 overflow-y-auto flex flex-col">
      <div className="border-b border-slate-700 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-pink-600 hover:text-pink-500 font-mono text-sm mb-4 inline-block">
            ← Retour
          </Link>
          <h1 className="text-3xl font-bold text-pink-600">Mentions Légales</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8 font-mono text-sm text-slate-300 space-y-6">
        <section>
          <h2 className="text-lg font-bold text-pink-600 mb-2">Éditeur</h2>
          <p>NextUnicorn - Créé par design-moi un mouton</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-pink-600 mb-2">Hébergement</h2>
          <p>Ce site est hébergé sur Vercel.</p>
        </section>
        <section>
          <h2 className="text-lg font-bold text-pink-600 mb-2">Contact</h2>
          <p>
            Email: designmoiunmouton@gmail.com
            <br />
            Web:{" "}
            <a
              href="https://dmum.eu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 hover:text-pink-500"
            >
              https://dmum.eu
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
