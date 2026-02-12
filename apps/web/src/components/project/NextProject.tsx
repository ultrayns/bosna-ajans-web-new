'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Project {
    title: string;
    slug: string;
    client: { name: string };
    heroPoster?: string;
}

interface NextProjectProps {
    project: Project;
}

export default function NextProject({ project }: NextProjectProps) {
    return (
        <section className="py-24 md:py-32 bg-ink-900">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-paper-400 text-sm uppercase tracking-wider mb-4">
                        Next Project
                    </p>

                    <Link href={`/portfolio/${project.slug}`} className="group block">
                        {/* Project preview */}
                        <div className="relative max-w-4xl mx-auto aspect-video bg-ink-800 overflow-hidden mb-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-forest-700 to-ink-800 group-hover:scale-105 transition-transform duration-700" />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-ink-900/40 group-hover:bg-ink-900/20 transition-colors duration-500" />

                            {/* View indicator */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-20 h-20 rounded-full bg-paper-50/20 group-hover:bg-paper-50 flex items-center justify-center transition-colors duration-300"
                                >
                                    <svg
                                        className="w-8 h-8 text-paper-50 group-hover:text-ink-900 transition-colors"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </motion.div>
                            </div>
                        </div>

                        {/* Project info */}
                        <p className="text-paper-400 text-sm mb-2">{project.client.name}</p>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-paper-50 group-hover:text-forest-400 transition-colors">
                            {project.title}
                        </h2>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
