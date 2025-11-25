import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Micro-SaaS para Bootstrappers: La Guía Completa',
  description: 'Cómo lanzar un micro-SaaS rentable sin recaudar fondos, sin equipo y sin sacrificar tu salud mental. Playbook completo para ir de 0 a 5k€ MRR en solitario.',
  alternates: {
    canonical: 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-es',
    languages: {
      'fr-FR': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide',
      'en-US': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-en',
      'de-DE': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-de',
      'es-ES': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-es',
    },
  },
  openGraph: {
    title: 'Micro-SaaS para Bootstrappers: La Guía Completa',
    description: 'Cómo lanzar un micro-SaaS rentable sin recaudar fondos, sin equipo y sin sacrificar tu salud mental.',
    url: 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-es',
    locale: 'es_ES',
    alternateLocale: ['fr_FR', 'en_US', 'de_DE'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
