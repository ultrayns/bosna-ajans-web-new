'use client';

import { mockServices, Service } from '@/lib/mock-services';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface ServiceCardProps {
    service: Service;
    index: number;
    locale: string;
}

function ServiceCard({ service, index, locale }: ServiceCardProps) {
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <Link
                href={`/services/${service.slug}`}
                className="group relative block overflow-hidden rounded-lg bg-ink-800"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {/* Media Container */}
                <div className="relative aspect-[4/3] overflow-hidden">
                    {/* Background Image */}
                    {service.image && (
                        <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className={`object-cover transition-all duration-700 ${isHovered ? 'scale-110 opacity-60' : 'scale-100'
                                }`}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    )}

                    {/* Video overlay on hover */}
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

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/70 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                        {/* Number */}
                        <span className="text-forest-400 text-sm font-mono mb-3">
                            {String(index + 1).padStart(2, '0')}
                        </span>

                        {/* Title */}
                        <h2 className="font-display text-2xl md:text-3xl text-paper-50 mb-3 group-hover:text-forest-300 transition-colors">
                            {service.title}
                        </h2>

                        {/* Description */}
                        <p className="text-paper-300 leading-relaxed line-clamp-2 mb-4 group-hover:text-paper-200 transition-colors">
                            {service.shortDescription}
                        </p>

                        {/* Link indicator */}
                        <div className={`flex items-center gap-2 text-forest-400 transition-all duration-300 ${isHovered ? 'translate-x-2 opacity-100' : 'opacity-70'
                            }`}>
                            <span className="text-sm font-medium">
                                {locale === 'tr' ? 'Detayları Gör' : 'Learn More'}
                            </span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

interface ServicesGridClientProps {
    locale: string;
}

export default function ServicesGridClient({ locale }: ServicesGridClientProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {mockServices.map((service, index) => (
                <ServiceCard
                    key={service.slug}
                    service={service}
                    index={index}
                    locale={locale}
                />
            ))}
        </div>
    );
}
