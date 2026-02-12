'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect } from 'react';

interface LightboxProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
    imageAlt: string;
    allImages?: { src: string; alt: string;[key: string]: unknown }[];
    currentIndex?: number;
    onNavigate?: (index: number) => void;
}

export default function Lightbox({
    isOpen,
    onClose,
    imageSrc,
    imageAlt,
    allImages,
    currentIndex = 0,
    onNavigate,
}: LightboxProps) {
    const hasNavigation = allImages && allImages.length > 1 && onNavigate;

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
        if (hasNavigation) {
            if (e.key === 'ArrowRight') {
                onNavigate?.((currentIndex + 1) % allImages!.length);
            }
            if (e.key === 'ArrowLeft') {
                onNavigate?.((currentIndex - 1 + allImages!.length) % allImages!.length);
            }
        }
    }, [onClose, hasNavigation, currentIndex, allImages, onNavigate]);

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
                    <div className="absolute inset-0 bg-ink-950/95 backdrop-blur-md" />

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center bg-paper-50/10 hover:bg-paper-50/20 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Arrows */}
                    {hasNavigation && (
                        <>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate?.((currentIndex - 1 + allImages!.length) % allImages!.length);
                                }}
                                className="absolute left-6 z-10 w-12 h-12 flex items-center justify-center bg-paper-50/10 hover:bg-paper-50/20 rounded-full transition-colors"
                                aria-label="Previous"
                            >
                                <svg className="w-6 h-6 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onNavigate?.((currentIndex + 1) % allImages!.length);
                                }}
                                className="absolute right-6 z-10 w-12 h-12 flex items-center justify-center bg-paper-50/10 hover:bg-paper-50/20 rounded-full transition-colors"
                                aria-label="Next"
                            >
                                <svg className="w-6 h-6 text-paper-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-[90vw] max-h-[90vh] z-10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={imageSrc}
                            alt={imageAlt}
                            width={1200}
                            height={800}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                            priority
                        />

                        {/* Image caption */}
                        <div className="absolute -bottom-12 left-0 right-0 text-center">
                            <p className="text-paper-300 text-sm">{imageAlt}</p>
                            {hasNavigation && (
                                <p className="text-paper-500 text-xs mt-1">
                                    {currentIndex + 1} / {allImages!.length}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
