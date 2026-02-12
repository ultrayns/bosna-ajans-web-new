'use client';

import { motion } from 'framer-motion';

interface Award {
    title: string;
    year: number;
    type: 'award' | 'press';
}

interface AwardsPressProps {
    title?: string;
    awards: Award[];
}

export default function AwardsPress({ title = 'Recognition', awards }: AwardsPressProps) {
    return (
        <section className="py-24 md:py-32 bg-paper-50 dark:bg-ink-900">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-ink-900 dark:text-paper-50">
                        {title}
                    </h2>
                </motion.div>

                {/* Awards List */}
                <div className="space-y-0 border-t border-ink-200 dark:border-paper-50/10">
                    {awards.map((award, index) => (
                        <motion.div
                            key={`${award.title}-${award.year}`}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="flex items-center justify-between py-6 border-b border-ink-200 dark:border-paper-50/10 group hover:bg-ink-100/50 dark:hover:bg-paper-50/5 px-4 -mx-4 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Type indicator */}
                                <span className={`w-2 h-2 rounded-full ${award.type === 'award' ? 'bg-forest-500' : 'bg-oxide-500'}`} />

                                {/* Award title */}
                                <h3 className="text-lg md:text-xl font-medium text-ink-900 dark:text-paper-50 group-hover:text-forest-600 dark:group-hover:text-forest-400 transition-colors">
                                    {award.title}
                                </h3>
                            </div>

                            {/* Year */}
                            <span className="text-ink-500 dark:text-paper-400 font-mono">
                                {award.year}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
