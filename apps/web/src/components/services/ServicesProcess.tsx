'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface ServicesProcessProps {
    locale?: string;
}

const processSteps = [
    {
        number: '01',
        titleTr: 'Keşif & Brief',
        titleEn: 'Discovery & Brief',
        descTr: 'Projenizi ve hedeflerinizi detaylı olarak anlıyoruz.',
        descEn: 'We deeply understand your project and objectives.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        )
    },
    {
        number: '02',
        titleTr: 'Konsept Geliştirme',
        titleEn: 'Concept Development',
        descTr: 'Yaratıcı fikirler ve görsel yön belirleme.',
        descEn: 'Creative ideation and visual direction.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
        )
    },
    {
        number: '03',
        titleTr: 'Prodüksiyon',
        titleEn: 'Production',
        descTr: 'Profesyonel ekipman ve uzman kadroyla çekim.',
        descEn: 'Professional equipment and expert team production.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        number: '04',
        titleTr: 'Post Prodüksiyon',
        titleEn: 'Post Production',
        descTr: 'Renk grading, kurgu ve görsel efektler.',
        descEn: 'Color grading, editing, and visual effects.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2m10 2V2M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zm6 6h.01M12 16h.01M17 10h.01M17 16h.01M7 10h.01M7 16h.01" />
            </svg>
        )
    },
    {
        number: '05',
        titleTr: 'Teslimat',
        titleEn: 'Delivery',
        descTr: 'Tüm formatlarda optimum kalitede teslim.',
        descEn: 'Optimal quality delivery in all formats.',
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
        )
    },
];

export default function ServicesProcess({ locale = 'tr' }: ServicesProcessProps) {
    const isEn = locale === 'en';
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section className="py-24 md:py-32 bg-ink-950 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-paper-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-paper-50" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-paper-50" />
            </div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10" ref={containerRef}>
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <span className="text-forest-400 font-mono text-sm tracking-widest uppercase mb-4 block">
                        {isEn ? 'How We Work' : 'Nasıl Çalışıyoruz'}
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl text-paper-50 mb-6">
                        {isEn ? 'Our Process' : 'Çalışma Sürecimiz'}
                    </h2>
                    <p className="text-paper-300 text-lg max-w-2xl mx-auto">
                        {isEn
                            ? 'A structured approach to deliver exceptional results every time.'
                            : 'Her seferinde olağanüstü sonuçlar sunmak için yapılandırılmış yaklaşımımız.'}
                    </p>
                </motion.div>

                {/* Process timeline */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-forest-500/30 to-transparent -translate-y-1/2" />

                    {/* Animated progress line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: isInView ? 1 : 0 }}
                        transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                        className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-forest-500 -translate-y-1/2 origin-left"
                        style={{ transformOrigin: 'left' }}
                    />

                    {/* Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step.number}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative text-center group"
                            >
                                {/* Icon container */}
                                <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="relative mx-auto mb-6 w-20 h-20 rounded-full bg-ink-800 border-2 border-forest-500/30 group-hover:border-forest-500 transition-colors flex items-center justify-center"
                                >
                                    <span className="text-forest-400 group-hover:text-forest-300 transition-colors">
                                        {step.icon}
                                    </span>

                                    {/* Number badge */}
                                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-forest-500 text-paper-50 text-sm font-bold flex items-center justify-center">
                                        {step.number}
                                    </span>
                                </motion.div>

                                {/* Content */}
                                <h3 className="font-display text-xl text-paper-50 mb-3 group-hover:text-forest-400 transition-colors">
                                    {isEn ? step.titleEn : step.titleTr}
                                </h3>
                                <p className="text-paper-400 text-sm leading-relaxed">
                                    {isEn ? step.descEn : step.descTr}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
