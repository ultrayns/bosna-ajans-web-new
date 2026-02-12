'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Service {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    image: string;
    video?: string;
    order: number;
}

interface CapabilitiesProps {
    title?: string;
    locale?: string;
}

function ServiceCard({ service, index, locale }: { service: Service; index: number; locale: string }) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && service.video) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const isEn = locale === 'en';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/services/${service.slug}`}>
                {/* Background Media */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Static Image */}
                    <Image
                        src={service.image || '/media/placeholder.jpg'}
                        alt={service.title}
                        fill
                        className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-60' : 'scale-100'}`}
                        sizes="(max-width: 768px) 100vw, 50vw"
                        onError={(e) => {
                            e.currentTarget.src = '/media/placeholder.jpg';
                        }}
                    />

                    {/* Video overlay on hover */}
                    {service.video && (
                        <video
                            ref={videoRef}
                            src={service.video}
                            muted
                            loop
                            playsInline
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                        />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    {/* Number */}
                    <span className="text-forest-400 text-sm font-mono mb-3">
                        {String(index + 1).padStart(2, '0')}
                    </span>

                    {/* Title */}
                    <h3 className="font-display text-2xl md:text-3xl text-paper-50 mb-2 group-hover:text-forest-300 transition-colors">
                        {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-paper-300 leading-relaxed line-clamp-2 max-w-md group-hover:text-paper-200 transition-colors">
                        {service.shortDescription}
                    </p>

                    {/* Learn more */}
                    <div className={`mt-4 flex items-center gap-2 text-forest-400 transition-all duration-300 ${isHovered ? 'translate-x-2 opacity-100' : 'opacity-0 translate-y-4'}`}>
                        <span className="text-sm font-medium">{isEn ? 'Learn More' : 'Daha Fazla'}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function Capabilities({ title, locale = 'tr' }: CapabilitiesProps) {
    const isEn = locale === 'en';
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch('/api/admin/content/services');
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                if (data.success && data.data?.services && data.data.services.length > 0) {
                    const sorted = data.data.services.sort((a: Service, b: Service) => a.order - b.order);
                    setServices(sorted.slice(0, 6)); // Show first 6
                } else {
                    // Fallback to homepage data
                    const homepageRes = await fetch('/api/admin/content/homepage');
                    if (homepageRes.ok) {
                        const homepageData = await homepageRes.json();
                        if (homepageData.success && homepageData.data?.capabilities?.items) {
                            const items = homepageData.data.capabilities.items.map((item: any, idx: number) => ({
                                id: String(idx + 1),
                                title: item.title,
                                slug: item.slug,
                                shortDescription: item.description,
                                image: item.image,
                                video: '',
                                order: idx + 1
                            }));
                            setServices(items.slice(0, 6));
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching services:', error);
                // Hardcoded fallback on error - optimized paths
                setServices([
                    { id: '1', title: 'Video Prodüksiyon', slug: 'video-production', shortDescription: 'Tanıtım filmleri, reklam videoları ve sosyal medya içerikleri.', image: '/media/projects/43-1.webp', video: '', order: 1 },
                    { id: '2', title: 'Moda Fotoğrafçılığı', slug: 'fashion-photography', shortDescription: 'Markalar ve yayınlar için editoryal ve ticari moda fotoğrafçılığı.', image: '/media/projects/IMG_3271-Edit-copy.webp', video: '', order: 2 },
                    { id: '3', title: 'Ürün Fotoğrafçılığı', slug: 'product-photography', shortDescription: 'E-ticaret ve kataloglar için yüksek kaliteli ürün fotoğrafçılığı.', image: '/media/projects/urun-cekimi-1-2.webp', video: '', order: 3 },
                    { id: '4', title: 'Post Prodüksiyon', slug: 'post-production', shortDescription: 'Renk düzeltme, rötuş ve düzenleme hizmetleri.', image: '/media/projects/1-32-2.webp', video: '', order: 4 },
                    { id: '7', title: 'Web Yazılım & Tasarım', slug: 'web-development', shortDescription: 'Modern, hızlı ve mobil uyumlu web siteleri ve uygulamalar.', image: '/media/projects/web-design.webp', video: '', order: 5 },
                    { id: '10', title: 'Sosyal Medya Yönetimi', slug: 'social-media-management', shortDescription: 'Markanızı sosyal medyada güçlendiren profesyonel içerik ve yönetim.', image: '/media/projects/social-media.webp', video: '', order: 6 },
                ]);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    if (loading) {
        return (
            <section className="py-24 md:py-32 bg-ink-900">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-8 h-8 border-2 border-forest-400 border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            </section>
        );
    }

    return (
        <section className="py-24 md:py-32 bg-ink-900 dark:bg-ink-950">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <span className="text-forest-400 text-sm font-medium tracking-wider uppercase mb-3 block">
                        {isEn ? 'Services' : 'Hizmetler'}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50">
                        {title || (isEn ? 'What We Do' : 'Neler Yapıyoruz')}
                    </h2>
                </motion.div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} locale={locale} />
                    ))}
                </div>

                {/* View All Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-12 text-center"
                >
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-paper-300 text-paper-300 font-medium rounded-full hover:bg-paper-50 hover:text-ink-900 transition-all duration-300"
                    >
                        {isEn ? 'View All Services' : 'Tüm Hizmetleri Gör'}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
