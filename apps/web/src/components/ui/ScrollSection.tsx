'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ReactNode, useEffect, useRef } from 'react';

// Register plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollSectionProps {
    children: ReactNode;
    className?: string;
    animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale' | 'none';
    delay?: number;
    duration?: number;
    stagger?: boolean;
}

/**
 * Wrapper component that adds scroll-triggered animations to sections
 */
export default function ScrollSection({
    children,
    className = '',
    animation = 'fade-up',
    delay = 0,
    duration = 0.8,
    stagger = false,
}: ScrollSectionProps) {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section || animation === 'none') return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            gsap.set(section, { opacity: 1, y: 0, x: 0, scale: 1 });
            return;
        }

        // Get initial and final states based on animation type
        const getAnimationProps = () => {
            switch (animation) {
                case 'fade-up':
                    return { from: { opacity: 0, y: 60 }, to: { opacity: 1, y: 0 } };
                case 'fade-in':
                    return { from: { opacity: 0 }, to: { opacity: 1 } };
                case 'slide-left':
                    return { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } };
                case 'slide-right':
                    return { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } };
                case 'scale':
                    return { from: { opacity: 0, scale: 0.95 }, to: { opacity: 1, scale: 1 } };
                default:
                    return { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } };
            }
        };

        const { from, to } = getAnimationProps();
        const targets = stagger ? section.children : section;

        gsap.set(targets, from);

        const animation_tl = gsap.to(targets, {
            ...to,
            duration,
            delay,
            stagger: stagger ? 0.1 : 0,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none',
            },
        });

        return () => {
            animation_tl.kill();
        };
    }, [animation, delay, duration, stagger]);

    return (
        <section ref={sectionRef} className={className}>
            {children}
        </section>
    );
}
