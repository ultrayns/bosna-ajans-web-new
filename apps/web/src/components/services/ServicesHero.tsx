'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface ServicesHeroProps {
    locale?: string;
}

const heroVideos = [
    '/media/videos/video-production.mp4',
    '/media/videos/fashion-photography.mp4',
    '/media/videos/product-photography.mp4',
    '/media/videos/post-production.mp4',
];

export default function ServicesHero({ locale = 'tr' }: ServicesHeroProps) {
    const isEn = locale === 'en';
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const nextVideo = useCallback(() => {
        setCurrentVideoIndex((prev) => (prev + 1) % heroVideos.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextVideo, 8000);
        return () => clearInterval(interval);
    }, [nextVideo]);

    return (
        <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden bg-ink-950">
            {/* Video Background */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentVideoIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="absolute inset-0"
                >
                    <video
                        src={heroVideos[currentVideoIndex]}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadedData={() => setIsLoaded(true)}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </motion.div>
            </AnimatePresence>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 via-ink-950/60 to-ink-950/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '40px 40px'
            }} />

            {/* Content */}
            <div className="relative z-10 h-full container mx-auto px-6 md:px-12 lg:px-24 flex flex-col justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 40 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="max-w-4xl"
                >
                    {/* Tagline */}
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="inline-block px-4 py-2 bg-forest-500/20 backdrop-blur-sm border border-forest-500/30 rounded-full text-forest-400 text-sm font-medium mb-6"
                    >
                        {isEn ? 'Professional Production Services' : 'Profesyonel Prodüksiyon Hizmetleri'}
                    </motion.span>

                    {/* Title */}
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-paper-50 leading-[0.95] mb-6">
                        <motion.span
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="block"
                        >
                            {isEn ? 'Creative' : 'Yaratıcı'}
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.75 }}
                            className="block text-forest-400"
                        >
                            {isEn ? 'Excellence' : 'Mükemmellik'}
                        </motion.span>
                    </h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="text-lg md:text-xl text-paper-300 max-w-2xl leading-relaxed"
                    >
                        {isEn
                            ? 'From concept to final delivery, we bring your vision to life with world-class production services tailored to your brand.'
                            : 'Konseptten son teslimata kadar, markanıza özel dünya standartlarında prodüksiyon hizmetleriyle vizyonunuzu hayata geçiriyoruz.'}
                    </motion.p>

                    {/* Stats Row */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                        className="flex flex-wrap gap-8 md:gap-12 mt-10"
                    >
                        <div>
                            <span className="block text-3xl md:text-4xl font-display text-paper-50">6</span>
                            <span className="text-sm text-paper-400">{isEn ? 'Core Services' : 'Ana Hizmet'}</span>
                        </div>
                        <div>
                            <span className="block text-3xl md:text-4xl font-display text-paper-50">500+</span>
                            <span className="text-sm text-paper-400">{isEn ? 'Projects' : 'Proje'}</span>
                        </div>
                        <div>
                            <span className="block text-3xl md:text-4xl font-display text-paper-50">12</span>
                            <span className="text-sm text-paper-400">{isEn ? 'Years Experience' : 'Yıl Deneyim'}</span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Video indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.3 }}
                    className="absolute bottom-12 left-6 md:left-12 lg:left-24 flex gap-2"
                >
                    {heroVideos.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentVideoIndex(index)}
                            className={`w-12 h-1 rounded-full transition-all duration-500 ${index === currentVideoIndex
                                    ? 'bg-forest-500 w-20'
                                    : 'bg-paper-50/30 hover:bg-paper-50/50'
                                }`}
                            aria-label={`Video ${index + 1}`}
                        />
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-12 right-6 md:right-12 lg:right-24 flex flex-col items-center gap-2"
                >
                    <span className="text-paper-400 text-xs uppercase tracking-widest vertical-text hidden md:block"
                        style={{ writingMode: 'vertical-rl' }}>
                        {isEn ? 'Scroll' : 'Kaydır'}
                    </span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-5 h-8 rounded-full border-2 border-paper-400/50 flex items-start justify-center p-1"
                    >
                        <div className="w-1 h-2 bg-paper-400 rounded-full" />
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-forest-500/30" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-forest-500/30" />
        </section>
    );
}
