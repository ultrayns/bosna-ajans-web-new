import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bosnaajans.com';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'BOSNAAJANS | Fashion-grade Production for Brands & Music',
    template: '%s | BOSNAAJANS',
  },
  description: 'Premium film production, fashion photography, and creative direction studio based in Istanbul. We craft visual stories that move people.',
  keywords: [
    'film production istanbul',
    'fashion photography',
    'commercial production',
    'creative direction',
    'brand films',
    'music videos',
    'post production',
    'video production turkey',
  ],
  authors: [{ name: 'BOSNAAJANS' }],
  creator: 'BOSNAAJANS',
  publisher: 'BOSNAAJANS',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    alternateLocale: 'en_US',
    url: siteUrl,
    siteName: 'BOSNAAJANS',
    title: 'BOSNAAJANS | Fashion-grade Production for Brands & Music',
    description: 'Premium film production, fashion photography, and creative direction studio based in Istanbul.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BOSNAAJANS - Fashion-grade Production',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOSNAAJANS | Fashion-grade Production',
    description: 'Premium film production and creative direction studio based in Istanbul.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export function generateJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BOSNAAJANS',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Premium film production, fashion photography, and creative direction studio based in Istanbul.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Istanbul',
      addressCountry: 'TR',
    },
    sameAs: [
      'https://instagram.com/bosnaajans',
      'https://vimeo.com/bosnaajans',
      'https://behance.net/bosnaajans',
    ],
  };
}
