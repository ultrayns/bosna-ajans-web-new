'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect } from 'react';

interface ImageLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    imageAlt: string;
    title?: string;
    category?: string;
}

export default function ImageLightbox({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
    title,
    category,
}: ImageLightboxProps) {
    // ESC tuşu ile kapatma
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    onClick={onClose}
                >
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-ink-900/95 backdrop-blur-md"
                    />

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-paper-50/10 hover:bg-paper-50/20 rounded-full text-paper-50 transition-colors"
                        aria-label="Kapat"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Image container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                        className="relative max-w-[90vw] max-h-[85vh] z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Category badge */}
                        {category && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute top-4 left-4 z-10"
                            >
                                <span className="inline-block px-3 py-1.5 bg-forest-500/90 backdrop-blur-sm text-paper-50 text-xs font-medium uppercase tracking-wider">
                                    {category}
                                </span>
                            </motion.div>
                        )}

                        {/* Image */}
                        <img
                            src={imageSrc}
                            alt={imageAlt}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                        />

                        {/* Title */}
                        {title && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink-900/90 to-transparent rounded-b-lg"
                            >
                                <h3 className="text-xl font-display text-paper-50">{title}</h3>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Instructions */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-paper-50/60 text-sm"
                    >
                        Kapatmak için ESC tuşuna basın veya dışarı tıklayın
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
