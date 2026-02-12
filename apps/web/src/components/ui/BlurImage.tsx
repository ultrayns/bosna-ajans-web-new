'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface BlurImageProps {
    src: string;
    alt: string;
    className?: string;
    blurDataURL?: string;
    width?: number;
    height?: number;
    fill?: boolean;
    priority?: boolean;
    children?: ReactNode;
}

/**
 * Image component with LQIP (Low Quality Image Placeholder) blur effect
 * Shows a blurred low-res placeholder while the full image loads
 */
export default function BlurImage({
    src,
    alt,
    className = '',
    blurDataURL,
    width,
    height,
    fill = false,
    priority = false,
    children,
}: BlurImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Generate a simple blur data URL if not provided
    const placeholderDataURL = blurDataURL ||
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg==';

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        // Check if already loaded (from cache)
        if (img.complete && img.naturalHeight !== 0) {
            setIsLoaded(true);
        }
    }, []);

    const handleLoad = () => {
        setIsLoaded(true);
    };

    const handleError = () => {
        setHasError(true);
    };

    const containerClasses = fill
        ? 'absolute inset-0'
        : 'relative';

    const imageClasses = `
    ${fill ? 'absolute inset-0 w-full h-full object-cover' : ''}
    transition-opacity duration-500 ease-out
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${className}
  `;

    const placeholderClasses = `
    ${fill ? 'absolute inset-0 w-full h-full object-cover' : 'absolute inset-0 w-full h-full object-cover'}
    transition-opacity duration-500 ease-out
    ${isLoaded ? 'opacity-0' : 'opacity-100'}
    blur-lg scale-105
  `;

    return (
        <div className={containerClasses}>
            {/* Placeholder */}
            {!hasError && (
                <img
                    src={placeholderDataURL}
                    alt=""
                    className={placeholderClasses}
                    aria-hidden="true"
                />
            )}

            {/* Main image */}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={imageClasses}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
            />

            {/* Children (overlay content) */}
            {children}
        </div>
    );
}
