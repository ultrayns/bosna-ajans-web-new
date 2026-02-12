'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface FeaturedWork {
    id: string;
    title: string;
    category: string;
    image: string;
    video?: string;
    order: number;
}

interface FeaturedWorksProps {
    title?: string;
    locale?: string;
}

// Bento grid layout classes
const getGridClass = (index: number): string => {
    const layouts = [
        'col-span-2 row-span-2', // Big featured
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
        'col-span-1 row-span-2', // Tall
        'col-span-1 row-span-1',
        'col-span-1 row-span-1',
    ];
    return layouts[index % layouts.length];
};

function WorkCard({ work, index }: { work: FeaturedWork; index: number }) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && work.video) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl cursor-pointer group ${getGridClass(index)}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Image */}
            <div className="absolute inset-0 bg-ink-800">
                <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className={`object-cover transition-all duration-700 ${isHovered && work.video ? 'opacity-0' : 'opacity-100'
                        } ${isHovered ? 'scale-110' : 'scale-100'}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                        e.currentTarget.src = '/media/placeholder.jpg';
                    }}
                />
            </div>

            {/* Video (plays on hover) */}
            {work.video && (
                <video
                    ref={videoRef}
                    src={work.video}
                    muted
                    loop
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                />
            )}

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/20 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-60'
                }`} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                {/* Category Badge */}
                <span className={`inline-block self-start px-3 py-1 text-xs font-medium bg-forest-500/20 backdrop-blur-sm text-forest-400 rounded-full mb-3 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                    }`}>
                    {work.category}
                </span>

                {/* Title */}
                <h3 className={`font-display text-xl md:text-2xl lg:text-3xl text-paper-50 leading-tight transition-all duration-500 ${isHovered ? 'translate-y-0' : 'translate-y-1'
                    }`}>
                    {work.title}
                </h3>

                {/* Video Indicator */}
                {work.video && (
                    <div className={`absolute top-4 right-4 transition-all duration-300 ${isHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                        }`}>
                        <div className="w-12 h-12 bg-paper-50/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-paper-50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* Playing indicator */}
                {work.video && isHovered && (
                    <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-1 px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-xs text-white font-medium">CANLI</span>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default function FeaturedWorks({ title, locale = 'tr' }: FeaturedWorksProps) {
    const isEn = locale === 'en';
    const [works, setWorks] = useState<FeaturedWork[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWorks() {
            try {
                const res = await fetch('/api/admin/content/featured-works');
                if (!res.ok) throw new Error('API error');
                const data = await res.json();
                if (data.success && data.data?.featuredWorks && data.data.featuredWorks.length > 0) {
                    const sorted = data.data.featuredWorks.sort((a: FeaturedWork, b: FeaturedWork) => a.order - b.order);
                    setWorks(sorted);
                } else {
                    // Fallback - optimized media paths
                    setWorks([
                        { id: 'fw1', title: 'Moda Çekimi', category: 'Moda', image: '/media/projects/IMG_3271-Edit-copy.webp', video: '/media/featured/moda-cekimi.mp4', order: 1 },
                        { id: 'fw2', title: 'Ürün Fotoğrafçılığı', category: 'Ürün', image: '/media/projects/urun-cekimi-1-2.webp', video: '/media/featured/urun-cekimi.mp4', order: 2 },
                        { id: 'fw3', title: 'Reklam Filmi', category: 'Video', image: '/media/projects/43-1.webp', video: '/media/featured/reklam-filmi.mp4', order: 3 },
                        { id: 'fw4', title: 'Kurumsal Tanıtım', category: 'Kurumsal', image: '/media/projects/1-143.webp', video: '/media/featured/kurumsal-tanitim.mp4', order: 4 },
                        { id: 'fw5', title: 'Klinik Tanıtım', category: 'Sağlık', image: '/media/projects/16-3.webp', video: '/media/featured/klinik-tanitim.mp4', order: 5 },
                        { id: 'fw6', title: 'Event Çekimi', category: 'Event', image: '/media/projects/1-32-2.webp', video: '/media/featured/event-cekimi.mp4', order: 6 },
                    ]);
                }
            } catch (error) {
                console.error('Error fetching featured works:', error);
                // Fallback on error - optimized media
                setWorks([
                    { id: 'fw1', title: 'Moda Çekimi', category: 'Moda', image: '/media/projects/IMG_3271-Edit-copy.webp', video: '/media/featured/moda-cekimi.mp4', order: 1 },
                    { id: 'fw2', title: 'Ürün Fotoğrafçılığı', category: 'Ürün', image: '/media/projects/urun-cekimi-1-2.webp', video: '/media/featured/urun-cekimi.mp4', order: 2 },
                    { id: 'fw3', title: 'Reklam Filmi', category: 'Video', image: '/media/projects/43-1.webp', video: '/media/featured/reklam-filmi.mp4', order: 3 },
                    { id: 'fw4', title: 'Kurumsal Tanıtım', category: 'Kurumsal', image: '/media/projects/1-143.webp', video: '/media/featured/kurumsal-tanitim.mp4', order: 4 },
                    { id: 'fw5', title: 'Klinik Tanıtım', category: 'Sağlık', image: '/media/projects/16-3.webp', video: '/media/featured/klinik-tanitim.mp4', order: 5 },
                    { id: 'fw6', title: 'Event Çekimi', category: 'Event', image: '/media/projects/1-32-2.webp', video: '/media/featured/event-cekimi.mp4', order: 6 },
                ]);
            } finally {
                setLoading(false);
            }
        }
        fetchWorks();
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
        <section className="py-24 md:py-32 bg-ink-900">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-16"
                >
                    <span className="text-forest-400 text-sm font-medium tracking-wider uppercase mb-3 block">
                        {isEn ? 'Portfolio' : 'Portfolyo'}
                    </span>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50">
                        {title || (isEn ? 'Selected Works' : 'Seçili Çalışmalar')}
                    </h2>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
                    {works.map((work, index) => (
                        <WorkCard key={work.id} work={work} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
