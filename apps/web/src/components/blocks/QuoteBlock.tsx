'use client';

import { motion } from 'framer-motion';

interface QuoteBlockProps {
    quote: string;
    author?: string;
    role?: string;
}

export default function QuoteBlock({ quote, author, role }: QuoteBlockProps) {
    return (
        <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-6 py-12 md:py-16"
        >
            <div className="relative">
                {/* Quote mark */}
                <span className="absolute -top-8 -left-4 text-8xl text-forest-500/20 font-serif leading-none">
                    "
                </span>

                {/* Quote text */}
                <p className="font-display text-2xl md:text-3xl lg:text-4xl text-ink-900 dark:text-paper-50 leading-relaxed italic">
                    {quote}
                </p>

                {/* Attribution */}
                {(author || role) && (
                    <footer className="mt-8 flex items-center gap-4">
                        {/* Avatar placeholder */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-forest-600 to-forest-800" />
                        <div>
                            {author && (
                                <cite className="not-italic font-medium text-ink-900 dark:text-paper-50">
                                    {author}
                                </cite>
                            )}
                            {role && (
                                <p className="text-sm text-ink-500 dark:text-paper-400">
                                    {role}
                                </p>
                            )}
                        </div>
                    </footer>
                )}
            </div>
        </motion.blockquote>
    );
}
