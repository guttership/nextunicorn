import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Idées de SaaS et Business pour Entrepreneurs",
  description: "Guides pratiques, idées de SaaS et stratégies pour entrepreneurs et développeurs. Trouvez l'inspiration pour votre prochain projet rentable.",
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
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
