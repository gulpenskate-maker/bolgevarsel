import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/hjelp', '/varsel', '/personvern', '/registrer'],
        disallow: ['/admin', '/min-side', '/logg-inn', '/logg-ut', '/velkommen', '/api/'],
      },
    ],
    sitemap: 'https://bolgevarsel.no/sitemap.xml',
  }
}
