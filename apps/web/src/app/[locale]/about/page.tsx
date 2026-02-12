import { readData } from '@/lib/admin/storage';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type Props = {
    params: Promise<{ locale: string }>;
};

interface AboutData {
    title: string;
    subtitle: string;
    heroImage?: string;
    story: {
        title: string;
        content: string;
    };
    mission: {
        title: string;
        content: string;
    };
    vision: {
        title: string;
        content: string;
    };
    values: Array<{
        title: string;
        description: string;
    }>;
    stats: Array<{
        value: string;
        label: string;
    }>;
    cta: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'tr' ? 'Hakkımızda | BOSNAAJANS' : 'About Us | BOSNAAJANS',
        description: locale === 'tr'
            ? 'BOSNA AJANS hakkında - İstanbul merkezli profesyonel fotoğraf ve video prodüksiyon stüdyosu.'
            : 'About BOSNA AJANS - Professional photography and video production studio based in Istanbul.',
    };
}

export default async function AboutPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    let aboutData: AboutData | null = null;
    try {
        aboutData = await readData<AboutData>('about');
    } catch {
        // Fallback
    }

    const data = aboutData || {
        title: 'Hakkımızda',
        subtitle: 'İstanbul merkezli profesyonel prodüksiyon stüdyosu',
        story: { title: 'Hikayemiz', content: '' },
        mission: { title: 'Misyonumuz', content: '' },
        vision: { title: 'Vizyonumuz', content: '' },
        values: [],
        stats: [],
        cta: { title: '', description: '', buttonText: 'İletişim', buttonUrl: '/contact' },
    };

    return (
        <main className="min-h-screen bg-paper-50 dark:bg-ink-900">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-ink-900 via-ink-800 to-forest-900 text-white">
                <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')]" />
                <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
                        {data.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-paper-300 max-w-2xl">
                        {data.subtitle}
                    </p>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="max-w-4xl">
                        <h2 className="font-display text-3xl md:text-4xl text-ink-900 dark:text-paper-50 mb-8">
                            {data.story.title}
                        </h2>
                        <div
                            className="prose prose-lg dark:prose-invert prose-p:text-ink-700 dark:prose-p:text-paper-300"
                            dangerouslySetInnerHTML={{ __html: data.story.content }}
                        />
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 md:py-24 bg-ink-100 dark:bg-ink-800">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="font-display text-2xl md:text-3xl text-ink-900 dark:text-paper-50 mb-4">
                                {data.mission.title}
                            </h3>
                            <p className="text-lg text-ink-700 dark:text-paper-300">
                                {data.mission.content}
                            </p>
                        </div>
                        <div>
                            <h3 className="font-display text-2xl md:text-3xl text-ink-900 dark:text-paper-50 mb-4">
                                {data.vision.title}
                            </h3>
                            <p className="text-lg text-ink-700 dark:text-paper-300">
                                {data.vision.content}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            {data.values.length > 0 && (
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24">
                        <h2 className="font-display text-3xl md:text-4xl text-ink-900 dark:text-paper-50 mb-12 text-center">
                            Değerlerimiz
                        </h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {data.values.map((value, index) => (
                                <div
                                    key={index}
                                    className="p-6 bg-white dark:bg-ink-800 rounded-xl shadow-sm border border-ink-100 dark:border-ink-700"
                                >
                                    <h4 className="font-display text-xl text-ink-900 dark:text-paper-50 mb-2">
                                        {value.title}
                                    </h4>
                                    <p className="text-ink-600 dark:text-paper-400">
                                        {value.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Stats */}
            {data.stats.length > 0 && (
                <section className="py-16 md:py-24 bg-forest-600 dark:bg-forest-700">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                            {data.stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="font-display text-4xl md:text-5xl text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-paper-200">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            {data.cta.title && (
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
                        <h2 className="font-display text-3xl md:text-4xl text-ink-900 dark:text-paper-50 mb-4">
                            {data.cta.title}
                        </h2>
                        <p className="text-lg text-ink-600 dark:text-paper-400 mb-8 max-w-2xl mx-auto">
                            {data.cta.description}
                        </p>
                        <Link
                            href={data.cta.buttonUrl}
                            className="inline-flex items-center px-8 py-4 bg-ink-900 dark:bg-paper-50 text-white dark:text-ink-900 font-medium rounded-lg hover:bg-ink-800 dark:hover:bg-paper-100 transition-colors"
                        >
                            {data.cta.buttonText}
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </section>
            )}
        </main>
    );
}
