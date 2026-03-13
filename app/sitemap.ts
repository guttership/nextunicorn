import { MetadataRoute } from 'next';

import { IdeaStatus } from '@prisma/client';

import { prisma } from '@/app/lib/db/prisma';
import { buildIdeaSlug } from '@/app/lib/idea-slugs';

const IDEAS_PER_SITEMAP = 1000;

export async function generateSitemaps() {
  const totalIdeas = await prisma.idea.count({
    where: {
      isReserved: false,
      status: { in: [IdeaStatus.ACTIVE, IdeaStatus.TRENDING, IdeaStatus.ARCHIVED] },
    },
  });

  const pages = Math.max(1, Math.ceil(totalIdeas / IDEAS_PER_SITEMAP));
  return Array.from({ length: pages }, (_, id) => ({ id }));
}

export default async function sitemap(
  props: { id?: number | string } = {}
): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nextunicorn.app';
  const currentDate = new Date();
  const numericId = Number(props.id ?? 0) || 0;

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
    skip: numericId * IDEAS_PER_SITEMAP,
    take: IDEAS_PER_SITEMAP,
  });

  const ideaPages: MetadataRoute.Sitemap = ideas.map((idea) => ({
    url: `${baseUrl}/startup-ideas/${buildIdeaSlug({ id: idea.id, title: idea.title })}`,
    lastModified: idea.generatedAt ?? idea.createdAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const staticPages: MetadataRoute.Sitemap = numericId === 0 ? [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/leaderboard`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/startup-ideas`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/trending-startup-ideas`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/micro-saas-ideas`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ai-saas-ideas`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/micro-saas-ideas-for-developers`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/advertise`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2025-12-04'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date('2025-12-04'),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog/50-idees-saas-developpeurs-2025`,
      lastModified: new Date('2025-11-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/comment-trouver-idee-business-profitable`,
      lastModified: new Date('2025-11-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/micro-saas-bootstrappers-guide`,
      lastModified: new Date('2025-11-17'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/50-saas-ideas-developers-2025`,
      lastModified: new Date('2025-11-19'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/how-to-find-profitable-business-idea`,
      lastModified: new Date('2025-11-18'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cgu`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/confidentialite`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ] : [];

  return [...staticPages, ...ideaPages];
}
