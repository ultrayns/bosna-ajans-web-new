'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface VideoBlockProps {
    videoUrl?: string;
    caption?: string;
    autoPlay?: boolean;
    loop?: boolean;
}

export default function VideoBlock({
    videoUrl,
    caption,
    autoPlay = false,
    loop = true
}: VideoBlockProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
        >
            {/* Video container with aspect ratio */}
            <div className="relative aspect-video bg-ink-900 overflow-hidden">
                {/* Placeholder gradient - replace with actual video */}
                <div className="absolute inset-0 bg-gradient-to-br from-ink-800 to-forest-900" />

                {/* Play/Pause button overlay */}
                <button
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center group"
                >
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${isPlaying
                                ? 'bg-paper-50/20 group-hover:bg-paper-50/30'
                                : 'bg-paper-50 group-hover:bg-paper-100'
                            }`}
                    >
                        {isPlaying ? (
                            <svg className="w-8 h-8 text-paper-50" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                        ) : (
                            <svg className="w-8 h-8 text-ink-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </motion.div>
                </button>
            </div>

            {/* Caption */}
            {caption && (
                <p className="mt-4 text-sm text-ink-500 dark:text-paper-400 text-center">
                    {caption}
                </p>
            )}
        </motion.div>
    );
}
