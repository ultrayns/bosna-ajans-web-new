'use client';

import ProjectStartModal from '@/components/ui/ProjectStartModal';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SiteSettings {
    brandName: string;
    tagline: string;
    contact: {
        email: string;
        phone: string;
        address: string;
    };
    social: {
        instagram?: string;
        vimeo?: string;
        behance?: string;
        linkedin?: string;
        youtube?: string;
    };
}

interface CTAFooterProps {
    headline?: string;
    showEmail?: boolean;
    showSocials?: boolean;
    locale?: string;
}

const defaultSettings: SiteSettings = {
    brandName: 'BOSNA AJANS',
    tagline: 'Çekim ve Prodüksiyon Hizmeti',
    contact: {
        email: 'info@bosnaajans.com',
        phone: '0546 716 88 06',
        address: 'İstanbul, Türkiye',
    },
    social: {
        instagram: 'https://www.instagram.com/bosna_ajans/',
    },
};

export default function CTAFooter({
    headline,
    showEmail = true,
    showSocials = true,
    locale = 'tr',
}: CTAFooterProps) {
    const isEn = locale === 'en';
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings);

    // Fetch site settings from API
    useEffect(() => {
        async function fetchSettings() {
            try {
                const res = await fetch('/api/admin/content/site-settings');
                const data = await res.json();
                if (data.success && data.data) {
                    setSiteSettings(data.data);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
            }
        }
        fetchSettings();
    }, []);

    // Use provided headline or default based on locale
    const displayHeadline = headline || (isEn ? "Let's make something iconic." : "Birlikte ikonik bir şey yaratalım.");

    return (
        <>
            <section className="py-24 md:py-40 bg-ink-900 dark:bg-ink-950 relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-forest-600 rounded-full blur-[150px]" />
                </div>

                <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Headline */}
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-paper-50 mb-8"
                        >
                            {displayHeadline}
                        </motion.h2>

                        {/* Start Project Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.15 }}
                            className="mb-12"
                        >
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="group relative inline-flex items-center gap-3 px-10 py-5 bg-forest-500 text-paper-50 font-semibold text-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-forest-500/30 rounded-lg"
                            >
                                <span className="relative z-10">
                                    {isEn ? 'Start Your Project' : 'Projenizi Başlatın'}
                                </span>
                                <svg className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                                <span className="absolute inset-0 bg-forest-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            </button>
                        </motion.div>

                        {/* Email */}
                        {showEmail && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="mb-12"
                            >
                                <p className="text-paper-400 text-sm mb-2">
                                    {isEn ? 'or email us directly' : 'ya da doğrudan e-posta gönderin'}
                                </p>
                                <a
                                    href={`mailto:${siteSettings.contact.email}`}
                                    className="text-xl md:text-2xl text-paper-50 border-b-2 border-forest-500 pb-2 hover:border-paper-50 transition-colors"
                                >
                                    {siteSettings.contact.email}
                                </a>
                            </motion.div>
                        )}

                        {/* Social Links */}
                        {showSocials && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-wrap justify-center gap-6"
                            >
                                {siteSettings.social.instagram && (
                                    <a
                                        href={siteSettings.social.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-paper-400 hover:text-paper-50 transition-colors"
                                    >
                                        Instagram
                                    </a>
                                )}
                                {siteSettings.social.vimeo && (
                                    <a
                                        href={siteSettings.social.vimeo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-paper-400 hover:text-paper-50 transition-colors"
                                    >
                                        Vimeo
                                    </a>
                                )}
                                {siteSettings.social.behance && (
                                    <a
                                        href={siteSettings.social.behance}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-paper-400 hover:text-paper-50 transition-colors"
                                    >
                                        Behance
                                    </a>
                                )}
                                {siteSettings.social.linkedin && (
                                    <a
                                        href={siteSettings.social.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-paper-400 hover:text-paper-50 transition-colors"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Footer copyright */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="mt-24 pt-8 border-t border-paper-50/10 flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-paper-400 text-sm">
                            © {new Date().getFullYear()} {siteSettings.brandName}. {isEn ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link href="/privacy" className="text-paper-400 hover:text-paper-50 transition-colors">
                                {isEn ? 'Privacy' : 'Gizlilik'}
                            </Link>
                            <Link href="/terms" className="text-paper-400 hover:text-paper-50 transition-colors">
                                {isEn ? 'Terms' : 'Şartlar'}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Project Start Modal */}
            <ProjectStartModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                locale={locale}
            />
        </>
    );
}
