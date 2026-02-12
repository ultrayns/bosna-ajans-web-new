'use client';

import { motion } from 'framer-motion';

interface GalleryImage {
    url: string;
    alt?: string;
}

interface GalleryBlockProps {
    images?: GalleryImage[];
    columns?: 2 | 3 | 4;
    gap?: 'small' | 'medium' | 'large';
}

export default function GalleryBlock({
    images = [],
    columns = 3,
    gap = 'medium'
}: GalleryBlockProps) {
    const gapClass = {
        'small': 'gap-2',
        'medium': 'gap-4',
        'large': 'gap-8',
    }[gap];

    const colsClass = {
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
    }[columns];

    // Use placeholder images if none provided
    const displayImages = images.length > 0 ? images : [
        { url: '', alt: 'Gallery image 1' },
        { url: '', alt: 'Gallery image 2' },
        { url: '', alt: 'Gallery image 3' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-6"
        >
            <div className={`grid ${colsClass} ${gapClass}`}>
                {displayImages.map((image, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="aspect-square bg-ink-800 overflow-hidden group cursor-pointer"
                    >
                        {/* Placeholder gradient */}
                        <div className="w-full h-full bg-gradient-to-br from-forest-700/50 via-ink-700 to-ink-900 group-hover:scale-105 transition-transform duration-500" />
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
