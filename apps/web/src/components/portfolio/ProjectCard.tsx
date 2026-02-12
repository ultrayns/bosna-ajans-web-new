'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import ImageLightbox from './ImageLightbox';

// Helper to extract poster URL from either string or object format
function getPosterUrl(heroPoster: string | { url: string } | undefined): string | undefined {
    if (!heroPoster) return undefined;
    if (typeof heroPoster === 'string') return heroPoster;
    if (typeof heroPoster === 'object' && 'url' in heroPoster) return heroPoster.url;
    return undefined;
}

interface Project {
    id: string;
    title: string;
    slug: string;
    client?: { name: string } | string;
    year?: number;
    categories?: { name: string; slug: string }[];
    heroPoster: string | { url: string };
    heroVideo?: string;
    heroVideoPreview?: string;
    shortIntro?: string;
}

interface ProjectCardProps {
    project: Project;
    index: number;
    variant?: 'default' | 'featured' | 'tall' | 'wide';
    locale?: string;
}

// Hover intent delay to prevent accidental video loading
const HOVER_INTENT_DELAY = 150;

export default function ProjectCard({ project, index, variant = 'default', locale = 'tr' }: ProjectCardProps) {
    const isEn = locale === 'en';
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Get poster URL from either string or object format
    const posterUrl = getPosterUrl(project.heroPoster);

    const [isHovered, setIsHovered] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    // Get client name from different formats
    const clientName = typeof project.client === 'string'
        ? project.client
        : project.client?.name || '';

    // IntersectionObserver to detect when card is in viewport
    useEffect(() => {
        const card = cardRef.current;
        const videoSource = project.heroVideo || project.heroVideoPreview;
        if (!card || !videoSource) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInView(entry.isIntersecting);

                    // Pause video when out of viewport
                    if (!entry.isIntersecting && videoRef.current) {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 0;
                    }
                });
            },
            {
                root: null,
                rootMargin: '50px',
                threshold: 0.1,
            }
        );

        observer.observe(card);

        return () => {
            observer.disconnect();
        };
    }, [project.heroVideo, project.heroVideoPreview]);

    // Handle hover with intent delay
    const handleMouseEnter = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovered(true);
            setShouldLoadVideo(true);

            const videoSource = project.heroVideo || project.heroVideoPreview;
            if (videoRef.current && videoSource && isInView) {
                videoRef.current.play().catch(() => { });
            }
        }, HOVER_INTENT_DELAY);
    }, [project.heroVideo, project.heroVideoPreview, isInView]);

    const handleMouseLeave = useCallback(() => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        setIsHovered(false);

        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, []);

    // Handle card click - open lightbox
    const handleClick = useCallback(() => {
        setIsLightboxOpen(true);
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    // Card sizing classes based on variant
    const getCardClasses = () => {
        switch (variant) {
            case 'featured':
                return 'md:col-span-2 lg:col-span-2 row-span-2';
            case 'tall':
                return 'row-span-2';
            case 'wide':
                return 'md:col-span-2';
            default:
                return '';
        }
    };

    return (
        <>
            <motion.article
                ref={cardRef}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                className={`group relative cursor-pointer ${getCardClasses()}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                data-cursor="view"
            >
                {/* Media Container - Full card height */}
                <div className="relative overflow-hidden bg-ink-800 h-full min-h-[280px]">
                    {/* Poster image */}
                    {posterUrl ? (
                        <motion.img
                            src={posterUrl}
                            alt={project.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-ink-700 to-ink-900" />
                    )}

                    {/* Video preview on hover - supports both heroVideo and heroVideoPreview */}
                    {(project.heroVideo || project.heroVideoPreview) && shouldLoadVideo && (
                        <video
                            ref={videoRef}
                            src={project.heroVideo || project.heroVideoPreview}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && isInView ? 'opacity-100' : 'opacity-0'
                                }`}
                        />
                    )}

                    {/* Gradient overlay - always visible but stronger on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-90' : 'opacity-60'}`} />

                    {/* Category badge - top left */}
                    {project.categories?.[0] && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.2 }}
                            className="absolute top-4 left-4 z-10"
                        >
                            <span className="inline-block px-3 py-1.5 bg-forest-500/90 backdrop-blur-sm text-paper-50 text-xs font-medium uppercase tracking-wider">
                                {project.categories[0].name}
                            </span>
                        </motion.div>
                    )}

                    {/* Year badge - top right */}
                    {project.year && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="inline-block px-3 py-1.5 bg-ink-900/60 backdrop-blur-sm text-paper-50/80 text-xs font-medium">
                                {project.year}
                            </span>
                        </div>
                    )}

                    {/* Zoom icon indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                    >
                        <div className="w-14 h-14 bg-paper-50/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </div>
                    </motion.div>

                    {/* Content - bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                        {/* Client name */}
                        {clientName && (
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: isHovered ? 1 : 0.7, y: isHovered ? 0 : 5 }}
                                className="text-sm text-forest-300 font-medium mb-2"
                            >
                                {clientName}
                            </motion.p>
                        )}

                        {/* Title */}
                        <motion.h3
                            animate={{ y: isHovered ? -5 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`font-display text-paper-50 leading-tight ${variant === 'featured' ? 'text-2xl md:text-3xl lg:text-4xl' :
                                variant === 'tall' ? 'text-xl md:text-2xl' :
                                    'text-lg md:text-xl'
                                }`}
                        >
                            {project.title}
                        </motion.h3>

                        {/* Short intro - visible on featured and hover for others */}
                        {project.shortIntro && (
                            <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{
                                    opacity: (variant === 'featured' || isHovered) ? 1 : 0,
                                    height: (variant === 'featured' || isHovered) ? 'auto' : 0,
                                }}
                                transition={{ duration: 0.3 }}
                                className="text-paper-200/80 text-sm mt-2 line-clamp-2 overflow-hidden"
                            >
                                {project.shortIntro}
                            </motion.p>
                        )}

                        {/* View hint */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 flex items-center gap-2 text-paper-50 font-medium text-sm"
                        >
                            <span>{isEn ? 'Click to Enlarge' : 'Büyütmek için tıklayın'}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Decorative corner accents on hover */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-forest-400/50 pointer-events-none"
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-forest-400/50 pointer-events-none"
                    />
                </div>
            </motion.article>

            {/* Lightbox Modal */}
            <ImageLightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                imageSrc={posterUrl || '/media/placeholder.jpg'}
                imageAlt={project.title}
                title={project.title}
                category={project.categories?.[0]?.name}
            />
        </>
    );
}
