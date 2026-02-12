'use client';

import { useMenuStore } from '@/lib/store';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuLinks = [
    { key: 'home', href: '' },
    { key: 'portfolio', href: '/portfolio' },
    { key: 'services', href: '/services' },
    { key: 'contact', href: '/contact' },
];

const socialLinks = [
    { name: 'Instagram', href: 'https://instagram.com/bosnaajans' },
    { name: 'Vimeo', href: 'https://vimeo.com/bosnaajans' },
    { name: 'Behance', href: 'https://behance.net/bosnaajans' },
    { name: 'YouTube', href: 'https://youtube.com/@bosnaajans' },
];

export function MegaMenu() {
    const t = useTranslations('navigation');
    const { isOpen, close } = useMenuStore();
    const params = useParams();
    const locale = params.locale as string;

    // Close on escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                close();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, close]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const [contactInfo, setContactInfo] = useState({
        email: 'info@bosnaajans.com',
        phone: '+90 555 123 45 67',
        address: 'İstanbul, Türkiye'
    });

    // Fetch contact info
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                const res = await fetch('/api/admin/content/site-settings');
                const data = await res.json();
                if (data.success && data.data?.contact) {
                    setContactInfo({
                        email: data.data.contact.email,
                        phone: data.data.contact.phone,
                        address: data.data.contact.address
                    });
                }
            } catch (error) {
                console.error('Error fetching contact info:', error);
            }
        };

        if (isOpen) {
            fetchContactInfo();
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-paper-50/90 dark:bg-ink-900/90 backdrop-blur-lg z-[var(--z-overlay)]"
                        onClick={close}
                    />

                    {/* Menu Panel */}
                    <motion.nav
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-x-0 top-0 min-h-screen md:min-h-0 md:h-auto z-[var(--z-modal)] flex flex-col md:flex-row items-stretch"
                    >
                        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-20">
                            {/* Social Links */}
                            <div className="flex flex-col gap-4">
                                <span className="text-caption text-ink-400 dark:text-paper-300/60 uppercase tracking-widest mb-2">
                                    Social
                                </span>
                                {socialLinks.map((link, index) => (
                                    <motion.a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + index * 0.05 }}
                                        className="text-body text-ink-700 dark:text-paper-200 hover:text-ink-900 dark:hover:text-paper-50 transition-colors"
                                    >
                                        {link.name}
                                    </motion.a>
                                ))}
                            </div>

                            {/* Main Menu Links */}
                            <div className="flex flex-col gap-2 md:col-span-1">
                                <span className="text-caption text-ink-400 dark:text-paper-300/60 uppercase tracking-widest mb-4">
                                    Menu
                                </span>
                                {menuLinks.map((link, index) => (
                                    <motion.div
                                        key={link.key}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.15 + index * 0.08 }}
                                    >
                                        <Link
                                            href={`/${locale}${link.href}`}
                                            onClick={close}
                                            className="group flex items-center gap-4 py-2 text-display-md font-display text-ink-900 dark:text-paper-50 hover:text-forest-600 dark:hover:text-forest-400 transition-colors"
                                        >
                                            <span>{t(link.key)}</span>
                                            <motion.span
                                                className="text-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                initial={{ x: -4 }}
                                                whileHover={{ x: 0 }}
                                            >
                                                →
                                            </motion.span>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Get in Touch */}
                            <div className="flex flex-col gap-4">
                                <span className="text-caption text-ink-400 dark:text-paper-300/60 uppercase tracking-widest mb-2">
                                    {t('getInTouch')}
                                </span>
                                <motion.a
                                    href={`mailto:${contactInfo.email}`}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-body-lg text-ink-700 dark:text-paper-200 hover:text-ink-900 dark:hover:text-paper-50 transition-colors"
                                >
                                    {contactInfo.email}
                                </motion.a>
                                <motion.a
                                    href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-body text-ink-600 dark:text-paper-300 hover:text-ink-900 dark:hover:text-paper-50 transition-colors"
                                >
                                    {contactInfo.phone}
                                </motion.a>
                                <motion.p
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="text-caption text-ink-400 dark:text-paper-300/60 mt-4"
                                >
                                    {contactInfo.address}
                                </motion.p>
                            </div>
                        </div>
                    </motion.nav>
                </>
            )}
        </AnimatePresence>
    );
}
