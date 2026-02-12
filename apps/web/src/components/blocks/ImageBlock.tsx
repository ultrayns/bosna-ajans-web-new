'use client';

import { motion } from 'framer-motion';

interface ImageBlockProps {
    imageUrl?: string;
    alt?: string;
    caption?: string;
    layout?: 'contained' | 'full-bleed' | 'wide';
}

export default function ImageBlock({
    imageUrl,
    alt = '',
    caption,
    layout = 'contained'
}: ImageBlockProps) {
    const containerClass = {
        'contained': 'max-w-4xl mx-auto px-6',
        'wide': 'max-w-6xl mx-auto px-6',
        'full-bleed': 'w-full',
    }[layout];

    return (
        <motion.figure
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={containerClass}
        >
            {/* Image container */}
            <div className="relative aspect-[16/9] bg-ink-800 overflow-hidden">
                {/* Placeholder gradient - replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-br from-forest-700 via-ink-700 to-ink-900" />
            </div>

            {/* Caption */}
            {caption && (
                <figcaption className="mt-4 text-sm text-ink-500 dark:text-paper-400 text-center">
                    {caption}
                </figcaption>
            )}
        </motion.figure>
    );
}
