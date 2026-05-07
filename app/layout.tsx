import type { Metadata } from "next";
import { JetBrains_Mono, Clicker_Script } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { PostHogProvider } from "./components/posthog-provider";
import { PostHogPageView } from "./components/posthog-pageview";
import { GoogleAnalytics } from "./components/google-analytics";
import { SITE_URL, absoluteUrl } from "@/app/lib/seo";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const clickerScript = Clicker_Script({
  variable: "--font-clicker",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'NextUnicorn - Find Your Next Unicorn Startup Idea | SaaS Ideas for Developers',
    template: '%s | NextUnicorn'
  },
  description: 'Discover your next unicorn startup idea with daily AI-generated SaaS concepts. Build the next unicorn app from our repository of validated, profitable business ideas for developers and entrepreneurs. Free forever.',
  keywords: [
    'next unicorn',
    'next unicorn startup',
    'next unicorn app',
    'next unicorn saas ideas',
    'find next unicorn idea',
    'next unicorn business ideas',
    'SaaS ideas for developers',
    'startup ideas for entrepreneurs',
    'side project ideas',
    'micro SaaS ideas',
    'app ideas repository',
    'profitable SaaS ideas',
    'developer project ideas',
    'entrepreneur ideas',
    'indie hacker ideas',
    'build in public ideas',
    'MVP ideas',
    'weekend project ideas',
    'bootstrapped startup ideas',
    'solo developer ideas',
    'maker ideas',
    'tech startup ideas',
    'AI generated business ideas',
    'validated startup ideas',
    'unicorn startup ideas'
  ],
  authors: [{ name: 'NextUnicorn Team' }],
  creator: 'NextUnicorn',
  publisher: 'NextUnicorn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'de_DE', 'es_ES'],
    url: 'https://nextunicorn.app',
    title: 'NextUnicorn - Find Your Next Unicorn Startup Idea | SaaS Ideas',
    description: 'Discover your next unicorn startup with daily AI-generated SaaS ideas. Build the next unicorn app from validated, profitable business ideas for developers and entrepreneurs.',
    siteName: 'NextUnicorn',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NextUnicorn - SaaS Ideas Repository for Entrepreneurs'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextUnicorn - Find Your Next Unicorn Startup Idea',
    description: 'Discover your next unicorn startup with daily AI-generated SaaS ideas. Build the next unicorn app today.',
    images: ['/og-image.png'],
    creator: '@nextunicorn'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: absoluteUrl('/'),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'NextUnicorn',
    applicationCategory: 'BusinessApplication',
    description: 'Free repository of AI-generated SaaS ideas for entrepreneurs, developers, and indie hackers. Discover validated startup ideas daily.',
    url: absoluteUrl('/'),
    operatingSystem: 'Any',
    audience: {
      '@type': 'Audience',
      audienceType: ['Entrepreneurs', 'Software Developers', 'Indie Hackers', 'Startup Founders']
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free unlimited access to AI-generated SaaS ideas'
    },
    author: {
      '@type': 'Organization',
      name: 'NextUnicorn'
    }
  };

  return (
    <html lang="en" className="dark">
      <head>

        {/* Google AdSense */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
          crossOrigin="anonymous"
        ></script>
        {/* Schema.org JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${jetbrainsMono.variable} ${clickerScript.variable} antialiased bg-slate-950 text-slate-100`}
      >
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
        <SpeedInsights />
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
