import { SectionRenderer } from '@/components/sections';
import { getHomepageSections } from '@/lib/strapi';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const sections = await getHomepageSections(locale);

    return (
        <main className="min-h-screen">
            <SectionRenderer sections={sections} locale={locale} />
        </main>
    );
}


