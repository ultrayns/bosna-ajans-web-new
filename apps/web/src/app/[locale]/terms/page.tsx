import { readData } from '@/lib/admin/storage';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

type Props = {
    params: Promise<{ locale: string }>;
};

interface LegalData {
    privacy: {
        title: string;
        lastUpdated: string;
        content: string;
    };
    terms: {
        title: string;
        lastUpdated: string;
        content: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: locale === 'tr' ? 'Kullanım Şartları | BOSNAAJANS' : 'Terms of Service | BOSNAAJANS',
        description: locale === 'tr'
            ? 'BOSNA AJANS kullanım şartları ve koşulları.'
            : 'BOSNA AJANS terms of service and conditions.',
    };
}

export default async function TermsPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    let legalData: LegalData | null = null;
    try {
        legalData = await readData<LegalData>('legal');
    } catch {
        // Fallback content
    }

    const terms = legalData?.terms || {
        title: locale === 'tr' ? 'Kullanım Şartları' : 'Terms of Service',
        lastUpdated: new Date().toISOString().split('T')[0],
        content: locale === 'tr'
            ? '<p>Kullanım şartları içeriği yükleniyor...</p>'
            : '<p>Terms of service content loading...</p>',
    };

    return (
        <main className="min-h-screen bg-paper-50 dark:bg-ink-900">
            {/* Header */}
            <section className="pt-32 pb-12 md:pt-40 md:pb-16 border-b border-ink-200 dark:border-ink-700">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-ink-500 dark:text-paper-400 hover:text-forest-600 dark:hover:text-forest-400 mb-6 transition-colors"
                    >
                        ← {locale === 'tr' ? 'Ana Sayfa' : 'Home'}
                    </Link>
                    <h1 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 dark:text-paper-50">
                        {terms.title}
                    </h1>
                    <p className="mt-4 text-ink-500 dark:text-paper-400">
                        {locale === 'tr' ? 'Son güncelleme: ' : 'Last updated: '}
                        {new Date(terms.lastUpdated).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div
                        className="prose prose-lg dark:prose-invert max-w-4xl
                            prose-headings:font-display prose-headings:text-ink-900 dark:prose-headings:text-paper-50
                            prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                            prose-p:text-ink-700 dark:prose-p:text-paper-300
                            prose-ul:text-ink-700 dark:prose-ul:text-paper-300
                            prose-li:marker:text-forest-600"
                        dangerouslySetInnerHTML={{ __html: terms.content }}
                    />
                </div>
            </section>
        </main>
    );
}
