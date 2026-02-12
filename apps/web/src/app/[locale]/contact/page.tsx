import { ContactForm } from '@/components/contact';
import { readData } from '@/lib/admin/storage';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type Props = {
    params: Promise<{ locale: string }>;
};

interface SiteSettings {
    brandName: string;
    tagline: string;
    contact: {
        email: string;
        phone: string;
        address: string;
        googleMapsUrl?: string;
    };
    social: {
        instagram?: string;
        vimeo?: string;
        behance?: string;
        linkedin?: string;
        youtube?: string;
        tiktok?: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;

    return {
        title: locale === 'tr' ? 'İletişim | BOSNAAJANS' : 'Contact | BOSNAAJANS',
        description: locale === 'tr'
            ? 'Projeniz için bizimle iletişime geçin. İstanbul merkezli film ve fotoğraf prodüksiyon stüdyosu.'
            : 'Get in touch for your next project. Istanbul-based film and photography production studio.',
    };
}

export default async function ContactPage({ params }: Props) {
    const { locale } = await params;
    setRequestLocale(locale);

    // Fetch site settings from JSON
    let siteSettings: SiteSettings;
    try {
        siteSettings = await readData<SiteSettings>('site-settings');
    } catch {
        // Fallback if JSON read fails
        siteSettings = {
            brandName: 'BOSNA AJANS',
            tagline: 'Çekim ve Prodüksiyon Hizmeti',
            contact: {
                email: 'info@bosnaajans.com',
                phone: '0546 716 88 06',
                address: 'İstanbul, Türkiye',
            },
            social: {
                instagram: 'https://www.instagram.com/bosna_ajans/',
            },
        };
    }

    return (
        <main className="min-h-screen bg-paper-50 dark:bg-ink-900">
            {/* Header */}
            <section className="pt-32 pb-16 md:pt-40 md:pb-24">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink-900 dark:text-paper-50">
                        {locale === 'tr' ? 'İletişim' : 'Contact'}
                    </h1>
                    <p className="mt-4 text-lg text-ink-600 dark:text-paper-300 max-w-2xl">
                        {locale === 'tr'
                            ? 'Projenizi tartışmak için bize ulaşın. İleriye dönük işbirliklerine her zaman açığız.'
                            : "Reach out to discuss your project. We're always open to future collaborations."}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="pb-24 md:pb-32">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                        {/* Form */}
                        <div className="lg:col-span-2">
                            <ContactForm locale={locale} />
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            {/* Email */}
                            <div>
                                <h3 className="text-sm font-medium text-ink-500 dark:text-paper-400 uppercase tracking-wider mb-2">
                                    E-posta
                                </h3>
                                <a
                                    href={`mailto:${siteSettings.contact.email}`}
                                    className="text-lg text-ink-900 dark:text-paper-50 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                >
                                    {siteSettings.contact.email}
                                </a>
                            </div>

                            {/* Phone */}
                            <div>
                                <h3 className="text-sm font-medium text-ink-500 dark:text-paper-400 uppercase tracking-wider mb-2">
                                    {locale === 'tr' ? 'Telefon' : 'Phone'}
                                </h3>
                                <a
                                    href={`tel:${siteSettings.contact.phone}`}
                                    className="text-lg text-ink-900 dark:text-paper-50 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                >
                                    {siteSettings.contact.phone}
                                </a>
                            </div>

                            {/* Address */}
                            <div>
                                <h3 className="text-sm font-medium text-ink-500 dark:text-paper-400 uppercase tracking-wider mb-2">
                                    {locale === 'tr' ? 'Adres' : 'Address'}
                                </h3>
                                <p className="text-lg text-ink-900 dark:text-paper-50">
                                    {siteSettings.contact.address}
                                </p>
                            </div>

                            {/* Social */}
                            <div>
                                <h3 className="text-sm font-medium text-ink-500 dark:text-paper-400 uppercase tracking-wider mb-4">
                                    {locale === 'tr' ? 'Sosyal Medya' : 'Social Media'}
                                </h3>
                                <div className="flex gap-4">
                                    {siteSettings.social.instagram && (
                                        <a
                                            href={siteSettings.social.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-ink-600 dark:text-paper-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                        >
                                            Instagram
                                        </a>
                                    )}
                                    {siteSettings.social.vimeo && (
                                        <a
                                            href={siteSettings.social.vimeo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-ink-600 dark:text-paper-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                        >
                                            Vimeo
                                        </a>
                                    )}
                                    {siteSettings.social.linkedin && (
                                        <a
                                            href={siteSettings.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-ink-600 dark:text-paper-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                    {siteSettings.social.youtube && (
                                        <a
                                            href={siteSettings.social.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-ink-600 dark:text-paper-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                        >
                                            YouTube
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
