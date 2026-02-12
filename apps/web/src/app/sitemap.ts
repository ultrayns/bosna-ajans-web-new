import { getProjects, getServices } from '@/lib/strapi';
import { MetadataRoute } from 'next';

type ChangeFrequency = 'weekly' | 'monthly' | 'always' | 'hourly' | 'daily' | 'yearly' | 'never';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bosnaajans.com';
  const locales = ['tr', 'en'];
  
  // Fetch data from API
  const [{ projects }, services] = await Promise.all([
    getProjects({ pageSize: 100 }),
    getServices(),
  ]);
  
  // Static pages
  const staticPages = ['', '/portfolio', '/services', '/contact'];
  
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: (page === '' ? 'weekly' : 'monthly') as ChangeFrequency,
      priority: page === '' ? 1 : 0.8,
    }))
  );
  
  // Project pages
  const projectEntries = locales.flatMap((locale) =>
    projects.map((project) => ({
      url: `${baseUrl}/${locale}/portfolio/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.6,
    }))
  );
  
  // Service pages
  const serviceEntries = locales.flatMap((locale) =>
    services.map((service) => ({
      url: `${baseUrl}/${locale}/services/${service.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as ChangeFrequency,
      priority: 0.7,
    }))
  );
  
  return [...staticEntries, ...projectEntries, ...serviceEntries];
}
