"use client";
import Link from "next/link";

export default function CGU() {
  return (
    <div className="h-screen bg-slate-950 text-slate-100 overflow-y-auto flex flex-col">
      <div className="border-b border-slate-700 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="text-pink-600 hover:text-pink-500 font-mono text-sm mb-4 inline-block">← Retour</Link>
          <h1 className="text-4xl font-bold text-pink-600 mb-2">Conditions Générales d&apos;Utilisation</h1>
          <p className="text-slate-400 text-sm">Dernière mise à jour : Novembre 2025</p>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-12 font-mono text-sm text-slate-300 space-y-8">
        
        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">1. Acceptation des Conditions</h2>
          <p className="mb-2">En accédant et en utilisant NextUnicorn (ci-après &quot;la Plateforme&quot;), vous acceptez sans réserve les présentes conditions générales d&apos;utilisation.</p>
          <p>Si vous n&apos;acceptez pas ces conditions, veuillez ne pas utiliser la Plateforme. L&apos;utilisation continue de la Plateforme constitue votre acceptation de ces conditions.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">2. Description du Service</h2>
          <p className="mb-2">NextUnicorn est une plateforme de voting participatif permettant aux utilisateurs de :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Soumettre des idées SaaS innovantes</li>
            <li>Voter sur des idées proposées par d&apos;autres utilisateurs</li>
            <li>Consulter un classement en temps réel des idées</li>
            <li>Découvrir les meilleures innovations communautaires</li>
          </ul>
          <p className="mt-3">La Plateforme fournit un mécanisme de sélection communautaire des meilleures idées via un système de votes anonymes.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">3. Conditions d&apos;Accès</h2>
          <p className="mb-2">Vous garantissez que :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Vous avez au moins 13 ans (ou l&apos;âge légal dans votre juridiction)</li>
            <li>Vous avez la capacité juridique de conclure un contrat</li>
            <li>Vous n&apos;avez pas été banni de la Plateforme précédemment</li>
            <li>Vous ne violez aucune loi, réglementation ou droit de tiers</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">4. Contenu Utilisateur</h2>
          <p className="mb-2">Vous êtes seul responsable du contenu que vous soumettez (idées, votes). En soumettant du contenu, vous accordez à NextUnicorn une licence mondiale, perpétuelle, irrévocable et libre de droits pour :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Afficher et partager votre contenu sur la Plateforme</li>
            <li>Utiliser votre contenu à des fins d&apos;amélioration du service</li>
            <li>Analyser les données agrégées de la Plateforme</li>
          </ul>
          <p className="mt-3">Vous garantissez que votre contenu ne viole pas les droits de tiers et n&apos;est pas contraire à la loi.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">5. Comportement Prohibé</h2>
          <p className="mb-2">Vous vous engagez à ne pas :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Soumettre du contenu offensant, diffamatoire, illégal ou nuisible</li>
            <li>Manipuler le système de voting (bots, votes multiples, fraude)</li>
            <li>Accéder à la Plateforme de façon non autorisée ou contourner ses mesures de sécurité</li>
            <li>Collecter ou extraire des données sans autorisation</li>
            <li>Utiliser la Plateforme à des fins de spam, phishing ou harcèlement</li>
            <li>Promouvoir des activités illégales ou dangereuses</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">6. Propriété Intellectuelle</h2>
          <p>NextUnicorn, son design, ses fonctionnalités, son contenu et son interface sont la propriété exclusive de design-moi un mouton et sont protégés par les droits d&apos;auteur et les lois applicables. Vous ne pouvez pas reproduire, distribuer ou transmettre le contenu de la Plateforme sans autorisation écrite préalable.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">7. Limitation de Responsabilité</h2>
          <p className="mb-2">NextUnicorn est fourni &quot;en l&apos;état&quot; sans garanties d&apos;aucune sorte. La Plateforme ne garantit pas :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>L&apos;exactitude ou la qualité des idées soumises</li>
            <li>L&apos;absence d&apos;interruption ou d&apos;erreurs</li>
            <li>La sécurité absolue des données</li>
          </ul>
          <p className="mt-3">En aucun cas NextUnicorn ne sera responsable de dommages indirects, consécutifs ou spéciaux découlant de l&apos;utilisation ou de l&apos;impossibilité d&apos;utiliser la Plateforme.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">8. Publicités et Partenaires</h2>
          <p className="mb-2">La Plateforme peut contenir des publicités et des contenus de partenaires. Ces publicités :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Sont clairement marquées comme &quot;sponsorisées&quot;</li>
            <li>Ne représentent pas l&apos;endorsement de NextUnicorn</li>
            <li>Relèvent de la responsabilité des annonceurs</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">9. Modification et Résiliation</h2>
          <p className="mb-2">NextUnicorn se réserve le droit de :</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Modifier les présentes conditions à tout moment</li>
            <li>Suspendre ou résilier votre accès sans préavis en cas de violation</li>
            <li>Modifier ou interrompre le service</li>
          </ul>
          <p className="mt-3">L&apos;utilisation continue après notification de changements constitue votre acceptation.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">10. Droit Applicable</h2>
          <p>Les présentes conditions sont régies par la loi française. Tout litige découlant de l&apos;utilisation de la Plateforme sera soumis à la juridiction exclusive des tribunaux compétents en France.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-pink-600 mb-3">11. Contact</h2>
          <p className="mb-2">Pour toute question ou réclamation concernant ces conditions :</p>
          <p className="mb-1"><span className="font-bold">Email :</span> <a href="mailto:designmoiunmouton@gmail.com" className="text-pink-600 hover:text-pink-500">designmoiunmouton@gmail.com</a></p>
          <p><span className="font-bold">Entreprise :</span> design-moi un mouton</p>
        </section>

        <section className="border-t border-slate-700 pt-6 mt-8">
          <p className="text-slate-500 text-xs">En utilisant cette Plateforme, vous reconnaissez avoir lu, compris et accepté intégralement les présentes conditions générales d&apos;utilisation.</p>
        </section>
        <section className="flex gap-6 flex-wrap pt-4">
          <Link href="/confidentialite" className="text-slate-500 hover:text-pink-500 text-xs">Politique de confidentialité</Link>
          <Link href="/mentions" className="text-slate-500 hover:text-pink-500 text-xs">Mentions légales</Link>
          <Link href="/contact" className="text-slate-500 hover:text-pink-500 text-xs">Contact</Link>
          <Link href="/startup-ideas" className="text-slate-500 hover:text-pink-500 text-xs">Idées de startup</Link>
        </section>

      </div>
    </div>
  );
}
