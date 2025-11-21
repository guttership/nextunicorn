import type { Metadata } from "next";
import { JetBrains_Mono, Clicker_Script } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL('https://nextunicorn.app'),
  title: {
    default: 'NextUnicorn - Unlimited SaaS Ideas for Entrepreneurs & Developers',
    template: '%s | NextUnicorn'
  },
  description: 'Daily AI-generated SaaS ideas for entrepreneurs and developers. Build your next profitable startup from our growing repository of validated, innovative project ideas. Free forever.',
  keywords: [
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
    'validated startup ideas'
  ],
  authors: [{ name: 'NextUnicorn Team' }],
  creator: 'NextUnicorn',
  publisher: 'NextUnicorn',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['fr_FR', 'de_DE', 'es_ES'],
    url: 'https://nextunicorn.app',
    title: 'NextUnicorn - Unlimited SaaS Ideas for Entrepreneurs & Developers',
    description: 'Daily AI-generated SaaS ideas repository. Perfect for entrepreneurs, developers, and indie hackers looking for their next profitable project.',
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
    title: 'NextUnicorn - Unlimited SaaS Ideas for Entrepreneurs & Developers',
    description: 'Daily AI-generated SaaS ideas repository. Find your next profitable project idea today.',
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
  verification: {
    google: 'your-google-verification-code',
  },
    alternates: {
    canonical: 'https://nextunicorn.app',
    languages: {
      'en-US': 'https://nextunicorn.app',
      'fr-FR': 'https://nextunicorn.app/fr',
      'de-DE': 'https://nextunicorn.app/de',
      'es-ES': 'https://nextunicorn.app/es',
    },
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
    url: 'https://nextunicorn.app',
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250'
    },
    author: {
      '@type': 'Organization',
      name: 'NextUnicorn'
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://nextunicorn.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Analytics */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
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
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
