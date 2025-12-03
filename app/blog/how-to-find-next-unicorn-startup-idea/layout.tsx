import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'How to Find the Next Unicorn Startup Idea in 2025',
  description: 'Discover the proven framework to find your next unicorn startup idea. Learn how successful entrepreneurs identify billion-dollar opportunities before anyone else. Find the next unicorn app today.',
  keywords: [
    'next unicorn',
    'next unicorn startup',
    'next unicorn idea',
    'next unicorn app',
    'find next unicorn',
    'unicorn startup ideas',
    'billion dollar startup ideas',
    'startup ideas 2025',
    'how to find unicorn ideas',
    'next big startup idea',
    'startup trends 2025',
    'entrepreneurship ideas',
    'startup validation',
    'emerging market opportunities'
  ],
  alternates: {
    canonical: 'https://nextunicorn.app/blog/how-to-find-next-unicorn-startup-idea',
  },
  openGraph: {
    title: 'How to Find the Next Unicorn Startup Idea in 2025',
    description: 'Discover the proven framework to find your next unicorn startup idea. Learn how successful entrepreneurs identify billion-dollar opportunities.',
    url: 'https://nextunicorn.app/blog/how-to-find-next-unicorn-startup-idea',
    locale: 'en_US',
    type: 'article',
    publishedTime: '2025-11-25T00:00:00Z',
    authors: ['NextUnicorn Team'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Find the Next Unicorn Startup Idea in 2025',
    description: 'Discover the proven framework to find your next unicorn startup idea.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
