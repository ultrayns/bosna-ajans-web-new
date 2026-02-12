'use client';

import { motion } from 'framer-motion';

interface ProcessStep {
    title: string;
    description?: string;
}

interface ProcessProps {
    title?: string;
    steps: ProcessStep[];
}

export default function Process({ title = 'Our Process', steps }: ProcessProps) {
    return (
        <section className="py-24 md:py-32 bg-ink-900 dark:bg-ink-950">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50">
                        {title}
                    </h2>
                </motion.div>

                {/* Process Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="relative"
                        >
                            {/* Step Number */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                                className="w-12 h-12 rounded-full bg-forest-600 flex items-center justify-center text-paper-50 font-display text-lg mb-6"
                            >
                                {index + 1}
                            </motion.div>

                            {/* Connector line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-6 left-12 w-full h-px bg-gradient-to-r from-forest-600 to-transparent" />
                            )}

                            {/* Content */}
                            <h3 className="text-xl font-display text-paper-50 mb-3">
                                {step.title}
                            </h3>
                            {step.description && (
                                <p className="text-paper-400 leading-relaxed">
                                    {step.description}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
