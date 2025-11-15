import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'NextUnicorn - SaaS Ideas for Entrepreneurs',
    short_name: 'NextUnicorn',
    description: 'Daily AI-generated SaaS ideas repository for entrepreneurs and developers',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
