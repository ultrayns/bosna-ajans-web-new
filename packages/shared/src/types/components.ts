/**
 * Component Section Types
 */

export interface HeroShowreelSection {
  __component: 'sections.hero-showreel';
  headline: string;
  subhead?: string;
  videoUrl?: string;
  videoPoster?: string;
  ctaPrimaryLabel?: string;
  ctaPrimaryUrl?: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  showScrollIndicator?: boolean;
}

export interface FeaturedWorksSection {
  __component: 'sections.featured-works';
  title?: string;
  selectionMode: 'manual' | 'auto';
  limit?: number;
  layoutVariant: 'grid' | 'masonry' | 'carousel';
  projects?: Array<{
    id: string;
    title: string;
    slug: string;
    client: { name: string };
    year: number;
    categories: Array<{ name: string; slug: string }>;
    heroPoster?: string;
  }>;
}

export interface CapabilitiesSection {
  __component: 'sections.capabilities';
  title?: string;
  items: Array<{
    title: string;
    description?: string;
  }>;
}

export interface ManifestoSection {
  __component: 'sections.manifesto';
  content: string;
  linkLabel?: string;
  linkUrl?: string;
}

export interface ClientsLogosSection {
  __component: 'sections.clients-logos';
  title?: string;
  clients: Array<{
    name: string;
    logo?: string;
  }>;
}

export interface AwardsPressSection {
  __component: 'sections.awards-press';
  title?: string;
  awards: Array<{
    title: string;
    year: number;
    type: 'award' | 'press';
  }>;
}

export interface ProcessSection {
  __component: 'sections.process';
  title?: string;
  steps: Array<{
    title: string;
    description?: string;
  }>;
}

export interface StudioTeamSection {
  __component: 'sections.studio-team';
  title?: string;
  teamMembers: Array<{
    name: string;
    role?: string;
    photo?: string;
  }>;
}

export interface CTAFooterSection {
  __component: 'sections.cta-footer';
  headline?: string;
  showEmail?: boolean;
  showSocials?: boolean;
  showContactForm?: boolean;
}

export type HomepageSection =
  | HeroShowreelSection
  | FeaturedWorksSection
  | CapabilitiesSection
  | ManifestoSection
  | ClientsLogosSection
  | AwardsPressSection
  | ProcessSection
  | StudioTeamSection
  | CTAFooterSection;

/**
 * Case Study Block Types
 */

export interface VideoBlock {
  __component: 'blocks.video-block';
  videoUrl?: string;
  caption?: string;
  autoPlay?: boolean;
  loop?: boolean;
}

export interface ImageBlock {
  __component: 'blocks.image-block';
  imageUrl?: string;
  alt?: string;
  caption?: string;
  layout?: 'contained' | 'full-bleed' | 'wide';
}

export interface TextBlock {
  __component: 'blocks.text-block';
  content: string;
  alignment?: 'left' | 'center';
}

export interface SplitBlock {
  __component: 'blocks.split-block';
  content: string;
  imageUrl?: string;
  layout?: 'media-left' | 'media-right';
}

export interface GalleryBlock {
  __component: 'blocks.gallery-block';
  images?: Array<{ url: string; alt?: string }>;
  columns?: 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
}

export interface QuoteBlock {
  __component: 'blocks.quote-block';
  quote: string;
  author?: string;
  role?: string;
}

export interface CreditsBlock {
  __component: 'blocks.credits-block';
  credits?: Array<{ role: string; name: string }>;
}

export interface BTSStripBlock {
  __component: 'blocks.bts-strip';
  images?: Array<{ url: string; alt?: string }>;
}

export type CaseStudyBlock =
  | VideoBlock
  | ImageBlock
  | TextBlock
  | SplitBlock
  | GalleryBlock
  | QuoteBlock
  | CreditsBlock
  | BTSStripBlock;
