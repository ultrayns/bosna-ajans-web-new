'use client';

import { motion } from 'framer-motion';

interface TextBlockProps {
    content: string;
    alignment?: 'left' | 'center';
}

export default function TextBlock({ content, alignment = 'left' }: TextBlockProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`max-w-3xl mx-auto px-6 ${alignment === 'center' ? 'text-center' : ''}`}
        >
            <div
                className="prose prose-lg dark:prose-invert prose-ink max-w-none
          prose-p:text-ink-700 dark:prose-p:text-paper-300 prose-p:leading-relaxed
          prose-headings:font-display prose-headings:text-ink-900 dark:prose-headings:text-paper-50
          prose-a:text-forest-600 dark:prose-a:text-forest-400"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </motion.div>
    );
}
