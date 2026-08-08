import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://casaplus.ro';
  const staticRoutes = ['', '/properties', '/about', '/contact', '/legal/privacy', '/legal/cookies', '/legal/terms', '/legal/gdpr', '/legal/anpc', '/legal/sol'];
  const now = new Date();
  return staticRoutes.map(r => ({ url: `${base}${r}`, lastModified: now }));
}
