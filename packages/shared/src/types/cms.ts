/**
 * Strapi API Response Types
 */

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: StrapiPagination;
  };
}

export interface StrapiPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
}

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

/**
 * CMS Content Types
 */

export interface SiteSettings {
  brandName: string;
  tagline?: string;
  contactEmail: string;
  contactPhone?: string;
  address?: string;
  socialInstagram?: string;
  socialVimeo?: string;
  socialBehance?: string;
  socialLinkedin?: string;
  logo?: StrapiMedia;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
}

export interface Navigation {
  mainMenu: MenuItem[];
  footerMenu?: MenuItem[];
  footerContactTitle?: string;
  footerContactEmail?: string;
}

export interface MenuItem {
  id: number;
  label: string;
  url?: string;
  page?: { slug: string };
  order: number;
  children?: MenuItemChild[];
}

export interface MenuItemChild {
  id: number;
  label: string;
  url?: string;
  page?: { slug: string };
  order: number;
}

export interface Page {
  id: number;
  title: string;
  slug: string;
  seoTitle?: string;
  seoDescription?: string;
  sections: Section[];
  locale: string;
}

export interface Section {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  client: Client;
  year: number;
  categories: Category[];
  subcategories?: SubCategory[];
  tags?: Tag[];
  services?: Service[];
  heroPoster?: StrapiMedia;
  heroVideo?: StrapiMedia;
  shortIntro: string;
  fullDescription?: string;
  isFeatured: boolean;
  blocks: CaseBlock[];
  credits?: ProjectCredit[];
  seoTitle?: string;
  seoDescription?: string;
  locale: string;
}

export interface ProjectCredit {
  role: string;
  name: string;
}

export interface CaseBlock {
  __component: string;
  id: number;
  [key: string]: unknown;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface SubCategory {
  id: number;
  name: string;
  slug: string;
  category: Category;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Service {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  icon?: StrapiMedia;
  features?: string[];
  order: number;
  seoTitle?: string;
  seoDescription?: string;
  locale: string;
}

export interface Client {
  id: number;
  name: string;
  slug: string;
  logo?: StrapiMedia;
  website?: string;
  isFeatured: boolean;
}

export interface Award {
  id: number;
  title: string;
  year: number;
  type: 'award' | 'press';
  organization?: string;
  project?: Project;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio?: string;
  photo?: StrapiMedia;
  order: number;
  socialLinkedin?: string;
  socialInstagram?: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  createdAt: string;
}
