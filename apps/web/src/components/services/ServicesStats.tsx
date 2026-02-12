'use client';

import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface ServicesStatsProps {
    locale?: string;
}

interface StatItem {
    value: number;
    suffix: string;
    labelTr: string;
    labelEn: string;
}

const stats: StatItem[] = [
    { value: 12, suffix: '+', labelTr: 'Yıl Deneyim', labelEn: 'Years Experience' },
    { value: 500, suffix: '+', labelTr: 'Tamamlanan Proje', labelEn: 'Projects Completed' },
    { value: 150, suffix: '+', labelTr: 'Mutlu Müşteri', labelEn: 'Happy Clients' },
    { value: 35, suffix: '', labelTr: 'Ödül & Başarı', labelEn: 'Awards & Recognition' },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
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

export default function ServicesStats({ locale = 'tr' }: ServicesStatsProps) {
    const isEn = locale === 'en';

    return (
        <section className="py-20 md:py-28 bg-forest-600 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.5) 50%, transparent 51%)',
                    backgroundSize: '60px 100%'
                }} />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-forest-500/30 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-forest-700/40 rounded-full blur-[120px]" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.labelEn}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="font-display text-5xl md:text-6xl lg:text-7xl text-paper-50 mb-3">
                                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-forest-100/80 text-sm md:text-base font-medium tracking-wide">
                                {isEn ? stat.labelEn : stat.labelTr}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
