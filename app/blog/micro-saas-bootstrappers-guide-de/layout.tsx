import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Micro-SaaS für Bootstrapper: Der komplette Leitfaden',
  description: 'Wie man ein profitables Micro-SaaS ohne Fundraising, ohne Team und ohne seine mentale Gesundheit zu opfern launcht. Komplettes Playbook um solo von 0 auf 5k€ MRR zu kommen.',
  alternates: {
    canonical: 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-de',
    languages: {
      'fr-FR': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide',
      'en-US': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-en',
      'de-DE': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-de',
      'es-ES': 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-es',
    },
  },
  openGraph: {
    title: 'Micro-SaaS für Bootstrapper: Der komplette Leitfaden',
    description: 'Wie man ein profitables Micro-SaaS ohne Fundraising, ohne Team und ohne seine mentale Gesundheit zu opfern launcht.',
    url: 'https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-de',
    locale: 'de_DE',
    alternateLocale: ['fr_FR', 'en_US', 'es_ES'],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
