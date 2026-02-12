import DigitalServicesSection from '@/components/portfolio/DigitalServicesSection';
import ExploreGallery from '@/components/portfolio/ExploreGallery';
import FeaturedProjects from '@/components/portfolio/FeaturedProjects';
import PortfolioCategories from '@/components/portfolio/PortfolioCategories';
import PortfolioCTA from '@/components/portfolio/PortfolioCTA';
import PortfolioGrid from '@/components/portfolio/PortfolioGrid';
import PortfolioStats from '@/components/portfolio/PortfolioStats';
import { getCategories, getProjectYears, getProjects } from '@/lib/strapi';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: locale === 'tr' ? 'Portfolyo | BOSNAAJANS' : 'Portfolio | BOSNAAJANS',
        description: locale === 'tr'
            ? 'Moda, reklam ve müzik videoları alanında seçkin projelerimizi keşfedin.'
            : 'Explore our selected projects in fashion, commercials, and music videos.',
        openGraph: {
            title: locale === 'tr' ? 'Portfolyo | BOSNAAJANS' : 'Portfolio | BOSNAAJANS',
            description: locale === 'tr'
                ? 'Moda, reklam ve müzik videoları alanında seçkin projelerimizi keşfedin.'
                : 'Explore our selected projects in fashion, commercials, and music videos.',
        },
    };
}

export default async function PortfolioPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    const isEn = locale === 'en';

    // Fetch data from API with fallback to mock data
    const [projects, categories, years] = await Promise.all([
        getProjects(locale),
        getCategories(locale),
        getProjectYears(),
    ]);

    // Featured projects for hero slider (first 5 featured or first 5 projects)
    const featuredProjects = (projects || [])
        .filter((p: any) => p.isFeatured)
        .slice(0, 5);

    const heroProjects = featuredProjects.length > 0
        ? featuredProjects
        : (projects || []).slice(0, 5);

    // Stats data
    const stats = [
        { value: (projects || []).length, label: isEn ? 'Projects' : 'Proje' },
        { value: Math.max(0, (categories || []).length - 1), label: isEn ? 'Categories' : 'Kategori' }, // -1 for "All"
        { value: 50, suffix: '+', label: isEn ? 'Clients' : 'Müşteri' },
        { value: (years || []).length, label: isEn ? 'Years Active' : 'Yıllık Tecrübe' },
    ];

    // Categories with counts for the showcase
    const categoriesWithCounts = (categories || [])
        .filter((cat: any) => cat.slug !== 'all')
        .map((cat: any) => ({
            ...cat,
            count: (projects || []).filter((p: any) =>
                p.categories?.some((c: any) => c.slug === cat.slug)
            ).length,
        }))
        .filter((cat: any) => cat.count > 0);

    return (
        <main className="min-h-screen bg-ink-900">
            {/* Featured Projects Hero Slider */}
            <FeaturedProjects projects={heroProjects as any} locale={locale} />

            {/* Statistics Section */}
            <PortfolioStats stats={stats} />

            {/* Digital Services Section */}
            <DigitalServicesSection locale={locale} />

            {/* Categories Showcase */}
            <PortfolioCategories categories={categoriesWithCounts} locale={locale} />

            {/* Explore Gallery - Visual showcase with parallax */}
            <ExploreGallery locale={locale} />

            {/* Page Header for Grid */}
            <section className="pt-16 pb-4 md:pt-20 md:pb-6 bg-paper-50 dark:bg-ink-900">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 dark:text-paper-50">
                        {isEn ? 'All Projects' : 'Tüm Projeler'}
                    </h2>
                    <p className="mt-4 text-lg text-ink-600 dark:text-paper-300 max-w-2xl">
                        {isEn
                            ? 'Browse through our complete collection of work across fashion, products, and events.'
                            : 'Moda, ürün ve etkinlik alanlarındaki tüm çalışmalarımızı keşfedin.'}
                    </p>
                </div>
            </section>

            {/* Portfolio Grid */}
            <div className="bg-paper-50 dark:bg-ink-900">
                <PortfolioGrid
                    initialProjects={projects as any}
                    categories={categories as any}
                    years={years}
                    locale={locale}
                />
            </div>

            {/* CTA Section */}
            <PortfolioCTA locale={locale} />
        </main>
    );
}
