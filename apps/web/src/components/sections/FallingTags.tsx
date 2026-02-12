'use client';

import { motion, useInView } from 'framer-motion';
import { useMemo, useRef } from 'react';

// Etiket verileri - modern, sofistike renkler ve stiller
const tags = [
    { label: 'Züccaciye', gradient: 'from-stone-100 to-stone-200', text: 'text-stone-700', shadow: 'shadow-stone-200/50' },
    { label: 'Ürün', gradient: 'from-slate-100 to-slate-200', text: 'text-slate-700', shadow: 'shadow-slate-200/50' },
    { label: 'Yemek', gradient: 'from-amber-50 to-amber-100', text: 'text-amber-800', shadow: 'shadow-amber-200/50' },
    { label: 'Sağlık', gradient: 'from-emerald-50 to-emerald-100', text: 'text-emerald-700', shadow: 'shadow-emerald-200/50' },
    { label: 'Katalog', gradient: 'from-lime-100 to-lime-200', text: 'text-lime-800', shadow: 'shadow-lime-200/50' },
    { label: 'Tanıtım Filmi', gradient: 'from-sky-50 to-sky-100', text: 'text-sky-700 italic', shadow: 'shadow-sky-200/50' },
    { label: 'İmaj', gradient: 'from-violet-50 to-violet-100', text: 'text-violet-700', shadow: 'shadow-violet-200/50' },
    { label: 'Moda', gradient: 'from-rose-50 to-rose-100', text: 'text-rose-700', shadow: 'shadow-rose-200/50' },
    { label: 'Event', gradient: 'from-orange-50 to-orange-100', text: 'text-orange-700', shadow: 'shadow-orange-200/50' },
    { label: 'Reklam', gradient: 'from-cyan-50 to-cyan-100', text: 'text-cyan-700', shadow: 'shadow-cyan-200/50' },
];

interface FallingTag {
    id: number;
    label: string;
    gradient: string;
    text: string;
    shadow: string;
    x: number;
    delay: number;
    rotate: number;
    scale: number;
}

export default function FallingTags() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-50px' });

    // Etiket pozisyonlarını random olarak hesapla
    const fallingTags: FallingTag[] = useMemo(() => {
        return tags.map((tag, index) => ({
            id: index,
            label: tag.label,
            gradient: tag.gradient,
            text: tag.text,
            shadow: tag.shadow,
            x: 3 + (index * 9.2) + (Math.random() * 3 - 1.5),
            delay: 0.05 + index * 0.08 + Math.random() * 0.1,
            rotate: (Math.random() * 16 - 8), // -8 ile +8 derece arası
            scale: 0.9 + Math.random() * 0.2, // 0.9 - 1.1 arası
        }));
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute bottom-0 left-0 right-0 h-28 md:h-36 overflow-visible pointer-events-none z-20"
        >
            {/* Zemin çizgisi - subtle gradient */}
            <div className="absolute bottom-4 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-paper-50/30 to-transparent" />

            {/* Düşen etiketler */}
            {fallingTags.map((tag) => (
                <motion.div
                    key={tag.id}
                    initial={{
                        y: '-100vh',
                        opacity: 0,
                        rotate: tag.rotate - 30,
                        scale: 0.5,
                    }}
                    animate={isInView ? {
                        y: 0,
                        opacity: 1,
                        rotate: tag.rotate,
                        scale: tag.scale,
                    } : {}}
                    transition={{
                        type: 'spring',
                        damping: 12,
                        stiffness: 80,
                        mass: 1.2,
                        delay: tag.delay,
                        opacity: { duration: 0.3 },
                    }}
                    style={{
                        left: `${tag.x}%`,
                        transformOrigin: 'center bottom',
                    }}
                    className="absolute bottom-5"
                >
                    {/* Modern kutu tasarımı */}
                    <div
                        className={`
                            relative px-5 py-2.5 
                            bg-gradient-to-br ${tag.gradient}
                            rounded-2xl
                            shadow-lg ${tag.shadow}
                            backdrop-blur-sm
                            border border-white/60
                            transition-all duration-300
                            hover:scale-105 hover:shadow-xl
                            cursor-default
                            pointer-events-auto
                        `}
                        style={{
                            transform: `rotate(${tag.rotate}deg)`,
                        }}
                    >
                        {/* Glassmorphism efekti */}
                        <div className="absolute inset-0 rounded-2xl bg-white/20 backdrop-blur-[2px]" />

                        {/* İç glow efekti */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/10 to-white/30" />

                        {/* Etiket metni */}
                        <span className={`relative z-10 font-medium text-sm md:text-base whitespace-nowrap tracking-wide ${tag.text}`}>
                            {tag.label}
                        </span>

                        {/* Subtle shine efekti */}
                        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    </div>

                    {/* Gölge (ayrı element - daha gerçekçi) */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0.5 }}
                        animate={isInView ? { opacity: 0.15, scaleX: 1 } : {}}
                        transition={{ delay: tag.delay + 0.3, duration: 0.4 }}
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-ink-900 rounded-full blur-md"
                        style={{ transform: `translateX(-50%) rotate(${tag.rotate * 0.5}deg)` }}
                    />
                </motion.div>
            ))}
        </div>
    );
}
