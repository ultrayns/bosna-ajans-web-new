import fs from 'fs/promises';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import path from 'path';

interface Service {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
    video: string;
    features: string[];
    order: number;
}

type Props = {
    params: Promise<{ locale: string; slug: string }>;
};

async function getServices(): Promise<Service[]> {
    try {
        const filePath = path.join(process.cwd(), 'src', 'lib', 'data', 'services.json');
        const content = await fs.readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        return data.services || [];
    } catch {
        return [];
    }
}

async function getServiceBySlug(slug: string): Promise<Service | null> {
    const services = await getServices();
    return services.find(s => s.slug === slug) || null;
}

export async function generateStaticParams() {
    const services = await getServices();
    return services.map((service) => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const service = await getServiceBySlug(slug);

    if (!service) {
        return { title: 'Hizmet Bulunamadı' };
    }

    return {
        title: `${service.title} | BOSNA AJANS`,
        description: service.shortDescription,
    };
}

export default async function ServiceDetailPage({ params }: Props) {
    const { locale, slug } = await params;
    setRequestLocale(locale);

    const service = await getServiceBySlug(slug);
    const allServices = await getServices();

    if (!service) {
        notFound();
    }

    const otherServices = allServices.filter(s => s.slug !== slug).slice(0, 4);
    const isEn = locale === 'en';

    return (
        <main className="min-h-screen bg-ink-900">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src={service.image || '/media/placeholder.jpg'}
                        alt={service.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-ink-900/30" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full container mx-auto px-6 md:px-12 lg:px-24 flex items-end pb-16">
                    <div className="max-w-3xl">
                        {/* Back link */}
                        <Link
                            href="/services"
                            className="inline-flex items-center gap-2 text-paper-400 hover:text-forest-400 transition-colors mb-6"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {isEn ? 'All Services' : 'Tüm Hizmetler'}
                        </Link>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-paper-50 mb-6 leading-tight">
                            {service.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-paper-200 leading-relaxed">
                            {service.shortDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-20 md:py-32 bg-ink-900">
                <div className="container mx-auto px-6 md:px-12 lg:px-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                        {/* Left Column - Description */}
                        <div className="lg:col-span-7">
                            <h2 className="font-display text-3xl md:text-4xl text-paper-50 mb-8">
                                {isEn ? 'About This Service' : 'Hizmet Detayları'}
                            </h2>
                            <div className="prose prose-lg prose-invert max-w-none">
                                <p className="text-paper-300 leading-relaxed text-lg">
                                    {service.fullDescription}
                                </p>
                            </div>

                            {/* Video Section if available */}
                            {service.video && (
                                <div className="mt-12">
                                    <div className="aspect-video rounded-2xl overflow-hidden bg-ink-800">
                                        <video
                                            src={service.video}
                                            controls
                                            className="w-full h-full object-cover"
                                            poster={service.image}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Features */}
                        <div className="lg:col-span-5">
                            <div className="sticky top-32">
                                <div className="bg-ink-800/50 backdrop-blur-sm rounded-3xl p-8 border border-ink-700">
                                    <h3 className="font-display text-2xl text-paper-50 mb-6">
                                        {isEn ? 'What We Offer' : 'Neler Sunuyoruz'}
                                    </h3>
                                    <ul className="space-y-4">
                                        {service.features?.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-4">
                                                <span className="w-8 h-8 bg-forest-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </span>
                                                <span className="text-paper-200">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA Button */}
                                    <Link
                                        href="/contact"
                                        className="mt-8 w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-forest-500 text-paper-50 font-semibold rounded-xl hover:bg-forest-600 transition-all duration-300"
                                    >
                                        {isEn ? 'Get a Quote' : 'Teklif Alın'}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>

                                {/* Quick Contact */}
                                <div className="mt-6 text-center">
                                    <p className="text-paper-400 text-sm">
                                        {isEn ? 'or call us' : 'veya arayın'}
                                    </p>
                                    <a href="tel:+905467168806" className="text-forest-400 text-lg font-medium hover:text-forest-300 transition-colors">
                                        0546 716 88 06
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Other Services */}
            {otherServices.length > 0 && (
                <section className="py-20 md:py-32 bg-ink-800/50">
                    <div className="container mx-auto px-6 md:px-12 lg:px-24">
                        <h2 className="font-display text-3xl md:text-4xl text-paper-50 mb-12 text-center">
                            {isEn ? 'Explore Other Services' : 'Diğer Hizmetlerimiz'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {otherServices.map((s) => (
                                <Link
                                    key={s.id}
                                    href={`/services/${s.slug}`}
                                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden"
                                >
                                    <Image
                                        src={s.image || '/media/placeholder.jpg'}
                                        alt={s.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/50 to-transparent" />
                                    <div className="absolute inset-0 flex items-end p-6">
                                        <h3 className="font-display text-xl text-paper-50 group-hover:text-forest-400 transition-colors">
                                            {s.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Bottom CTA */}
            <section className="py-24 md:py-32 bg-ink-900 border-t border-ink-700">
                <div className="container mx-auto px-6 md:px-12 lg:px-24 text-center">
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50 mb-6">
                        {isEn ? 'Ready to Start Your Project?' : 'Projenize Başlamaya Hazır mısınız?'}
                    </h2>
                    <p className="text-paper-300 text-lg mb-10 max-w-2xl mx-auto">
                        {isEn
                            ? 'Tell us about your project and let\'s create something amazing together.'
                            : 'Projenizi anlatın, birlikte harika işler çıkaralım.'}
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-paper-50 text-ink-900 font-semibold rounded-full hover:bg-forest-400 transition-all duration-300 hover:scale-105"
                    >
                        {isEn ? 'Start a Project' : 'Proje Başlat'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </section>
        </main>
    );
}
