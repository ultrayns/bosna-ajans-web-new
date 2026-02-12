'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';

interface Category {
    name: string;
    slug: string;
    count: number;
    image?: string;
    video?: string;
}

interface PortfolioCategoriesProps {
    categories: Category[];
    locale?: string;
}

// Default images for categories - using actual project images
const categoryImages: Record<string, { image: string; video?: string }> = {
    // Turkish category slugs
    moda: {
        image: '/media/projects/genel/IMG_3271-Edit-copy.jpg',
        video: '/media/videos/fashion-photography.mp4',
    },
    urun: {
        image: '/media/projects/genel/urun-cekimi-1-2.jpg',
        video: '/media/videos/product-photography.mp4',
    },
    taki: {
        image: '/media/projects/genel/z-5.jpg',
    },
    event: {
        image: '/media/projects/genel/16-3.jpg',
    },
    etkinlik: {
        image: '/media/projects/genel/16-3.jpg',
    },
    yemek: {
        image: '/media/projects/genel/IMG_6085-Edit-.jpg',
    },
    video: {
        image: '/media/projects/genel/43-1.jpg',
        video: '/media/videos/video-production.mp4',
    },
    'video-produksiyon': {
        image: '/media/projects/genel/43-1.jpg',
        video: '/media/videos/video-production.mp4',
    },
    'kurumsal-portre': {
        image: '/media/projects/genel/IMG_2635-Edit-insta-.jpg',
    },
    saat: {
        image: '/media/projects/genel/saat-cekimi-1-1.jpg',
    },
    aksesuar: {
        image: '/media/projects/genel/canta-urun-cekimi-3.jpg',
    },
    kongre: {
        image: '/media/projects/genel/16-3.jpg',
    },
    zuccaciye: {
        image: '/media/projects/genel/urun-zuccaciye-cekimi-17.jpg',
    },
    // English category slugs
    fashion: {
        image: '/media/projects/genel/IMG_3271-Edit-copy.jpg',
        video: '/media/videos/fashion-photography.mp4',
    },
    product: {
        image: '/media/projects/genel/urun-cekimi-1-2.jpg',
        video: '/media/videos/product-photography.mp4',
    },
    jewelry: {
        image: '/media/projects/genel/z-5.jpg',
    },
    food: {
        image: '/media/projects/genel/IMG_6085-Edit-.jpg',
    },
    'video-production': {
        image: '/media/projects/genel/43-1.jpg',
        video: '/media/videos/video-production.mp4',
    },
    'corporate-portrait': {
        image: '/media/projects/genel/IMG_2635-Edit-insta-.jpg',
    },
};

function CategoryCard({ category, index, locale }: { category: Category; index: number; locale: string }) {
    const isEn = locale === 'en';
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const categoryMedia = categoryImages[category.slug] || {};
    const image = category.image || categoryMedia.image || '/media/images/placeholder.jpg';
    const video = category.video || categoryMedia.video;

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && video) {
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
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link
                href={`/${locale}/portfolio?category=${category.slug}`}
                className="block relative aspect-[4/5] md:aspect-[3/4] overflow-hidden"
            >
                {/* Background image */}
                <motion.img
                    src={image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                />

                {/* Video overlay */}
                {video && (
                    <video
                        ref={videoRef}
                        src={video}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                    />
                )}

                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-70'
                    }`} />

                {/* Decorative corners on hover */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-forest-400/60"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-forest-400/60"
                />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    {/* Count badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 5 }}
                        className="mb-3"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-forest-500/80 backdrop-blur-sm text-paper-50 text-xs font-medium">
                            {category.count} {isEn ? 'Projects' : 'Proje'}
                        </span>
                    </motion.div>

                    {/* Category name */}
                    <motion.h3
                        animate={{ y: isHovered ? -5 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="font-display text-2xl md:text-3xl lg:text-4xl text-paper-50"
                    >
                        {category.name}
                    </motion.h3>

                    {/* View category link */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 flex items-center gap-2 text-forest-300 font-medium text-sm"
                    >
                        <span>{isEn ? 'View Category' : 'Kategoriyi Görüntüle'}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.div>
                </div>
            </Link>
        </motion.div>
    );
}

export default function PortfolioCategories({ categories, locale = 'tr' }: PortfolioCategoriesProps) {
    const isEn = locale === 'en';

    // Filter out 'all' category and categories with no projects
    const displayCategories = categories.filter(c => c.slug !== 'all' && c.count > 0);

    if (displayCategories.length === 0) return null;

    return (
        <section className="py-20 md:py-28 bg-ink-900 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-forest-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-600/10 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 md:mb-16"
                >
                    <p className="text-forest-400 text-sm font-medium uppercase tracking-widest mb-4">
                        {isEn ? 'Browse by Category' : 'Kategoriye Göre'}
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50">
                        {isEn ? 'Explore Our Work' : 'Çalışmalarımızı Keşfedin'}
                    </h2>
                </motion.div>

                {/* Categories grid - expanded layout with varied sizes */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
                    {displayCategories.slice(0, 10).map((category, index) => (
                        <CategoryCard
                            key={category.slug}
                            category={category}
                            index={index}
                            locale={locale}
                        />
                    ))}
                </div>

                {/* View all categories link */}
                {displayCategories.length > 8 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mt-10 text-center"
                    >
                        <span className="text-paper-400 text-sm">
                            +{displayCategories.length - 8} {isEn ? 'more categories' : 'kategoride daha'}
                        </span>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
