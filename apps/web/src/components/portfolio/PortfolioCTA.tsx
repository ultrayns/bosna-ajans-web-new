'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface PortfolioCTAProps {
    locale?: string;
}

export default function PortfolioCTA({ locale = 'tr' }: PortfolioCTAProps) {
    const isEn = locale === 'en';

    return (
        <section className="py-24 md:py-32 bg-ink-950 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                    backgroundSize: '48px 48px'
                }} />
            </div>

            {/* Decorative gradient orbs */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-forest-500/10 rounded-full blur-[150px]" />
            <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-forest-600/10 rounded-full blur-[120px]" />

            {/* Decorative lines */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-forest-400 to-transparent" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-forest-400 to-transparent" />

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Eyebrow */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-forest-400 text-sm font-medium uppercase tracking-widest mb-6"
                    >
                        {isEn ? 'Ready to Start?' : 'Başlamaya Hazır mısınız?'}
                    </motion.p>

                    {/* Main headline */}
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-paper-50 mb-6 leading-[1.1]"
                    >
                        {isEn ? "Let's Create Something" : 'Birlikte Bir Şey'}
                        <span className="block text-forest-400">
                            {isEn ? 'Beautiful Together' : 'Güzel Yaratalım'}
                        </span>
                    </motion.h2>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-paper-300 max-w-2xl mx-auto mb-12"
                    >
                        {isEn
                            ? "Have a project in mind? We'd love to hear about it. Let's discuss how we can bring your vision to life."
                            : 'Aklınızda bir proje mi var? Duymaktan mutluluk duyarız. Vizyonunuzu nasıl hayata geçirebileceğimizi konuşalım.'}
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/contact"
                            className="group inline-flex items-center gap-3 px-10 py-5 bg-forest-500 text-paper-50 font-semibold hover:bg-forest-600 transition-all duration-300"
                        >
                            <span>{isEn ? 'Start a Project' : 'Proje Başlat'}</span>
                            <svg
                                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>

                        <Link
                            href="/services"
                            className="inline-flex items-center gap-3 px-10 py-5 border border-paper-50/30 text-paper-50 font-medium hover:bg-paper-50/10 transition-all duration-300"
                        >
                            <span>{isEn ? 'View Services' : 'Hizmetleri Gör'}</span>
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-16 flex flex-wrap items-center justify-center gap-8 text-paper-400 text-sm"
                    >
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{isEn ? 'Free Consultation' : 'Ücretsiz Danışmanlık'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{isEn ? 'Quick Response' : 'Hızlı Yanıt'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-forest-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{isEn ? 'Tailored Solutions' : 'Özel Çözümler'}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
