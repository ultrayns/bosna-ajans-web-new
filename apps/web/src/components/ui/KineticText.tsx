'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface KineticTextProps {
    children: string;
    className?: string;
    animation?: 'reveal' | 'wave' | 'scramble' | 'typewriter';
    delay?: number;
    stagger?: number;
    trigger?: 'mount' | 'inView';
}

/**
 * Kinetic Typography Component
 * Provides various text reveal animations for headings
 */
export default function KineticText({
    children,
    className = '',
    animation = 'reveal',
    delay = 0,
    stagger = 0.03,
    trigger = 'mount',
}: KineticTextProps) {
    const [isVisible, setIsVisible] = useState(trigger === 'mount');
    const [displayText, setDisplayText] = useState(children);

    // Split into words or characters based on animation type
    const units = animation === 'wave' ? children.split('') : children.split(' ');

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            setIsVisible(true);
            return;
        }

        if (trigger === 'mount') {
            const timer = setTimeout(() => setIsVisible(true), delay * 1000);
            return () => clearTimeout(timer);
        }
    }, [delay, trigger]);

    // Scramble effect
    useEffect(() => {
        if (animation !== 'scramble' || !isVisible) return;

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let iteration = 0;
        const originalText = children;

        const interval = setInterval(() => {
            setDisplayText(
                originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) return originalText[index];
                        if (char === ' ') return ' ';
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join('')
            );

            if (iteration >= originalText.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [animation, children, isVisible]);

    // Reveal animation variants
    const revealVariants = {
        hidden: { y: '100%', opacity: 0 },
        visible: (i: number) => ({
            y: 0,
            opacity: 1,
            transition: {
                delay: delay + i * stagger,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            },
        }),
    };

    // Wave animation variants
    const waveVariants = {
        hidden: { y: 0 },
        visible: (i: number) => ({
            y: [0, -10, 0],
            transition: {
                delay: delay + i * 0.05,
                duration: 0.5,
                repeat: 0,
                ease: 'easeInOut',
            },
        }),
    };

    // Typewriter effect
    const [typewriterIndex, setTypewriterIndex] = useState(0);

    useEffect(() => {
        if (animation !== 'typewriter' || !isVisible) return;

        if (typewriterIndex < children.length) {
            const timer = setTimeout(() => {
                setTypewriterIndex((prev) => prev + 1);
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [animation, children.length, isVisible, typewriterIndex]);

    if (animation === 'scramble') {
        return (
            <span className={`font-mono ${className}`}>
                {displayText}
            </span>
        );
    }

    if (animation === 'typewriter') {
        return (
            <span className={className}>
                {children.slice(0, typewriterIndex)}
                <span className="animate-pulse">|</span>
            </span>
        );
    }

    return (
        <span className={`inline-flex flex-wrap ${className}`}>
            {units.map((unit, i) => (
                <span key={i} className="overflow-hidden inline-block">
                    <motion.span
                        custom={i}
                        initial="hidden"
                        animate={isVisible ? 'visible' : 'hidden'}
                        variants={animation === 'wave' ? waveVariants : revealVariants}
                        className="inline-block"
                    >
                        {unit}
                        {animation !== 'wave' && i < units.length - 1 && '\u00A0'}
                    </motion.span>
                </span>
            ))}
        </span>
    );
}
