import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Micro-SaaS pour Bootstrappers : Guide Complet 2025",
  description: "Comment lancer un micro-SaaS rentable sans lever de fonds ni équipe. Playbook complet de 0 à 5k€ MRR en solo. Stratégies B2B, pricing, distribution.",
  alternates: {
    canonical: "https://nextunicorn.app/blog/micro-saas-bootstrappers-guide",
    languages: {
      'fr': '/blog/micro-saas-bootstrappers-guide',
      'en': '/blog/micro-saas-bootstrappers-guide-en',
    }
  },
  openGraph: {
    title: "Micro-SaaS pour Bootstrappers : Guide Complet",
    description: "Playbook complet pour lancer un micro-SaaS rentable en solo. Stratégies B2B, pricing et tactiques de distribution.",
    url: "https://nextunicorn.app/blog/micro-saas-bootstrappers-guide",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
