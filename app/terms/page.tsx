"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";
import { Language, detectLanguage } from "@/app/lib/i18n";
import { LanguageSelector } from "@/app/components/language-selector";

export default function TermsPage() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return detectLanguage();
    }
    return "en";
  });

  const content = {
    en: {
      title: "Terms & Conditions",
      lastUpdated: "Last updated: November 19, 2025",
      sections: [
        {
          title: "1. Service Description",
          content: "NextUnicorn provides advertising space for SaaS products through rotating 3D cards displayed on our platform. By purchasing advertising space, you agree to these terms and conditions."
        },
        {
          title: "2. Prohibited Content",
          content: "The following types of content are strictly prohibited on our platform:\n\n• Pornographic or sexually explicit content\n• Illegal products or services\n• Hate speech, discriminatory content, or harassment\n• Scams, pyramid schemes, or fraudulent schemes\n• Weapons, drugs, or illegal substances\n• Content promoting violence or self-harm\n• Counterfeit goods or trademark violations\n• Misleading or deceptive advertising\n• Content violating intellectual property rights"
        },
        {
          title: "3. Moderation Rights",
          content: "NextUnicorn reserves the right to:\n\n• Review and approve all advertisements before publication\n• Remove any advertisement that violates these terms without prior notice\n• Refuse service to any advertiser at our sole discretion\n• Modify or reject content that we deem inappropriate\n\nViolation of these terms will result in immediate removal of your advertisement WITHOUT REFUND."
        },
        {
          title: "4. Payment & Refunds",
          content: "• Payments are processed securely through Stripe\n• One-shot payments: Valid for 30 days from activation\n• Subscriptions: Billed monthly or yearly, cancellable anytime\n• Refunds are NOT provided for content that violates our terms\n• Partial refunds may be issued at our discretion for technical issues\n• Subscription cancellations do not include refunds for the current billing period"
        },
        {
          title: "5. Advertiser Responsibilities",
          content: "As an advertiser, you are responsible for:\n\n• Ensuring your content complies with these terms\n• Providing accurate and non-misleading information\n• Owning or having rights to all content (logos, text, images)\n• Maintaining a valid email address for communications\n• Complying with all applicable laws and regulations"
        },
        {
          title: "6. Data Protection (GDPR)",
          content: "We collect and process the following data:\n\n• Email address for communication and billing\n• SaaS name, logo URL, and target URL for advertisement display\n• Payment information (processed securely by Stripe)\n\nYour data is stored securely and used solely for service delivery. You have the right to access, modify, or delete your data by contacting us. We do not sell or share your data with third parties except for payment processing."
        },
        {
          title: "7. Liability Limitation",
          content: "NextUnicorn is not responsible for:\n\n• Click-through rates or conversion performance\n• Technical issues beyond our control\n• Third-party service interruptions (hosting, Stripe, etc.)\n• Indirect or consequential damages\n\nOur maximum liability is limited to the amount paid for the advertisement."
        },
        {
          title: "8. Modifications",
          content: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. Major changes will be communicated via email to active advertisers."
        },
        {
          title: "9. Contact",
          content: "For questions, moderation appeals, or data requests, contact us at: contact@nextunicorn.app"
        }
      ]
    },
    fr: {
      title: "Conditions Générales de Vente",
      lastUpdated: "Dernière mise à jour : 19 novembre 2025",
      sections: [
        {
          title: "1. Description du Service",
          content: "NextUnicorn propose des espaces publicitaires pour produits SaaS via des cartes 3D rotatives affichées sur notre plateforme. En achetant un espace publicitaire, vous acceptez ces conditions générales."
        },
        {
          title: "2. Contenus Interdits",
          content: "Les types de contenus suivants sont strictement interdits sur notre plateforme :\n\n• Contenu pornographique ou à caractère sexuel explicite\n• Produits ou services illégaux\n• Discours haineux, contenu discriminatoire ou harcèlement\n• Arnaques, systèmes pyramidaux ou schémas frauduleux\n• Armes, drogues ou substances illégales\n• Contenu promouvant la violence ou l'automutilation\n• Contrefaçons ou violations de marques\n• Publicité mensongère ou trompeuse\n• Contenu violant les droits de propriété intellectuelle"
        },
        {
          title: "3. Droits de Modération",
          content: "NextUnicorn se réserve le droit de :\n\n• Examiner et approuver toutes les publicités avant publication\n• Supprimer toute publicité violant ces conditions sans préavis\n• Refuser le service à tout annonceur à notre seule discrétion\n• Modifier ou rejeter du contenu jugé inapproprié\n\nLa violation de ces conditions entraînera la suppression immédiate de votre publicité SANS REMBOURSEMENT."
        },
        {
          title: "4. Paiement & Remboursements",
          content: "• Les paiements sont traités de manière sécurisée via Stripe\n• Paiements uniques : Valables 30 jours à partir de l'activation\n• Abonnements : Facturés mensuellement ou annuellement, résiliables à tout moment\n• Aucun remboursement pour contenu violant nos conditions\n• Remboursements partiels possibles à notre discrétion pour problèmes techniques\n• Les annulations d'abonnement n'incluent pas le remboursement de la période en cours"
        },
        {
          title: "5. Responsabilités de l'Annonceur",
          content: "En tant qu'annonceur, vous êtes responsable de :\n\n• Vous assurer que votre contenu respecte ces conditions\n• Fournir des informations exactes et non trompeuses\n• Posséder ou avoir les droits sur tout le contenu (logos, textes, images)\n• Maintenir une adresse email valide pour les communications\n• Respecter toutes les lois et réglementations applicables"
        },
        {
          title: "6. Protection des Données (RGPD)",
          content: "Nous collectons et traitons les données suivantes :\n\n• Adresse email pour communication et facturation\n• Nom du SaaS, URL du logo et URL cible pour l'affichage publicitaire\n• Informations de paiement (traitées de manière sécurisée par Stripe)\n\nVos données sont stockées de manière sécurisée et utilisées uniquement pour la prestation du service. Vous avez le droit d'accéder, modifier ou supprimer vos données en nous contactant. Nous ne vendons ni ne partageons vos données avec des tiers sauf pour le traitement des paiements."
        },
        {
          title: "7. Limitation de Responsabilité",
          content: "NextUnicorn n'est pas responsable de :\n\n• Taux de clics ou performances de conversion\n• Problèmes techniques indépendants de notre volonté\n• Interruptions de services tiers (hébergement, Stripe, etc.)\n• Dommages indirects ou consécutifs\n\nNotre responsabilité maximale est limitée au montant payé pour la publicité."
        },
        {
          title: "8. Modifications",
          content: "Nous nous réservons le droit de modifier ces conditions à tout moment. L'utilisation continue du service après modifications constitue l'acceptation des nouvelles conditions. Les changements majeurs seront communiqués par email aux annonceurs actifs."
        },
        {
          title: "9. Contact",
          content: "Pour questions, appels de modération ou demandes de données, contactez-nous à : contact@nextunicorn.app"
        }
      ]
    },
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      lastUpdated: "Zuletzt aktualisiert: 19. November 2025",
      sections: [
        {
          title: "1. Dienstbeschreibung",
          content: "NextUnicorn bietet Werbeflächen für SaaS-Produkte über rotierende 3D-Karten auf unserer Plattform. Mit dem Kauf von Werbeflächen stimmen Sie diesen Geschäftsbedingungen zu."
        },
        {
          title: "2. Verbotene Inhalte",
          content: "Folgende Inhalte sind auf unserer Plattform streng verboten:\n\n• Pornografische oder sexuell explizite Inhalte\n• Illegale Produkte oder Dienstleistungen\n• Hassrede, diskriminierende Inhalte oder Belästigung\n• Betrug, Schneeballsysteme oder betrügerische Systeme\n• Waffen, Drogen oder illegale Substanzen\n• Inhalte, die Gewalt oder Selbstverletzung fördern\n• Gefälschte Waren oder Markenverletzungen\n• Irreführende oder täuschende Werbung\n• Inhalte, die geistige Eigentumsrechte verletzen"
        },
        {
          title: "3. Moderationsrechte",
          content: "NextUnicorn behält sich das Recht vor:\n\n• Alle Anzeigen vor Veröffentlichung zu überprüfen und zu genehmigen\n• Anzeigen zu entfernen, die gegen diese Bedingungen verstoßen, ohne Vorankündigung\n• Den Service nach eigenem Ermessen jedem Werbetreibenden zu verweigern\n• Inhalte zu ändern oder abzulehnen, die wir als unangemessen erachten\n\nVerstöße gegen diese Bedingungen führen zur sofortigen Entfernung Ihrer Anzeige OHNE RÜCKERSTATTUNG."
        },
        {
          title: "4. Zahlung & Rückerstattungen",
          content: "• Zahlungen werden sicher über Stripe abgewickelt\n• Einmalzahlungen: Gültig für 30 Tage ab Aktivierung\n• Abonnements: Monatlich oder jährlich abgerechnet, jederzeit kündbar\n• Keine Rückerstattungen für Inhalte, die gegen unsere Bedingungen verstoßen\n• Teilrückerstattungen können nach unserem Ermessen bei technischen Problemen gewährt werden\n• Abonnementkündigungen beinhalten keine Rückerstattung für den laufenden Abrechnungszeitraum"
        },
        {
          title: "5. Verantwortlichkeiten des Werbetreibenden",
          content: "Als Werbetreibender sind Sie verantwortlich für:\n\n• Sicherstellen, dass Ihre Inhalte diesen Bedingungen entsprechen\n• Bereitstellung korrekter und nicht irreführender Informationen\n• Besitz oder Rechte an allen Inhalten (Logos, Texte, Bilder)\n• Pflege einer gültigen E-Mail-Adresse für Kommunikation\n• Einhaltung aller anwendbaren Gesetze und Vorschriften"
        },
        {
          title: "6. Datenschutz (DSGVO)",
          content: "Wir sammeln und verarbeiten folgende Daten:\n\n• E-Mail-Adresse für Kommunikation und Abrechnung\n• SaaS-Name, Logo-URL und Ziel-URL für Anzeigendarstellung\n• Zahlungsinformationen (sicher von Stripe verarbeitet)\n\nIhre Daten werden sicher gespeichert und ausschließlich zur Dienstleistungserbringung verwendet. Sie haben das Recht, auf Ihre Daten zuzugreifen, sie zu ändern oder zu löschen, indem Sie uns kontaktieren. Wir verkaufen oder teilen Ihre Daten nicht mit Dritten, außer zur Zahlungsabwicklung."
        },
        {
          title: "7. Haftungsbeschränkung",
          content: "NextUnicorn ist nicht verantwortlich für:\n\n• Click-Through-Raten oder Conversion-Performance\n• Technische Probleme außerhalb unserer Kontrolle\n• Unterbrechungen von Drittanbieterdiensten (Hosting, Stripe usw.)\n• Indirekte oder Folgeschäden\n\nUnsere maximale Haftung ist auf den für die Anzeige gezahlten Betrag begrenzt."
        },
        {
          title: "8. Änderungen",
          content: "Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Die fortgesetzte Nutzung des Dienstes nach Änderungen stellt die Annahme der neuen Bedingungen dar. Wesentliche Änderungen werden aktiven Werbetreibenden per E-Mail mitgeteilt."
        },
        {
          title: "9. Kontakt",
          content: "Für Fragen, Moderationsanfragen oder Datenanfragen kontaktieren Sie uns unter: contact@nextunicorn.app"
        }
      ]
    },
    es: {
      title: "Términos y Condiciones",
      lastUpdated: "Última actualización: 19 de noviembre de 2025",
      sections: [
        {
          title: "1. Descripción del Servicio",
          content: "NextUnicorn proporciona espacios publicitarios para productos SaaS a través de tarjetas 3D rotativas mostradas en nuestra plataforma. Al comprar espacio publicitario, acepta estos términos y condiciones."
        },
        {
          title: "2. Contenido Prohibido",
          content: "Los siguientes tipos de contenido están estrictamente prohibidos en nuestra plataforma:\n\n• Contenido pornográfico o sexualmente explícito\n• Productos o servicios ilegales\n• Discurso de odio, contenido discriminatorio o acoso\n• Estafas, esquemas piramidales o esquemas fraudulentos\n• Armas, drogas o sustancias ilegales\n• Contenido que promueva violencia o autolesiones\n• Productos falsificados o violaciones de marcas\n• Publicidad engañosa o fraudulenta\n• Contenido que viole derechos de propiedad intelectual"
        },
        {
          title: "3. Derechos de Moderación",
          content: "NextUnicorn se reserva el derecho de:\n\n• Revisar y aprobar todos los anuncios antes de la publicación\n• Eliminar cualquier anuncio que viole estos términos sin previo aviso\n• Rechazar el servicio a cualquier anunciante a nuestra sola discreción\n• Modificar o rechazar contenido que consideremos inapropiado\n\nLa violación de estos términos resultará en la eliminación inmediata de su anuncio SIN REEMBOLSO."
        },
        {
          title: "4. Pago y Reembolsos",
          content: "• Los pagos se procesan de forma segura a través de Stripe\n• Pagos únicos: Válidos por 30 días desde la activación\n• Suscripciones: Facturadas mensual o anualmente, cancelables en cualquier momento\n• NO se proporcionan reembolsos para contenido que viole nuestros términos\n• Se pueden emitir reembolsos parciales a nuestra discreción por problemas técnicos\n• Las cancelaciones de suscripción no incluyen reembolsos del período de facturación actual"
        },
        {
          title: "5. Responsabilidades del Anunciante",
          content: "Como anunciante, usted es responsable de:\n\n• Asegurar que su contenido cumpla con estos términos\n• Proporcionar información precisa y no engañosa\n• Poseer o tener derechos sobre todo el contenido (logos, texto, imágenes)\n• Mantener una dirección de correo electrónico válida para comunicaciones\n• Cumplir con todas las leyes y regulaciones aplicables"
        },
        {
          title: "6. Protección de Datos (RGPD)",
          content: "Recopilamos y procesamos los siguientes datos:\n\n• Dirección de correo electrónico para comunicación y facturación\n• Nombre del SaaS, URL del logo y URL de destino para mostrar el anuncio\n• Información de pago (procesada de forma segura por Stripe)\n\nSus datos se almacenan de forma segura y se utilizan únicamente para la prestación del servicio. Tiene derecho a acceder, modificar o eliminar sus datos contactándonos. No vendemos ni compartimos sus datos con terceros excepto para el procesamiento de pagos."
        },
        {
          title: "7. Limitación de Responsabilidad",
          content: "NextUnicorn no es responsable de:\n\n• Tasas de clics o rendimiento de conversión\n• Problemas técnicos fuera de nuestro control\n• Interrupciones de servicios de terceros (alojamiento, Stripe, etc.)\n• Daños indirectos o consecuentes\n\nNuestra responsabilidad máxima está limitada al monto pagado por el anuncio."
        },
        {
          title: "8. Modificaciones",
          content: "Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado del servicio después de los cambios constituye la aceptación de los nuevos términos. Los cambios importantes se comunicarán por correo electrónico a los anunciantes activos."
        },
        {
          title: "9. Contacto",
          content: "Para preguntas, apelaciones de moderación o solicitudes de datos, contáctenos en: contact@nextunicorn.app"
        }
      ]
    }
  };

  const currentContent = content[lang];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-pink-400 hover:text-pink-300 font-mono">
            ← Back to NextUnicorn
          </Link>
          <LanguageSelector currentLang={lang} onChange={setLang} />
        </div>

        <h1 
          className="text-4xl md:text-6xl font-normal text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-rose-500 mb-4 text-center" 
          style={{ fontFamily: 'var(--font-clicker)' }}
        >
          {currentContent.title}
        </h1>
        
        <p className="text-center text-slate-400 font-mono text-sm mb-12">
          {currentContent.lastUpdated}
        </p>

        <div className="space-y-6">
          {currentContent.sections.map((section, index) => (
            <Card key={index} className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-xl font-mono text-pink-400">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-slate-300 whitespace-pre-line font-mono text-sm leading-relaxed">
                  {section.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 p-6 bg-pink-500/10 border border-pink-500/30 rounded-lg">
          <p className="text-center text-pink-400 font-mono text-sm">
            {lang === "fr" 
              ? "En utilisant notre service, vous acceptez ces conditions. Toute violation entraînera la suppression de votre publicité sans remboursement."
              : lang === "de"
              ? "Durch die Nutzung unseres Dienstes akzeptieren Sie diese Bedingungen. Jeder Verstoß führt zur Entfernung Ihrer Anzeige ohne Rückerstattung."
              : lang === "es"
              ? "Al usar nuestro servicio, acepta estos términos. Cualquier violación resultará en la eliminación de su anuncio sin reembolso."
              : "By using our service, you accept these terms. Any violation will result in removal of your ad without refund."}
          </p>
        </div>
      </div>
    </div>
  );
}
