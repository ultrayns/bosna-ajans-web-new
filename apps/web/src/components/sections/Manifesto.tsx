'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import FallingTags from './FallingTags';

interface ManifestoProps {
    content: string;
    linkLabel?: string;
    linkUrl?: string;
    backgroundImage?: string;
}

export default function Manifesto({ content, linkLabel, linkUrl, backgroundImage }: ManifestoProps) {
    return (
        <section className="py-24 md:py-40 pb-32 md:pb-48 bg-forest-800 dark:bg-forest-900 relative overflow-hidden">
            {/* Background Image */}
            {backgroundImage && (
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImage}
                        alt="Background"
                        fill
                        className="object-cover"
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-forest-900/80" />
                </div>
            )}
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-paper-50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-paper-50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Manifesto content */}
                    <div
                        className="font-display text-2xl md:text-3xl lg:text-4xl text-paper-50 leading-relaxed space-y-6 [&>p]:opacity-90"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />

                    {/* Link */}
                    {linkLabel && linkUrl && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-12"
                        >
                            <Link
                                href={linkUrl}
                                className="inline-flex items-center gap-2 text-paper-50 border-b border-paper-50 pb-1 hover:border-transparent transition-colors"
                            >
                                {linkLabel}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Falling Tags Animation */}
            <FallingTags />
        </section>
    );
}
