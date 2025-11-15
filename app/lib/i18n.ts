export type Language = "en" | "fr" | "de" | "es";

export function formatPrice(amount: number, lang: Language): string {
  switch (lang) {
    case "fr":
      return `${amount}€`;
    case "de":
      return `${amount}€`;
    case "es":
      return `${amount}€`;
    case "en":
    default:
      return `$${amount}`;
  }
}

export function getCurrency(lang: Language): string {
  switch (lang) {
    case "fr":
    case "de":
    case "es":
      return "EUR";
    case "en":
    default:
      return "USD";
  }
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    title: "NextUnicorn",
    subtitle: "$ battle your ideas",
    loading: "Loading ideas...",
    failed: "Failed to load ideas",
    battle: "BATTLE",
    leaderboard: "LEADERBOARD",
    hallOfFame: "Hall of Fame",
    topIdeas: "$ top ideas by votes",
    ranking: "$ ranking",
    noIdeas: "$ no ideas voted yet. start battling!",
    updates: "▲ █ ▼ Updates in real-time · Vote to climb the rankings ▲ █ ▼",
    subtitle_duel: "$ battle your ideas",
    updates_duel: "▲ █ ▼ Battle your SaaS ideas · No auth required · Every vote counts ▲ █ ▼",
    loadingRanking: "Loading ranking...",
    language: "Language",
    advertise: "Advertise",
    back: "BACK",
    yourAdHere: "Your ad here",
    // Advertise page
    advertiseTitle: "Advertise Your SaaS on NextUnicorn",
    advertiseSubtitle: "Reach thousands of entrepreneurs and developers looking for their next project",
    currentSpot: "You are spot",
    activeAdv: "active advertiser",
    activeAdvPlural: "active advertisers",
    priceIncreases: "Price increases to",
    atSpot: "at spot",
    monthlySpot: "Monthly Spot",
    yearlySpot: "Yearly Spot",
    durationMonth: "1 month",
    durationYear: "12 months",
    rotatingSpot: "1 rotating spot",
    save: "Save",
    completeListingTitle: "Complete Your Listing",
    saasName: "SaaS Name",
    saasNamePlaceholder: "e.g. TaskFlow Pro",
    logoUrl: "Logo URL",
    logoUrlPlaceholder: "https://example.com/logo.png",
    targetUrl: "Target URL",
    targetUrlPlaceholder: "https://yourSaaS.com",
    email: "Email",
    emailPlaceholder: "you@example.com",
    payButton: "Pay with Stripe",
    processing: "Processing...",
    rotatingCard: "Rotating 3D card",
    clickTracking: "Click tracking",
    visibility: "visibility",
    featuresRotating: "Rotating 3D card",
    featuresClickTracking: "Click tracking",
    swipeVote: "vote",
    swipeNext: "next",
    sponsored: "sponsored",
    signature_line1: "The next unicorn embryo idea might be right here",
    signature_line2: "Fresh ideas every day. Let them battle",
  },
  fr: {
    title: "NextUnicorn",
    subtitle: "$ vos idées s'affrontent",
    loading: "Chargement des idées...",
    failed: "Échec du chargement des idées",
    battle: "BATAILLE",
    leaderboard: "CLASSEMENT",
    hallOfFame: "Hall of Fame",
    topIdeas: "$ meilleures idées par votes",
    ranking: "$ classement",
    noIdeas: "$ aucune idée votée. commencez à vous battre!",
    updates: "▲ █ ▼ Mises à jour en temps réel · Votez pour grimper ▲ █ ▼",
    subtitle_duel: "$ vos idées s'affrontent",
    updates_duel: "▲ █ ▼ Battaillez avec vos idées SaaS · Aucune auth · Chaque vote compte ▲ █ ▼",
    loadingRanking: "Chargement du classement...",
    language: "Langue",
    advertise: "Annoncez",
    back: "RETOUR",
    yourAdHere: "Votre publicité ici",
    // Advertise page
    advertiseTitle: "Annoncez Votre SaaS sur NextUnicorn",
    advertiseSubtitle: "Atteignez des milliers d'entrepreneurs et de développeurs cherchant leur prochain projet",
    currentSpot: "Vous êtes à la place",
    activeAdv: "annonceur actif",
    activeAdvPlural: "annonceurs actifs",
    priceIncreases: "Le prix augmente à",
    atSpot: "à la place",
    monthlySpot: "Annonce Mensuelle",
    yearlySpot: "Annonce Annuelle",
    durationMonth: "1 mois",
    durationYear: "12 mois",
    rotatingSpot: "1 annonce rotative",
    save: "Économisez",
    completeListingTitle: "Complétez Votre Annonce",
    saasName: "Nom du SaaS",
    saasNamePlaceholder: "ex. TaskFlow Pro",
    logoUrl: "URL du Logo",
    logoUrlPlaceholder: "https://example.com/logo.png",
    targetUrl: "URL Cible",
    targetUrlPlaceholder: "https://votresaas.com",
    email: "Email",
    emailPlaceholder: "vous@example.com",
    payButton: "Payer avec Stripe",
    processing: "Traitement...",
    rotatingCard: "Carte 3D rotative",
    clickTracking: "Suivi des clics",
    visibility: "de visibilité",
    featuresRotating: "Carte 3D rotative",
    featuresClickTracking: "Suivi des clics",
    swipeVote: "voter",
    swipeNext: "suivant",
    sponsored: "sponsorisée",
    signature_line1: "La prochaine idée embryon de licorne est peut-être là",
    signature_line2: "Nouvelles idées chaque jour. À vous de les faire s'affronter",
  },
  de: {
    title: "NextUnicorn",
    subtitle: "$ ihre ideen kämpfen",
    loading: "Ideen werden geladen...",
    failed: "Ideen konnten nicht geladen werden",
    battle: "KAMPF",
    leaderboard: "RANGLISTE",
    hallOfFame: "Ruhmeshalle",
    topIdeas: "$ beste ideen nach stimmen",
    ranking: "$ rangliste",
    noIdeas: "$ keine ideen noch abgestimmt. fangen sie an!",
    updates: "▲ █ ▼ Echtzeit-Updates · Abstimmen um aufzusteigen ▲ █ ▼",
    subtitle_duel: "$ ihre ideen kämpfen",
    updates_duel: "▲ █ ▼ Kämpfen Sie mit Ihren SaaS-Ideen · Keine Auth · Jede Stimme zählt ▲ █ ▼",
    loadingRanking: "Rangliste wird geladen...",
    language: "Sprache",
    advertise: "Werben",
    back: "ZURÜCK",
    yourAdHere: "Ihre Werbung hier",
    // Advertise page
    advertiseTitle: "Bewerben Sie Ihr SaaS auf NextUnicorn",
    advertiseSubtitle: "Erreichen Sie tausende von Unternehmern und Entwicklern, die ihr nächstes Projekt suchen",
    currentSpot: "Sie sind an Stelle",
    activeAdv: "aktiver Anzeigenkunde",
    activeAdvPlural: "aktive Anzeigenkunden",
    priceIncreases: "Preis erhöht sich auf",
    atSpot: "bei Stelle",
    monthlySpot: "Monatliche Anzeige",
    yearlySpot: "Jährliche Anzeige",
    durationMonth: "1 Monat",
    durationYear: "12 Monate",
    rotatingSpot: "1 rotierende Anzeige",
    save: "Sparen",
    completeListingTitle: "Füllen Sie Ihre Anzeige aus",
    saasName: "SaaS-Name",
    saasNamePlaceholder: "z.B. TaskFlow Pro",
    logoUrl: "Logo-URL",
    logoUrlPlaceholder: "https://example.com/logo.png",
    targetUrl: "Ziel-URL",
    targetUrlPlaceholder: "https://ihrSaaS.com",
    email: "Email",
    emailPlaceholder: "sie@example.com",
    payButton: "Mit Stripe bezahlen",
    processing: "Wird verarbeitet...",
    rotatingCard: "3D-Rotationskarte",
    clickTracking: "Klick-Verfolgung",
    visibility: "Sichtbarkeit",
    featuresRotating: "3D-Rotationskarte",
    featuresClickTracking: "Klick-Verfolgung",
    swipeVote: "abstimmen",
    swipeNext: "nächste",
    sponsored: "gesponsert",
    signature_line1: "Die nächste Unicorn-Embryo-Idee könnte hier sein",
    signature_line2: "Jeden Tag neue Ideen. Lass sie kämpfen",
  },
  es: {
    title: "NextUnicorn",
    subtitle: "$ tus ideas luchan",
    loading: "Cargando ideas...",
    failed: "Error al cargar ideas",
    battle: "BATALLA",
    leaderboard: "CLASIFICACIÓN",
    hallOfFame: "Galería de la fama",
    topIdeas: "$ mejores ideas por votos",
    ranking: "$ clasificación",
    noIdeas: "$ sin ideas votadas aún. ¡comienza a luchar!",
    updates: "▲ █ ▼ Actualizaciones en tiempo real · Vota para subir ▲ █ ▼",
    subtitle_duel: "$ tus ideas luchan",
    updates_duel: "▲ █ ▼ Lucha con tus ideas SaaS · Sin autenticación · Cada voto cuenta ▲ █ ▼",
    loadingRanking: "Cargando clasificación...",
    language: "Idioma",
    advertise: "Anunciar",
    back: "VOLVER",
    yourAdHere: "Su publicidad aquí",
    // Advertise page
    advertiseTitle: "Publicita Tu SaaS en NextUnicorn",
    advertiseSubtitle: "Alcanza a miles de emprendedores y desarrolladores buscando su próximo proyecto",
    currentSpot: "Eres el anuncio",
    activeAdv: "anunciante activo",
    activeAdvPlural: "anunciantes activos",
    priceIncreases: "El precio aumenta a",
    atSpot: "en el anuncio",
    monthlySpot: "Anuncio Mensual",
    yearlySpot: "Anuncio Anual",
    durationMonth: "1 mes",
    durationYear: "12 meses",
    rotatingSpot: "1 anuncio rotativo",
    save: "Ahorra",
    completeListingTitle: "Completa Tu Anuncio",
    saasName: "Nombre del SaaS",
    saasNamePlaceholder: "ej. TaskFlow Pro",
    logoUrl: "URL del Logo",
    logoUrlPlaceholder: "https://example.com/logo.png",
    targetUrl: "URL Destino",
    targetUrlPlaceholder: "https://tuSaaS.com",
    email: "Email",
    emailPlaceholder: "tu@example.com",
    payButton: "Pagar con Stripe",
    processing: "Procesando...",
    rotatingCard: "Tarjeta 3D rotativa",
    clickTracking: "Seguimiento de clics",
    visibility: "de visibilidad",
    featuresRotating: "Tarjeta 3D rotativa",
    featuresClickTracking: "Seguimiento de clics",
    swipeVote: "votar",
    swipeNext: "siguiente",
    sponsored: "patrocinado",
    signature_line1: "La próxima idea de unicornio embrionario podría estar aquí",
    signature_line2: "Ideas frescas cada día. Hazlas luchar",
  },
};

export function detectLanguage(): Language {
  if (typeof window === "undefined") return "en";
  
  const stored = localStorage.getItem("language");
  if (stored && ["en", "fr", "de", "es"].includes(stored)) {
    return stored as Language;
  }

  const browserLang = navigator.language.split("-")[0].toLowerCase();
  if (["en", "fr", "de", "es"].includes(browserLang)) {
    return browserLang as Language;
  }

  return "en";
}

export function t(key: string, lang: Language): string {
  return translations[lang][key as keyof typeof translations.en] || key;
}
