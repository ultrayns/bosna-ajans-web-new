'use client';

import { motion } from 'framer-motion';

interface SplitBlockProps {
    content: string;
    imageUrl?: string;
    layout?: 'media-left' | 'media-right';
}

export default function SplitBlock({
    content,
    imageUrl,
    layout = 'media-left'
}: SplitBlockProps) {
    const isMediaLeft = layout === 'media-left';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto px-6"
        >
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${isMediaLeft ? '' : 'md:flex-row-reverse'
                }`}>
                {/* Media */}
                <motion.div
                    initial={{ opacity: 0, x: isMediaLeft ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`${isMediaLeft ? 'md:order-1' : 'md:order-2'}`}
                >
                    <div className="aspect-[4/3] bg-ink-800 overflow-hidden">
                        {/* Placeholder gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-ink-800" />
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: isMediaLeft ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className={`${isMediaLeft ? 'md:order-2' : 'md:order-1'}`}
                >
                    <div
                        className="prose dark:prose-invert prose-ink
              prose-headings:font-display prose-headings:text-ink-900 dark:prose-headings:text-paper-50
              prose-p:text-ink-600 dark:prose-p:text-paper-300"
                        dangerouslySetInnerHTML={{ __html: content }}
                    />
                </motion.div>
            </div>
        </motion.div>
    );
}
