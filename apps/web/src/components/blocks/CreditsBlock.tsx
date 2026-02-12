'use client';

import { motion } from 'framer-motion';

interface Credit {
    role: string;
    name: string;
}

interface CreditsBlockProps {
    credits?: Credit[];
}

export default function CreditsBlock({ credits = [] }: CreditsBlockProps) {
    if (credits.length === 0) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto px-6 py-12 border-t border-ink-200 dark:border-paper-50/10"
        >
            <h3 className="font-display text-2xl text-ink-900 dark:text-paper-50 mb-8">
                Credits
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {credits.map((credit, index) => (
                    <motion.div
                        key={`${credit.role}-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                        <p className="text-sm text-ink-500 dark:text-paper-400 uppercase tracking-wider">
                            {credit.role}
                        </p>
                        <p className="text-ink-900 dark:text-paper-50 font-medium mt-1">
                            {credit.name}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
