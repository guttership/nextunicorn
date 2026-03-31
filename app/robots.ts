import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/reservation/success'],
      },
    ],
    sitemap: 'https://nextunicorn.app/sitemap.xml',
  };
}
