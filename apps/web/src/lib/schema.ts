import { Metadata } from 'next';

interface SchemaOrgProps {
  type: 'Organization' | 'WebSite' | 'WebPage' | 'CreativeWork' | 'Service' | 'Article';
  data: Record<string, unknown>;
}

/**
 * Generate Schema.org JSON-LD structured data
 */
export function generateSchemaOrg({ type, data }: SchemaOrgProps): object {
  const baseContext = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  return { ...baseContext, ...data };
}

/**
 * Organization schema for BOSNAAJANS
 */
export function getOrganizationSchema() {
  return generateSchemaOrg({
    type: 'Organization',
    data: {
      name: 'BOSNAAJANS',
      url: 'https://bosnaajans.com',
      logo: 'https://bosnaajans.com/logo.png',
      description: 'Fashion-grade video production, photography, and creative direction agency based in Istanbul.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Istanbul',
        addressCountry: 'TR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+90-555-123-4567',
        contactType: 'customer service',
        email: 'info@bosnaajans.com',
        availableLanguage: ['Turkish', 'English'],
      },
      sameAs: [
        'https://instagram.com/bosnaajans',
        'https://vimeo.com/bosnaajans',
        'https://behance.net/bosnaajans',
        'https://youtube.com/@bosnaajans',
      ],
    },
  });
}

/**
 * WebSite schema
 */
export function getWebSiteSchema() {
  return generateSchemaOrg({
    type: 'WebSite',
    data: {
      name: 'BOSNAAJANS',
      url: 'https://bosnaajans.com',
      description: 'Fashion-grade video production and photography agency',
      publisher: {
        '@type': 'Organization',
        name: 'BOSNAAJANS',
      },
      inLanguage: ['tr', 'en'],
    },
  });
}

/**
 * Creative Work schema for projects/portfolio items
 */
export function getProjectSchema(project: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  client?: string;
  categories?: string[];
}) {
  return generateSchemaOrg({
    type: 'CreativeWork',
    data: {
      name: project.title,
      description: project.description,
      url: project.url,
      image: project.image,
      datePublished: project.datePublished,
      creator: {
        '@type': 'Organization',
        name: 'BOSNAAJANS',
      },
      ...(project.client && {
        sourceOrganization: {
          '@type': 'Organization',
          name: project.client,
        },
      }),
      ...(project.categories && {
        genre: project.categories,
      }),
    },
  });
}

/**
 * Service schema
 */
export function getServiceSchema(service: {
  name: string;
  description: string;
  url: string;
}) {
  return generateSchemaOrg({
    type: 'Service',
    data: {
      name: service.name,
      description: service.description,
      url: service.url,
      provider: {
        '@type': 'Organization',
        name: 'BOSNAAJANS',
      },
      areaServed: {
        '@type': 'Country',
        name: 'Turkey',
      },
    },
  });
}

/**
 * Breadcrumb schema
 */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * JSON-LD Script string generator
 * Returns a string that can be used with dangerouslySetInnerHTML
 */
export function getJsonLdScript(data: object | object[]): string {
  const jsonLd = Array.isArray(data) ? data : [data];
  return JSON.stringify(jsonLd);
}

/**
 * Generate complete page metadata with Schema.org
 */
export function generatePageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bosnaajans.com';
  const url = `${siteUrl}${path}`;
  const imageUrl = image || `${siteUrl}/og-image.jpg`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'BOSNAAJANS',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      locale: 'tr_TR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
      languages: {
        'tr-TR': `${siteUrl}/tr${path}`,
        'en-US': `${siteUrl}/en${path}`,
      },
    },
  };
}
