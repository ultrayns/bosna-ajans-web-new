'use client';

import { useMenuStore } from '@/lib/store';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ScrollProgress } from './ScrollProgress';
import { ThemeToggle } from './ThemeToggle';

export function LeftRail() {
    const t = useTranslations('common');
    const { isOpen, toggle } = useMenuStore();

    return (
        <aside className="fixed left-0 top-0 h-screen w-[60px] bg-paper-100/80 dark:bg-ink-900/80 backdrop-blur-md border-r border-ink-900/5 dark:border-white/5 z-[var(--z-sticky)] hidden md:flex flex-col items-center justify-between py-6 transition-colors duration-300">
            {/* Logo / Dot */}
            <div className="flex flex-col items-center gap-4">
                <a
                    href="/"
                    className="w-8 h-8 rounded-full bg-forest-600 flex items-center justify-center hover:bg-forest-500 transition-colors"
                    aria-label="BOSNAAJANS"
                >
                    <span className="text-paper-50 text-xs font-bold">B</span>
                </a>
            </div>

            {/* Center - Menu Button */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={toggle}
                    className="group flex flex-col items-center gap-3 text-ink-600 dark:text-paper-300 hover:text-ink-900 dark:hover:text-paper-50 transition-colors"
                    aria-expanded={isOpen}
                    aria-label={isOpen ? t('close') : t('menu')}
                >
                    {/* Hamburger Icon */}
                    <div className="relative w-5 h-4 flex flex-col justify-between">
                        <motion.span
                            className="w-full h-0.5 bg-current origin-center"
                            animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="w-full h-0.5 bg-current"
                            animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="w-full h-0.5 bg-current origin-center"
                            animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    </div>

                    {/* Vertical Menu Text */}
                    <span className="writing-vertical text-caption uppercase tracking-widest">
                        {isOpen ? t('close') : t('menu')}
                    </span>
                </button>
            </div>

            {/* Bottom - Theme + Language + Email + Scroll Progress */}
            <div className="flex flex-col items-center gap-4">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Language Switcher */}
                <LanguageSwitcher />

                {/* Email (vertical) */}
                <a
                    href="mailto:info@bosnaajans.com"
                    className="writing-vertical text-caption text-ink-600 dark:text-paper-300 hover:text-ink-900 dark:hover:text-paper-50 transition-colors tracking-wider"
                >
                    info@bosnaajans.com
                </a>

                {/* Scroll Progress */}
                <ScrollProgress />
            </div>
        </aside>
    );
}
