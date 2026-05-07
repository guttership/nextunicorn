import { Metadata } from "next";

import { absoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Blog - Idées de SaaS et Business pour Entrepreneurs",
  description: "Guides pratiques, idées de SaaS et stratégies pour entrepreneurs et développeurs. Trouvez l'inspiration pour votre prochain projet rentable.",
  alternates: {
    canonical: absoluteUrl('/blog'),
  },
  keywords: [
    "idées de business",
    "idées de saas",
    "monter un saas",
    "idées pour développeurs",
    "micro saas",
    "startup ideas",
    "business ideas 2025",
    "saas ideas for developers",
    "profitable saas ideas",
    "side project ideas",
    "bootstrapped startup",
    "indie hacker",
  ],
  openGraph: {
    title: "Blog NextUnicorn - Idées de SaaS et Stratégies pour Entrepreneurs",
    description: "Guides, listes d'idées validées et stratégies pour réussir votre projet SaaS",
    url: absoluteUrl('/blog'),
    siteName: "NextUnicorn",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NextUnicorn Blog - Idées de SaaS pour Entrepreneurs",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog NextUnicorn - Idées de SaaS et Stratégies",
    description: "Guides pratiques et listes d'idées validées pour réussir votre projet SaaS",
    images: ["/og-image.png"],
    creator: "@nextunicorn",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1944732612792038"
        crossOrigin="anonymous"
      ></script>
      {children}
    </>
  );
}
