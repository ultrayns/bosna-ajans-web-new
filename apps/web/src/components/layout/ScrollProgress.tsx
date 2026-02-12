'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ScrollProgress() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            setProgress(scrollPercent);
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <button
            onClick={scrollToTop}
            className="relative flex flex-col items-center gap-2 text-paper-300 hover:text-paper-50 transition-colors"
            aria-label="Scroll to top"
        >
            {/* Progress Line */}
            <div className="relative w-0.5 h-16 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                    className="absolute bottom-0 left-0 right-0 bg-forest-500 rounded-full"
                    style={{ height: `${progress}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${progress}%` }}
                    transition={{ duration: 0.1 }}
                />
            </div>

            {/* Dot indicator */}
            <motion.div
                className="w-2 h-2 rounded-full bg-forest-500"
                animate={{ scale: progress > 5 ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
            />
        </button>
    );
}
