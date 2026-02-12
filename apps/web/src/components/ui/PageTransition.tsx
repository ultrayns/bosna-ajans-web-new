'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
    },
    enter: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            when: 'beforeChildren',
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const overlayVariants = {
    initial: {
        scaleY: 1,
    },
    enter: {
        scaleY: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        scaleY: 1,
        transition: {
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
            >
                {/* Page overlay for dramatic transition */}
                <motion.div
                    className="fixed inset-0 bg-ink-900 origin-top z-50 pointer-events-none"
                    variants={overlayVariants}
                />

                {/* Page content */}
                <motion.div variants={pageVariants}>
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
