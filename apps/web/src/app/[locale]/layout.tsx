import { Locale, routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Layout Components
import { LeftRail } from '@/components/layout/LeftRail';
import { MegaMenu } from '@/components/layout/MegaMenu';
import { CustomCursor, PageTransition } from '@/components/ui';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        alternates: {
            canonical: `/${locale}`,
            languages: {
                tr: '/tr',
                en: '/en',
            },
        },
    };
}

export default async function LocaleLayout({ children, params }: Props) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as Locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for the locale
    const messages = await getMessages();

    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            {/* Custom Cursor */}
            <CustomCursor />

            {/* Left Rail Navigation */}
            <LeftRail />

            {/* Mega Menu Overlay */}
            <MegaMenu />

            {/* Main Content with Page Transition */}
            <PageTransition>
                <main className="main-content">
                    {children}
                </main>
            </PageTransition>
        </NextIntlClientProvider>
    );
}

