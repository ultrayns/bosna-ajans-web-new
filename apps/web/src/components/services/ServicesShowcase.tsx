'use client';

import { Service } from '@/lib/strapi';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface ServiceShowcaseCardProps {
    service: Service;
    index: number;
    locale: string;
    isReversed: boolean;
}

function ServiceShowcaseCard({ service, index, locale, isReversed }: ServiceShowcaseCardProps) {
    const isEn = locale === 'en';
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start end', 'end start']
    });

    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

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

    return (
        <motion.div
            ref={cardRef}
            style={{ opacity }}
            className="relative"
        >
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                {/* Media Section */}
                <motion.div
                    style={{ y }}
                    className={`relative ${isReversed ? 'lg:order-2' : ''}`}
                >
                    <Link
                        href={`/services/${service.slug}`}
                        className="group relative block aspect-[4/3] overflow-hidden rounded-xl"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Image */}
                        {service.image && (
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-40' : 'scale-100'
                                    }`}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        )}

                        {/* Video overlay */}
                        {service.video && (
                            <video
                                ref={videoRef}
                                src={service.video}
                                muted
                                loop
                                playsInline
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                                    }`}
                            />
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />

                        {/* Number badge */}
                        <div className="absolute top-6 left-6">
                            <span className="flex items-center justify-center w-14 h-14 bg-forest-500 rounded-full text-paper-50 font-display text-xl">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        {/* Play indicator on hover */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-paper-50/20 backdrop-blur-sm flex items-center justify-center">
                                <svg className="w-8 h-8 text-paper-50 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </motion.div>
                    </Link>

                    {/* Decorative frame */}
                    <div className={`absolute -top-4 ${isReversed ? '-left-4' : '-right-4'} w-full h-full border-2 border-forest-500/20 rounded-xl -z-10`} />
                </motion.div>

                {/* Content Section */}
                <div className={`${isReversed ? 'lg:order-1 lg:text-right' : ''}`}>
                    <motion.div
                        initial={{ opacity: 0, x: isReversed ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {/* Category label */}
                        <span className="text-forest-400 font-mono text-sm tracking-wider mb-4 block">
                            {isEn ? 'SERVICE' : 'HİZMET'} {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Title */}
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50 mb-6">
                            {service.title}
                        </h2>

                        {/* Description */}
                        <p className="text-paper-300 text-lg leading-relaxed mb-8">
                            {service.fullDescription || service.description}
                        </p>

                        {/* Features grid */}
                        <div className={`grid grid-cols-2 gap-3 mb-8 ${isReversed ? 'lg:justify-items-end' : ''}`}>
                            {service.features?.slice(0, 4).map((feature) => (
                                <div key={feature} className={`flex items-center gap-2 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500" />
                                    <span className="text-paper-400 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <Link
                            href={`/services/${service.slug}`}
                            className={`inline-flex items-center gap-3 text-forest-400 hover:text-forest-300 transition-colors group ${isReversed ? 'flex-row-reverse' : ''}`}
                        >
                            <span className="text-lg font-medium">
                                {isEn ? 'Learn More' : 'Detayları Gör'}
                            </span>
                            <svg
                                className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isReversed ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

interface ServicesShowcaseProps {
    locale?: string;
    services: Service[];
}

export default function ServicesShowcase({ locale = 'tr', services = [] }: ServicesShowcaseProps) {
    const isEn = locale === 'en';

    return (
        <section className="py-24 md:py-32 bg-ink-900">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-forest-400 font-mono text-sm tracking-widest uppercase mb-4 block">
                        {isEn ? 'What We Do' : 'Neler Yapıyoruz'}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-paper-50 mb-6">
                        {isEn ? 'Our Services' : 'Hizmetlerimiz'}
                    </h2>
                    <p className="text-paper-300 text-lg max-w-2xl mx-auto">
                        {isEn
                            ? 'Comprehensive production services to elevate your brand with visual excellence.'
                            : 'Markanızı görsel mükemmellikle yükseltmek için kapsamlı prodüksiyon hizmetleri.'}
                    </p>
                </motion.div>

                {/* Services list */}
                <div className="space-y-24 lg:space-y-32">
                    {services.map((service, index) => (
                        <ServiceShowcaseCard
                            key={service.slug}
                            service={service}
                            index={index}
                            locale={locale}
                            isReversed={index % 2 === 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
