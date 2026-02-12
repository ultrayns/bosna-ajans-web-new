'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface StatItem {
    value: number;
    suffix?: string;
    label: string;
    icon?: React.ReactNode;
}

interface PortfolioStatsProps {
    stats: StatItem[];
}

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true, margin: '-50px' });

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        const increment = value / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
                setCount(value);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, stepDuration);

        return () => clearInterval(timer);
    }, [isInView, value]);

    return (
        <span ref={ref} className="tabular-nums">
            {count}{suffix}
        </span>
    );
}

// Default icons for common stat types
const defaultIcons = {
    projects: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    categories: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
        </svg>
    ),
    clients: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    years: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
};

export default function PortfolioStats({ stats }: PortfolioStatsProps) {
    return (
        <section className="py-16 md:py-24 bg-forest-600 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.5) 50%, transparent 51%)',
                    backgroundSize: '80px 100%'
                }} />
            </div>

            {/* Decorative blur elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-forest-500/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-700/40 rounded-full blur-[150px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-forest-400/10 rounded-full blur-[100px]" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
                >
                    {stats.map((stat, index) => {
                        // Determine icon based on label keywords
                        let icon = stat.icon;
                        if (!icon) {
                            const labelLower = stat.label.toLowerCase();
                            if (labelLower.includes('proje') || labelLower.includes('project')) {
                                icon = defaultIcons.projects;
                            } else if (labelLower.includes('kategori') || labelLower.includes('categor')) {
                                icon = defaultIcons.categories;
                            } else if (labelLower.includes('müşteri') || labelLower.includes('client')) {
                                icon = defaultIcons.clients;
                            } else if (labelLower.includes('yıl') || labelLower.includes('year')) {
                                icon = defaultIcons.years;
                            }
                        }

                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="text-center group"
                            >
                                {/* Icon */}
                                {icon && (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        whileInView={{ scale: 1, opacity: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 + 0.2 }}
                                        className="inline-flex items-center justify-center w-14 h-14 bg-paper-50/10 rounded-full mb-4 text-forest-200 group-hover:bg-paper-50/20 group-hover:text-paper-50 transition-all"
                                    >
                                        {icon}
                                    </motion.div>
                                )}

                                {/* Value */}
                                <div className="font-display text-5xl md:text-6xl lg:text-7xl text-paper-50 mb-3">
                                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                </div>

                                {/* Label */}
                                <div className="text-forest-100/80 text-sm md:text-base font-medium tracking-wide uppercase">
                                    {stat.label}
                                </div>

                                {/* Decorative underline on hover */}
                                <motion.div
                                    className="mt-3 mx-auto h-0.5 bg-paper-50/30 group-hover:bg-paper-50/60 transition-all"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: 48 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
