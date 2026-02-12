import ServicesHero from '@/components/services/ServicesHero';
import ServicesProcess from '@/components/services/ServicesProcess';
import ServicesShowcase from '@/components/services/ServicesShowcase';
import ServicesStats from '@/components/services/ServicesStats';
import { getServices } from '@/lib/strapi';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: locale === 'tr' ? 'Hizmetler | BOSNAAJANS' : 'Services | BOSNAAJANS',
        description: locale === 'tr'
            ? 'Film prodüksiyon, moda fotoğrafçılığı, post prodüksiyon ve kreatif yönetim hizmetlerimizi keşfedin.'
            : 'Explore our film production, fashion photography, post-production and creative direction services.',
    };
}

export default async function ServicesPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const services = await getServices(locale);

    return (
        <main className="min-h-screen bg-ink-900">
            {/* Hero Section with Video Background */}
            <ServicesHero locale={locale} />

            {/* Services Showcase - Large Format Cards */}
            <ServicesShowcase locale={locale} services={services} />

            {/* Statistics Section */}
            <ServicesStats locale={locale} />

            {/* Process Section */}
            <ServicesProcess locale={locale} />

            {/* CTA Section */}
            <section className="py-24 md:py-32 bg-ink-900 border-t border-paper-50/10">
                <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50 mb-6">
                        {locale === 'tr' ? 'Projenizi Konuşalım' : "Let's Discuss Your Project"}
                    </h2>
                    <p className="text-paper-300 max-w-xl mx-auto mb-8">
                        {locale === 'tr'
                            ? 'Markanız için en uygun çözümü birlikte bulalım.'
                            : "We'll help you find the perfect solution for your brand."}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-forest-500 text-paper-50 font-medium hover:bg-forest-600 transition-colors rounded-sm"
                    >
                        <span>{locale === 'tr' ? 'İletişime Geç' : 'Get in Touch'}</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
