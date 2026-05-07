import { MetadataRoute } from 'next';

import { IdeaStatus } from '@prisma/client';

import { prisma } from '@/app/lib/db/prisma';
import { buildIdeaSlug } from '@/app/lib/idea-slugs';
import { absoluteUrl } from '@/app/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  const ideas = await prisma.idea.findMany({
    where: {
      isReserved: false,
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
      generatedAt: true,
    },
    orderBy: [{ rankingScore: 'desc' }, { createdAt: 'desc' }],
  });

  const ideaPages: MetadataRoute.Sitemap = ideas.map((idea) => ({
    url: absoluteUrl(`/startup-ideas/${buildIdeaSlug({ id: idea.id, title: idea.title })}`),
    lastModified: idea.generatedAt ?? idea.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: absoluteUrl('/leaderboard'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/startup-ideas'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: absoluteUrl('/trending-startup-ideas'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/micro-saas-ideas'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/ai-saas-ideas'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/micro-saas-ideas-for-developers'),
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/advertise'),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/about'),
      lastModified: new Date('2025-12-04'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/contact'),
      lastModified: new Date('2025-12-04'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/blog'),
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/blog/50-idees-saas-developpeurs-2025'),
      lastModified: new Date('2025-11-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/comment-trouver-idee-business-profitable'),
      lastModified: new Date('2025-11-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/how-to-find-next-unicorn-startup-idea'),
      lastModified: new Date('2025-12-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/micro-saas-bootstrappers-guide'),
      lastModified: new Date('2025-11-17'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/micro-saas-bootstrappers-guide-en'),
      lastModified: new Date('2025-11-17'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/micro-saas-bootstrappers-guide-de'),
      lastModified: new Date('2025-11-17'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/micro-saas-bootstrappers-guide-es'),
      lastModified: new Date('2025-11-17'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/50-saas-ideas-developers-2025'),
      lastModified: new Date('2025-11-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/blog/how-to-find-profitable-business-idea'),
      lastModified: new Date('2025-11-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: absoluteUrl('/terms'),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/cgu'),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/confidentialite'),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/mentions'),
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  return [...staticPages, ...ideaPages];
}
