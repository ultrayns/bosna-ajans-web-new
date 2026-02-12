'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface HeroShowreelProps {
    headline: string;
    subline?: string;
    ctaPrimaryLabel?: string;
    ctaPrimaryUrl?: string;
    ctaSecondaryLabel?: string;
    ctaSecondaryUrl?: string;
    backgroundImages?: string[];
}

export default function HeroShowreel({
    headline,
    subline,
    ctaPrimaryLabel,
    ctaPrimaryUrl,
    ctaSecondaryLabel,
    ctaSecondaryUrl,
    backgroundImages = [],
}: HeroShowreelProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-rotate background images
    useEffect(() => {
        if (backgroundImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Images with Ken Burns effect */}
            {backgroundImages.length > 0 ? (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5, ease: 'easeInOut' }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={backgroundImages[currentImageIndex]}
                            alt="Hero background"
                            fill
                            priority
                            className="object-cover object-center"
                            sizes="100vw"
                        />
                        {/* Dark overlay for text readability */}
                        <div className="absolute inset-0 bg-ink-900/60" />
                    </motion.div>
                </AnimatePresence>
            ) : (
                /* Fallback gradient if no images */
                <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-forest-900" />
            )}

            {/* Animated grain overlay */}
            <div className="absolute inset-0 opacity-10 bg-[url('/noise.png')] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-paper-50 leading-[1.1] tracking-tight max-w-5xl mx-auto drop-shadow-2xl"
                >
                    {headline}
                </motion.h1>

                {subline && (
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-6 text-lg md:text-xl text-paper-200 max-w-2xl mx-auto drop-shadow-lg"
                    >
                        {subline}
                    </motion.p>
                )}

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                >
                    {ctaPrimaryLabel && ctaPrimaryUrl && (
                        <Link
                            href={ctaPrimaryUrl}
                            className="inline-flex items-center justify-center px-8 py-4 bg-paper-50 text-ink-900 font-medium rounded-none hover:bg-paper-100 transition-colors duration-300 shadow-lg"
                        >
                            {ctaPrimaryLabel}
                            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    )}

                    {ctaSecondaryLabel && ctaSecondaryUrl && (
                        <Link
                            href={ctaSecondaryUrl}
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-paper-50 text-paper-50 font-medium rounded-none hover:bg-paper-50/20 transition-colors duration-300"
                        >
                            {ctaSecondaryLabel}
                        </Link>
                    )}
                </motion.div>

                {/* Image indicators */}
                {backgroundImages.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="mt-12 flex justify-center gap-2"
                    >
                        {backgroundImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentImageIndex
                                        ? 'bg-paper-50 w-6'
                                        : 'bg-paper-50/40 hover:bg-paper-50/60'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 border-2 border-paper-300 rounded-full flex justify-center"
                >
                    <motion.div
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-1 h-2 bg-paper-300 rounded-full mt-2"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
}
