import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Micro-SaaS for Bootstrappers: Complete Guide 2025",
  description: "How to launch a profitable micro-SaaS without raising funds or a team. Complete playbook from 0 to $5k MRR solo. B2B strategies, pricing, distribution.",
  alternates: {
    canonical: "https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-en",
    languages: {
      'fr': '/blog/micro-saas-bootstrappers-guide',
      'en': '/blog/micro-saas-bootstrappers-guide-en',
    }
  },
  openGraph: {
    title: "Micro-SaaS for Bootstrappers: Complete Guide",
    description: "Complete playbook to launch a profitable micro-SaaS solo. B2B strategies, pricing, and distribution tactics.",
    url: "https://nextunicorn.app/blog/micro-saas-bootstrappers-guide-en",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
