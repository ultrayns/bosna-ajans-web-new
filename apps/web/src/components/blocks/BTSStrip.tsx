'use client';

import { motion } from 'framer-motion';

interface BTSImage {
    url: string;
    alt?: string;
}

interface BTSStripProps {
    images?: BTSImage[];
}

export default function BTSStrip({ images = [] }: BTSStripProps) {
    // Use placeholder images if none provided
    const displayImages = images.length > 0 ? images : [
        { url: '', alt: 'BTS 1' },
        { url: '', alt: 'BTS 2' },
        { url: '', alt: 'BTS 3' },
        { url: '', alt: 'BTS 4' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="py-8 bg-ink-100 dark:bg-ink-800"
        >
            <div className="max-w-6xl mx-auto px-6">
                <p className="text-sm text-ink-500 dark:text-paper-400 uppercase tracking-wider mb-4">
                    Behind the Scenes
                </p>
            </div>

            {/* Horizontal scroll container */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-4 px-6 pb-4" style={{ minWidth: 'min-content' }}>
                    {displayImages.map((image, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex-shrink-0 w-64 md:w-80 aspect-square bg-ink-800 overflow-hidden"
                        >
                            {/* Placeholder gradient */}
                            <div className="w-full h-full bg-gradient-to-br from-oxide-600/30 via-ink-700 to-ink-900" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
