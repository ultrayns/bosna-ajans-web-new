/**
 * Data Access Layer - JSON-based
 * Replaces Strapi CMS with local JSON file storage
 */

import { readData } from './admin/storage';

// ===== TYPE DEFINITIONS =====

export interface HomepageSection {
  id: string;
  __component: string;
  [key: string]: unknown;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client?: string;
  year?: number;
  categories?: { name: string; slug: string }[];
  subcategories?: string[];
  heroImage?: string;
  heroVideo?: string;
  shortIntro?: string;
  featured?: boolean;
  order?: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  fullDescription?: string;
  image?: string;
  video?: string;
  features?: string[];
  order?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: { id: string; name: string; slug: string }[];
  order?: number;
}

export interface Client {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  order?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  bio?: string;
  order?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  tags?: string[];
  author?: string;
  publishDate?: string;
  featured?: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  faviconUrl?: string;
  seo?: {
    title: string;
    description: string;
    keywords?: string;
    ogImage?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    googleMapsUrl?: string;
  };
  social: {
    instagram?: string;
    vimeo?: string;
    behance?: string;
    linkedin?: string;
    youtube?: string;
    tiktok?: string;
  };
  footer?: {
    copyright: string;
    privacyUrl?: string;
    termsUrl?: string;
  };
}

// ===== DATA ACCESS FUNCTIONS =====

/**
 * Get homepage sections for rendering
 */
export async function getHomepageSections(locale: string): Promise<HomepageSection[]> {
  try {
    const homepageData = await readData<{
      hero: {
        headline: string;
        subline: string;
        ctaPrimaryLabel: string;
        ctaPrimaryUrl: string;
        ctaSecondaryLabel?: string;
        ctaSecondaryUrl?: string;
        backgroundImages: string[];
        showreelUrl?: string;
      };
      manifesto: {
        content: string;
        linkLabel: string;
        linkUrl: string;
        backgroundImage: string;
      };
      capabilities: {
        title: string;
        items: Array<{ title: string; description: string; image: string; slug: string }>;
      };
      process: {
        title: string;
        steps: Array<{ title: string; description: string }>;
      };
      ctaFooter: {
        headline: string;
        showEmail: boolean;
        showSocials: boolean;
      };
    }>('homepage');

    // Transform to section format
    const sections: HomepageSection[] = [
      {
        id: '1',
        __component: 'sections.hero-showreel',
        ...homepageData.hero,
      },
      {
        id: '2',
        __component: 'sections.featured-works',
        title: locale === 'en' ? 'Selected Works' : 'Seçili Çalışmalar',
      },
      {
        id: '3',
        __component: 'sections.capabilities',
        ...homepageData.capabilities,
      },
      {
        id: '4',
        __component: 'sections.manifesto',
        ...homepageData.manifesto,
      },
      {
        id: '5',
        __component: 'sections.clients-logos',
        title: locale === 'en' ? 'Trusted By' : 'Referanslarımız',
      },
      {
        id: '6',
        __component: 'sections.process',
        ...homepageData.process,
      },
      {
        id: '7',
        __component: 'sections.cta-footer',
        ...homepageData.ctaFooter,
      },
    ];

    return sections;
  } catch (error) {
    console.error('Error loading homepage data:', error);
    return getDefaultSections(locale);
  }
}

/**
 * Fallback default sections
 */
function getDefaultSections(locale: string): HomepageSection[] {
  const isEn = locale === 'en';
  return [
    {
      id: '1',
      __component: 'sections.hero-showreel',
      headline: isEn ? 'Visual Storytelling' : 'Görsel hikaye anlatımı',
      subline: isEn ? 'Professional Production Studio' : 'Profesyonel Prodüksiyon Stüdyosu',
      ctaPrimaryLabel: isEn ? 'View Portfolio' : 'Portfolyo',
      ctaPrimaryUrl: '/portfolio',
      backgroundImages: [],
    },
    {
      id: '2',
      __component: 'sections.cta-footer',
      headline: isEn ? "Let's create together" : 'Birlikte yaratalım',
    },
  ];
}

/**
 * Get all projects
 */
export async function getProjects(locale?: string): Promise<Project[]> {
  try {
    const projectsData = await readData<{ projects: any[] }>('projects');
    const categoriesData = await readData<{ categories: { id: string; name: string; slug: string }[] }>('categories');
    
    const categoryMap = new Map(
      (categoriesData.categories || []).map(cat => [cat.id, { name: cat.name, slug: cat.slug }])
    );
    
    // Map categoryIds to categories objects
    const projects = (projectsData.projects || []).map(project => ({
      ...project,
      client: typeof project.client === 'string' 
        ? { name: project.client } 
        : project.client || { name: '' },
      categories: (project.categoryIds || [])
        .map((id: string) => categoryMap.get(id))
        .filter(Boolean),
    }));
    
    return projects;
  } catch {
    console.error('Error loading projects');
    return [];
  }
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(locale?: string): Promise<Project[]> {
  const projects = await getProjects(locale);
  return projects.filter(p => p.featured).sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Get project by slug
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find(p => p.slug === slug) || null;
}

/**
 * Get all services
 */
export async function getServices(locale?: string): Promise<Service[]> {
  try {
    const data = await readData<{ services: Service[] }>('services');
    return (data.services || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch {
    console.error('Error loading services');
    return [];
  }
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const services = await getServices();
  return services.find(s => s.slug === slug) || null;
}

/**
 * Get all categories
 */
export async function getCategories(locale?: string): Promise<Category[]> {
  try {
    const data = await readData<{ categories: Category[] }>('categories');
    return (data.categories || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch {
    console.error('Error loading categories');
    return [];
  }
}

/**
 * Get project years for filtering
 */
export async function getProjectYears(): Promise<number[]> {
  const projects = await getProjects();
  const yearsSet = new Set(projects.map(p => p.year).filter((y): y is number => !!y));
  const years = Array.from(yearsSet);
  return years.sort((a, b) => b - a);
}

/**
 * Get all clients
 */
export async function getClients(): Promise<Client[]> {
  try {
    const data = await readData<{ clients: Client[] }>('clients');
    return (data.clients || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch {
    console.error('Error loading clients');
    return [];
  }
}

/**
 * Get team members
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const data = await readData<{ team: TeamMember[] }>('team');
    return (data.team || []).sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch {
    console.error('Error loading team');
    return [];
  }
}

/**
 * Get blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const data = await readData<{ posts: BlogPost[] }>('blog');
    return data.posts || [];
  } catch {
    console.error('Error loading blog posts');
    return [];
  }
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find(p => p.slug === slug) || null;
}

/**
 * Get site settings
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await readData<SiteSettings>('site-settings');
  } catch {
    console.error('Error loading site settings');
    return null;
  }
}

/**
 * Submit lead/contact form
 */
export async function submitLead(data: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
}): Promise<boolean> {
  try {
    // For now, just log the lead - can be extended to save to JSON or send email
    console.log('Lead submitted:', data);
    return true;
  } catch {
    console.error('Error submitting lead');
    return false;
  }
}
