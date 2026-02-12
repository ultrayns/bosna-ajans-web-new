'use client';

import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

interface Project {
    id: string;
    title: string;
    slug?: string;
    client?: { name: string } | string;
    year?: number;
    categories?: { name: string; slug: string }[];
    category?: string;
    heroPoster?: string | { url: string };
    image?: string;
    heroVideo?: string;
    shortIntro?: string;
    description?: string;
}

interface SliderItem {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    category: string;
    client?: string;
    year?: number;
    image: string;
    order: number;
}

interface FeaturedProjectsProps {
    projects?: Project[];
    locale?: string;
}

function getPosterUrl(project: Project): string {
    if (project.image) return project.image;
    if (project.heroPoster) {
        if (typeof project.heroPoster === 'string') return project.heroPoster;
        if (typeof project.heroPoster === 'object' && 'url' in project.heroPoster) return project.heroPoster.url;
    }
    return '/media/placeholder.jpg';
}

function getClientName(project: Project): string {
    if (typeof project.client === 'string') return project.client;
    if (project.client && typeof project.client === 'object' && 'name' in project.client) return project.client.name;
    return '';
}

function getCategoryName(project: Project): string {
    if (project.category) return project.category;
    if (project.categories && project.categories[0]) return project.categories[0].name;
    return '';
}

export default function FeaturedProjects({ projects: propProjects, locale = 'tr' }: FeaturedProjectsProps) {
    const isEn = locale === 'en';
    const [projects, setProjects] = useState<Project[]>(propProjects || []);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const progressValue = useMotionValue(0);
    const progressWidth = useTransform(progressValue, [0, 100], ['0%', '100%']);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const AUTOPLAY_DURATION = 6000;

    // Fetch from API if no projects provided
    useEffect(() => {
        if (!propProjects || propProjects.length === 0) {
            async function fetchFromAPI() {
                try {
                    const res = await fetch('/api/admin/content/portfolio-slider');
                    const data = await res.json();
                    if (data.success && data.data?.slides) {
                        const slides: SliderItem[] = data.data.slides;
                        const converted: Project[] = slides
                            .sort((a, b) => a.order - b.order)
                            .map((s) => ({
                                id: s.id,
                                title: s.title,
                                category: s.category,
                                client: s.client || s.subtitle,
                                year: s.year,
                                image: s.image,
                                shortIntro: s.description,
                            }));
                        setProjects(converted);
                    }
                } catch (error) {
                    console.error('Error fetching portfolio slider:', error);
                }
            }
            fetchFromAPI();
        } else {
            setProjects(propProjects);
        }
    }, [propProjects]);

    const nextSlide = useCallback(() => {
        if (projects.length === 0) return;
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    }, [projects.length]);

    const prevSlide = useCallback(() => {
        if (projects.length === 0) return;
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    }, [projects.length]);

    const goToSlide = useCallback((index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    }, [currentIndex]);

    // Autoplay
    useEffect(() => {
        if (projects.length === 0) return;

        const startProgress = () => {
            progressValue.set(0);
            animate(progressValue, 100, { duration: AUTOPLAY_DURATION / 1000, ease: 'linear' });
        };

        startProgress();

        intervalRef.current = setInterval(() => {
            nextSlide();
            startProgress();
        }, AUTOPLAY_DURATION);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [currentIndex, nextSlide, progressValue, projects.length]);

    // Play video when slide changes
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => { });
        }
    }, [currentIndex]);

    if (projects.length === 0) return null;

    const currentProject = projects[currentIndex];
    const posterUrl = getPosterUrl(currentProject);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 1.1,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0,
            scale: 0.95,
        }),
    };

    return (
        <section className="relative w-full h-[80vh] md:h-[90vh] overflow-hidden bg-ink-900">
            {/* Background pattern overlay */}
            <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Background slider with video support */}
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                    className="absolute inset-0"
                >
                    {/* Video background if available */}
                    {currentProject.heroVideo ? (
                        <video
                            ref={videoRef}
                            src={currentProject.heroVideo}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    ) : (
                        <motion.img
                            src={posterUrl}
                            alt={currentProject.title}
                            className="absolute inset-0 w-full h-full object-cover"
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 6, ease: 'linear' }}
                        />
                    )}

                    {/* Multiple gradient overlays for depth */}
                    <div className="absolute inset-0 bg-gradient-to-r from-ink-900 via-ink-900/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/30 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-b from-ink-900/50 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Decorative corner elements */}
            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-forest-400/30 z-10" />
            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-forest-400/30 z-10" />

            {/* Left accent line */}
            <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-gradient-to-b from-transparent via-forest-400 to-transparent z-10" />

            {/* Content */}
            <div className="relative z-10 h-full container mx-auto px-6 md:px-12 lg:px-24 flex items-end pb-20 md:pb-28">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -40 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        {/* Category badge */}
                        {getCategoryName(currentProject) && (
                            <motion.span
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-5 py-2 bg-forest-500/20 backdrop-blur-md text-forest-300 text-sm font-medium mb-6 border border-forest-500/30"
                            >
                                <span className="w-2 h-2 bg-forest-400 rounded-full animate-pulse" />
                                {getCategoryName(currentProject)}
                            </motion.span>
                        )}

                        {/* Title */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-display text-4xl md:text-6xl lg:text-7xl xl:text-8xl text-paper-50 mb-6 leading-[0.9]"
                        >
                            {currentProject.title}
                        </motion.h2>

                        {/* Description */}
                        {(currentProject.shortIntro || currentProject.description) && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-paper-300 text-lg md:text-xl max-w-xl mb-8 line-clamp-2"
                            >
                                {currentProject.shortIntro || currentProject.description}
                            </motion.p>
                        )}

                        {/* Client & Year info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center gap-6 text-paper-400"
                        >
                            {getClientName(currentProject) && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                    <span>{getClientName(currentProject)}</span>
                                </div>
                            )}
                            {currentProject.year && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>{currentProject.year}</span>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation arrows */}
            <div className="absolute bottom-8 right-8 md:right-24 z-20 flex items-center gap-4">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full border border-paper-50/30 flex items-center justify-center text-paper-50 hover:bg-paper-50/10 transition-colors"
                    aria-label={isEn ? 'Previous slide' : 'Önceki slayt'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full border border-paper-50/30 flex items-center justify-center text-paper-50 hover:bg-paper-50/10 transition-colors"
                    aria-label={isEn ? 'Next slide' : 'Sonraki slayt'}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Slide indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                {projects.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-1 transition-all duration-300 ${index === currentIndex ? 'w-8 bg-forest-400' : 'w-4 bg-paper-50/30 hover:bg-paper-50/50'
                            }`}
                        aria-label={`${isEn ? 'Go to slide' : 'Slayta git'} ${index + 1}`}
                    />
                ))}
            </div>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-paper-50/10 z-20">
                <motion.div
                    className="h-full bg-forest-400"
                    style={{ width: progressWidth }}
                />
            </div>
        </section>
    );
}
