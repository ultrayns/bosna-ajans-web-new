'use client';

import Lightbox from '@/components/ui/Lightbox';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ExploreGalleryProps {
    locale?: string;
}

interface GalleryImage {
    [key: string]: unknown;
    id: string;
    src: string;
    alt: string;
    category: string;
    order: number;
}

function GalleryItem({
    image,
    index,
    onImageClick
}: {
    image: GalleryImage;
    index: number;
    onImageClick: () => void;
}) {
    const [isHovered, setIsHovered] = useState(false);

    // Masonry layout: some items span 2 columns or rows
    const getGridClasses = () => {
        const patterns = [
            'md:col-span-2 md:row-span-2', // Large featured
            'md:col-span-1 md:row-span-1', // Normal
            'md:col-span-1 md:row-span-2', // Tall
            'md:col-span-1 md:row-span-1', // Normal
            'md:col-span-2 md:row-span-1', // Wide
            'md:col-span-1 md:row-span-1', // Normal
            'md:col-span-1 md:row-span-1', // Normal
            'md:col-span-1 md:row-span-2', // Tall
            'md:col-span-2 md:row-span-1', // Wide
        ];
        return patterns[index % patterns.length];
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true, margin: '-50px' }}
            className={`relative overflow-hidden cursor-pointer group ${getGridClasses()}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onImageClick}
        >
            {/* Image */}
            <motion.div
                className="relative w-full h-full min-h-[200px]"
                animate={{ scale: isHovered ? 1.05 : 1 }}
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
                <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-50'}`} />

            {/* Decorative corners on hover */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-forest-400"
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-forest-400"
            />

            {/* Zoom icon */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-paper-50/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
                <svg className="w-6 h-6 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
            </motion.div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0.8, y: isHovered ? 0 : 5 }}
                    className="inline-block px-3 py-1 bg-forest-500/80 text-paper-50 text-xs font-medium mb-2"
                >
                    {image.category}
                </motion.span>
                <motion.h4
                    initial={{ y: 10 }}
                    animate={{ y: isHovered ? 0 : 5 }}
                    className="text-paper-50 font-medium text-sm md:text-base"
                >
                    {image.alt}
                </motion.h4>
            </div>
        </motion.div>
    );
}

export default function ExploreGallery({ locale = 'tr' }: ExploreGalleryProps) {
    const isEn = locale === 'en';
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGallery() {
            try {
                const res = await fetch('/api/admin/content/gallery');
                const data = await res.json();
                if (data.success && data.data?.galleryImages) {
                    setGalleryImages(data.data.galleryImages.sort((a: GalleryImage, b: GalleryImage) => a.order - b.order));
                }
            } catch (error) {
                console.error('Error fetching gallery:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchGallery();
    }, []);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    if (loading || galleryImages.length === 0) {
        return null;
    }

    return (
        <section className="py-20 md:py-28 bg-ink-950 relative overflow-hidden">
            {/* Background effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-forest-500/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-forest-600/5 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12 md:mb-16"
                >
                    <motion.span
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-forest-500/10 border border-forest-500/20 text-forest-400 text-sm font-medium mb-6"
                    >
                        <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" />
                        {isEn ? 'Visual Excellence' : 'Görsel Mükemmellik'}
                    </motion.span>

                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50 mb-4">
                        {isEn ? 'Explore Our' : 'Çalışmalarımızı'}
                        <span className="text-forest-400"> {isEn ? 'Creative Works' : 'Keşfedin'}</span>
                    </h2>

                    <p className="text-paper-400 text-base md:text-lg max-w-xl mx-auto">
                        {isEn
                            ? 'Click on any image to view it in full screen'
                            : 'Görüntülemek için herhangi bir görsele tıklayın'}
                    </p>
                </motion.div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[180px]">
                    {galleryImages.map((image, index) => (
                        <GalleryItem
                            key={image.id}
                            image={image}
                            index={index}
                            onImageClick={() => openLightbox(index)}
                        />
                    ))}
                </div>

                {/* Stats row */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-paper-50/10 pt-10"
                >
                    {[
                        { value: '12', label: isEn ? 'Categories' : 'Kategori' },
                        { value: '500+', label: isEn ? 'Photos Taken' : 'Çekilen Fotoğraf' },
                        { value: '100%', label: isEn ? 'Client Satisfaction' : 'Müşteri Memnuniyeti' },
                        { value: '24/7', label: isEn ? 'Support' : 'Destek' }
                    ].map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-2xl md:text-3xl font-bold text-forest-400 mb-1">{stat.value}</div>
                            <div className="text-paper-500 text-sm">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Lightbox */}
            <Lightbox
                isOpen={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                imageSrc={galleryImages[currentImageIndex]?.src || ''}
                imageAlt={galleryImages[currentImageIndex]?.alt || ''}
                allImages={galleryImages}
                currentIndex={currentImageIndex}
                onNavigate={setCurrentImageIndex}
            />
        </section>
    );
}
