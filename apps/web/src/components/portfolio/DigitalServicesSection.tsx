'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// SVG Icon Components
const Code2Icon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

const Share2Icon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="18" cy="5" r="3" strokeWidth={2} />
        <circle cx="6" cy="12" r="3" strokeWidth={2} />
        <circle cx="18" cy="19" r="3" strokeWidth={2} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
);

const MegaphoneIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
);

const GlobeIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
);

const BarChart3Icon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V10M18 20V4M6 20v-4" />
    </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
        <circle cx="12" cy="12" r="6" strokeWidth={2} />
        <circle cx="12" cy="12" r="2" strokeWidth={2} />
    </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
);

interface DigitalServicesSectionProps {
    locale?: string;
}

interface DigitalService {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    image: string;
    color: string;
    features: string[];
    featuresEn: string[];
    slug: string;
    order: number;
}

interface Stat {
    value: string;
    labelTr: string;
    labelEn: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'web-development': Code2Icon,
    'digital-marketing': TrendingUpIcon,
    'social-media-management': Share2Icon,
    'advertising-management': MegaphoneIcon,
};

const defaultStatsData = [
    { value: '100+', labelTr: 'Web Sitesi Teslim Edildi', labelEn: 'Websites Delivered' },
    { value: '500%', labelTr: 'Ort. Trafik Artışı', labelEn: 'Avg. Traffic Increase' },
    { value: '50+', labelTr: 'Aktif Müşteri', labelEn: 'Active Clients' },
    { value: '10M+', labelTr: 'Reklam Gösterimi', labelEn: 'Ad Impressions' },
];

export default function DigitalServicesSection({ locale = 'tr' }: DigitalServicesSectionProps) {
    const isEn = locale === 'en';
    const [hoveredId, setHoveredId] = useState<string | null>(null);
    const [digitalServices, setDigitalServices] = useState<DigitalService[]>([]);
    const [statsData, setStatsData] = useState<Stat[]>(defaultStatsData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/admin/content/digital-services');
                const data = await res.json();
                if (data.success && data.data) {
                    if (data.data.digitalServices) {
                        setDigitalServices(data.data.digitalServices.sort((a: DigitalService, b: DigitalService) => a.order - b.order));
                    }
                    if (data.data.stats) {
                        setStatsData(data.data.stats);
                    }
                }
            } catch (error) {
                console.error('Error fetching digital services:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading || digitalServices.length === 0) {
        return null;
    }

    return (
        <section className="relative py-24 md:py-32 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink-950 via-ink-900 to-ink-950" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-5 bg-grid-pattern" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <GlobeIcon className="w-5 h-5 text-forest-400" />
                        <span className="text-forest-400 uppercase tracking-widest text-sm font-medium">
                            {isEn ? 'Digital Solutions' : 'Dijital Çözümler'}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-paper-50 mb-6">
                        {isEn ? 'Digital Services' : 'Dijital Hizmetler'}
                    </h2>
                    <p className="text-paper-300 text-lg md:text-xl max-w-2xl mx-auto">
                        {isEn
                            ? 'Grow your brand in digital world with our comprehensive digital services.'
                            : 'Kapsamlı dijital hizmetlerimizle markanızı dijital dünyada büyütün.'
                        }
                    </p>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {digitalServices.map((service, index) => {
                        const Icon = iconMap[service.id] || Code2Icon;
                        const isHovered = hoveredId === service.id;

                        return (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                onMouseEnter={() => setHoveredId(service.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                className="group relative"
                            >
                                <Link href={`/${locale}/services/${service.slug}`}>
                                    <div className="relative h-[400px] lg:h-[450px] rounded-2xl overflow-hidden border border-paper-50/10 hover:border-paper-50/20 transition-all duration-500">
                                        {/* Background Image */}
                                        <Image
                                            src={service.image}
                                            alt={isEn ? service.titleEn : service.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className={`absolute inset-0 bg-gradient-to-t ${service.color} opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent" />

                                        {/* Content */}
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            {/* Icon */}
                                            <motion.div
                                                animate={{
                                                    scale: isHovered ? 1.1 : 1,
                                                    rotate: isHovered ? 5 : 0
                                                }}
                                                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg`}
                                            >
                                                <Icon className="w-7 h-7 text-white" />
                                            </motion.div>

                                            {/* Title */}
                                            <h3 className="text-2xl lg:text-3xl font-bold text-paper-50 mb-3 group-hover:text-forest-300 transition-colors duration-300">
                                                {isEn ? service.titleEn : service.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-paper-300 mb-5 line-clamp-2">
                                                {isEn ? service.descriptionEn : service.description}
                                            </p>

                                            {/* Features */}
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{
                                                    opacity: isHovered ? 1 : 0,
                                                    height: isHovered ? 'auto' : 0
                                                }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="flex flex-wrap gap-2 mb-5">
                                                    {(isEn ? service.featuresEn : service.features).map((feature, fIndex) => (
                                                        <span
                                                            key={fIndex}
                                                            className="px-3 py-1 bg-paper-50/10 backdrop-blur-sm rounded-full text-paper-200 text-sm"
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.div>

                                            {/* CTA */}
                                            <div className="flex items-center gap-2 text-forest-400 group-hover:text-forest-300 transition-colors">
                                                <span className="font-medium">
                                                    {isEn ? 'Learn More' : 'Daha Fazla'}
                                                </span>
                                                <motion.div
                                                    animate={{ x: isHovered ? 5 : 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                </motion.div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {statsData.map((stat, index) => {
                        const icons = [GlobeIcon, BarChart3Icon, UsersIcon, TargetIcon];
                        const StatIcon = icons[index % icons.length];
                        return (
                            <div key={index} className="text-center p-6 rounded-xl bg-paper-50/5 border border-paper-50/10">
                                <StatIcon className="w-6 h-6 text-forest-400 mx-auto mb-3" />
                                <div className="text-3xl font-bold text-paper-50 mb-1">{stat.value}</div>
                                <div className="text-paper-400 text-sm">{isEn ? stat.labelEn : stat.labelTr}</div>
                            </div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
