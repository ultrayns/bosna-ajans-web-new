import { defineRouting } from 'next-intl/routing';

export type Locale = 'tr' | 'en';

export const routing = defineRouting({
  locales: ['tr', 'en'] as const,
  defaultLocale: 'tr',
  localePrefix: 'always',
});
