import { MetadataRoute } from 'next';

import { absoluteUrl } from '@/app/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/ingest/', '/reservation/success', '/advertise/success'],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
