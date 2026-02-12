/**
 * Admin Storage Utility - JSON file read/write operations
 */
import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src', 'lib', 'data');

export type DataFile = 
  | 'site-settings'
  | 'categories'
  | 'projects'
  | 'services'
  | 'clients'
  | 'team'
  | 'homepage'
  | 'menu'
  | 'featured-works'
  | 'portfolio-slider'
  | 'blog'
  | 'gallery'
  | 'services-slider'
  | 'digital-services'
  | 'legal'
  | 'about';

/**
 * Read JSON data from file
 */
export async function readData<T>(fileName: DataFile): Promise<T> {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  console.log(`Reading file: ${filePath}`);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${fileName}.json at ${filePath}:`, error);
    throw new Error(`Failed to read ${fileName} data`);
  }
}

/**
 * Write JSON data to file
 */
export async function writeData<T>(fileName: DataFile, data: T): Promise<void> {
  const filePath = path.join(DATA_DIR, `${fileName}.json`);
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${fileName}.json:`, error);
    throw new Error(`Failed to write ${fileName} data`);
  }
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

// Type definitions for data structures
export interface SiteSettings {
  brandName: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  seo: {
    title: string;
    description: string;
    keywords: string;
    ogImage: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    googleMapsUrl: string;
  };
  social: {
    instagram: string;
    vimeo: string;
    behance: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
  footer: {
    copyright: string;
    privacyUrl: string;
    termsUrl: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  image: string;
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentSlug: string;
  order: number;
}

export interface CategoriesData {
  categories: Category[];
  subcategories: Subcategory[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  client: string;
  year: number;
  categoryIds: string[];
  subcategoryIds: string[];
  heroPoster: string;
  heroVideo: string;
  shortIntro: string;
  isFeatured: boolean;
  order: number;
}

export interface ProjectsData {
  projects: Project[];
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  video: string;
  features: string[];
  order: number;
}

export interface ServicesData {
  services: Service[];
}

export interface Client {
  id: string;
  name: string;
  logo: string;
  website: string;
  order: number;
}

export interface ClientsData {
  clients: Client[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string;
  bio: string;
  order: number;
}

export interface Award {
  id: string;
  title: string;
  year: number;
  type: 'award' | 'press';
  order: number;
}

export interface TeamData {
  team: TeamMember[];
  awards: Award[];
}

export interface MenuItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isExternal: boolean;
  children?: MenuItem[];
}

export interface MenuData {
  mainMenu: MenuItem[];
  footerMenu: MenuItem[];
}

export interface HomepageData {
  hero: {
    headline: string;
    subline: string;
    ctaPrimaryLabel: string;
    ctaPrimaryUrl: string;
    ctaSecondaryLabel: string;
    ctaSecondaryUrl: string;
    backgroundImages: string[];
    showreelUrl: string;
  };
  manifesto: {
    content: string;
    linkLabel: string;
    linkUrl: string;
    backgroundImage: string;
  };
  capabilities: {
    title: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
      slug: string;
    }>;
  };
  process: {
    title: string;
    steps: Array<{
      title: string;
      description: string;
    }>;
  };
  ctaFooter: {
    headline: string;
    showEmail: boolean;
    showSocials: boolean;
  };
}
