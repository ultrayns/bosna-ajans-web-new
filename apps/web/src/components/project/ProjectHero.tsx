'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface ProjectHeroProps {
    title: string;
    client: string;
    year: number;
    categories: { name: string }[];
    services?: { name: string }[];
    shortIntro: string;
    heroPoster?: string;
    heroVideo?: string;
}

export default function ProjectHero({
    title,
    client,
    year,
    categories,
    services,
    shortIntro,
}: ProjectHeroProps) {
    return (
        <section className="relative min-h-[80vh] flex items-end pb-16 md:pb-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-800 to-forest-900" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-transparent to-transparent" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-24">
                {/* Back link */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <Link
                        href="/portfolio"
                        className="inline-flex items-center gap-2 text-paper-400 hover:text-paper-50 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        All Projects
                    </Link>
                </motion.div>

                {/* Meta */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-wrap items-center gap-3 text-paper-400 mb-4"
                >
                    <span>{client}</span>
                    <span>•</span>
                    <span>{year}</span>
                    {categories[0] && (
                        <>
                            <span>•</span>
                            <span className="text-forest-400">{categories[0].name}</span>
                        </>
                    )}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-paper-50 max-w-4xl"
                >
                    {title}
                </motion.h1>

                {/* Intro */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-6 text-xl text-paper-300 max-w-2xl"
                >
                    {shortIntro}
                </motion.p>

                {/* Services */}
                {services && services.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-8 flex flex-wrap gap-2"
                    >
                        {services.map((service) => (
                            <span
                                key={service.name}
                                className="px-4 py-2 border border-paper-50/20 text-paper-300 text-sm"
                            >
                                {service.name}
                            </span>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
