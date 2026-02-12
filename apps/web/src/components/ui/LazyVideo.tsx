'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazyVideoProps {
    src: string;
    poster?: string;
    className?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    playsInline?: boolean;
    hoverPlay?: boolean;
    children?: ReactNode;
}

/**
 * Lazy loading video component with IntersectionObserver
 * Only loads and plays video when visible in viewport
 */
export default function LazyVideo({
    src,
    poster,
    className = '',
    autoPlay = false,
    loop = true,
    muted = true,
    playsInline = true,
    hoverPlay = false,
    children,
}: LazyVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // IntersectionObserver for visibility
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        observer.observe(container);
        return () => observer.disconnect();
    }, []);

    // Load video when visible
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isVisible || isLoaded) return;

        video.src = src;
        video.load();
        setIsLoaded(true);
    }, [isVisible, isLoaded, src]);

    // Play/pause based on visibility
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isLoaded) return;

        if (hoverPlay) {
            // Hover-based playback
            if (isHovering && isVisible) {
                video.play().catch(() => { });
            } else {
                video.pause();
                video.currentTime = 0;
            }
        } else if (autoPlay) {
            // Auto-play based on visibility only
            if (isVisible) {
                video.play().catch(() => { });
            } else {
                video.pause();
            }
        }
    }, [isVisible, isHovering, isLoaded, autoPlay, hoverPlay]);

    // Hover intent handler (150-250ms delay)
    const handleMouseEnter = () => {
        if (!hoverPlay) return;

        hoverTimeoutRef.current = setTimeout(() => {
            setIsHovering(true);
        }, 200); // 200ms hover intent delay
    };

    const handleMouseLeave = () => {
        if (!hoverPlay) return;

        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
        setIsHovering(false);
    };

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Poster image (shown until video loads) */}
            {poster && !isHovering && (
                <img
                    src={poster}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isHovering && isLoaded ? 'opacity-0' : 'opacity-100'
                        }`}
                />
            )}

            {/* Video element */}
            <video
                ref={videoRef}
                poster={poster}
                loop={loop}
                muted={muted}
                playsInline={playsInline}
                className={`w-full h-full object-cover transition-opacity duration-300 ${hoverPlay && !isHovering ? 'opacity-0' : 'opacity-100'
                    }`}
                preload="none"
            />

            {/* Children (overlay content) */}
            {children}
        </div>
    );
}
