'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

type CursorState = 'default' | 'view' | 'play' | 'drag' | 'link';

interface CursorPosition {
    x: number;
    y: number;
}

export default function CustomCursor() {
    const [position, setPosition] = useState<CursorPosition>({ x: 0, y: 0 });
    const [cursorState, setCursorState] = useState<CursorState>('default');
    const [isVisible, setIsVisible] = useState(false);
    const [isPointer, setIsPointer] = useState(false);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        setPosition({ x: e.clientX, y: e.clientY });

        // Check if hovering over clickable element
        const target = e.target as HTMLElement;

        // Make sure target has closest method (is an Element)
        const hasClosest = target && typeof target.closest === 'function';

        const isClickable = !!(
            target?.tagName === 'A' ||
            target?.tagName === 'BUTTON' ||
            (hasClosest && target.closest('a')) ||
            (hasClosest && target.closest('button')) ||
            (target && window.getComputedStyle(target).cursor === 'pointer')
        );

        setIsPointer(isClickable);

        // Check for custom cursor states via data attributes
        const cursorType = target?.dataset?.cursor || (hasClosest && target.closest('[data-cursor]')?.getAttribute('data-cursor'));

        if (cursorType === 'view') {
            setCursorState('view');
        } else if (cursorType === 'play') {
            setCursorState('play');
        } else if (cursorType === 'drag') {
            setCursorState('drag');
        } else if (isClickable) {
            setCursorState('link');
        } else {
            setCursorState('default');
        }
    }, []);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

    useEffect(() => {
        // Only enable on desktop
        if (window.matchMedia('(pointer: fine)').matches) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseenter', handleMouseEnter);
            document.addEventListener('mouseleave', handleMouseLeave);
            document.body.style.cursor = 'none';

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseenter', handleMouseEnter);
                document.removeEventListener('mouseleave', handleMouseLeave);
                document.body.style.cursor = 'auto';
            };
        }
    }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

    // Don't render on touch devices
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return null;
    }

    const getCursorSize = () => {
        switch (cursorState) {
            case 'view':
            case 'play':
            case 'drag':
                return 80;
            case 'link':
                return 40;
            default:
                return isPointer ? 40 : 12;
        }
    };

    const getCursorLabel = () => {
        switch (cursorState) {
            case 'view':
                return 'VIEW';
            case 'play':
                return 'PLAY';
            case 'drag':
                return 'DRAG';
            default:
                return null;
        }
    };

    const size = getCursorSize();
    const label = getCursorLabel();

    return (
        <>
            {/* Main cursor */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                animate={{
                    x: position.x - size / 2,
                    y: position.y - size / 2,
                    width: size,
                    height: size,
                    opacity: isVisible ? 1 : 0,
                }}
                transition={{
                    type: 'spring',
                    damping: 30,
                    stiffness: 400,
                    mass: 0.5,
                }}
            >
                <div
                    className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-200 ${label ? 'bg-paper-50' : isPointer ? 'bg-paper-50' : 'bg-paper-50'
                        }`}
                >
                    <AnimatePresence mode="wait">
                        {label && (
                            <motion.span
                                key={label}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="text-ink-900 text-xs font-bold tracking-wider"
                            >
                                {label}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Cursor dot (follows exactly) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                animate={{
                    x: position.x - 4,
                    y: position.y - 4,
                    opacity: isVisible && cursorState === 'default' && !isPointer ? 1 : 0,
                }}
                transition={{
                    type: 'tween',
                    duration: 0,
                }}
            >
                <div className="w-2 h-2 rounded-full bg-forest-500" />
            </motion.div>
        </>
    );
}
