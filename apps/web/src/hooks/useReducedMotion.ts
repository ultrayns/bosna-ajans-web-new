'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect prefers-reduced-motion preference
 * Returns true if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Get animation duration based on reduced motion preference
 * Returns 0 if reduced motion is preferred
 */
export function useAnimationDuration(normalDuration: number): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? 0 : normalDuration;
}

/**
 * Get motion-safe animation properties
 * Returns empty object if reduced motion is preferred
 */
export function useMotionSafeAnimations<T extends object>(animations: T): T | Record<string, never> {
  const prefersReducedMotion = usePrefersReducedMotion();
  return prefersReducedMotion ? {} : animations;
}

/**
 * Framer Motion variant generator with reduced motion support
 */
export function createMotionVariants<T extends object>(
  normalVariants: T,
  reducedVariants: Partial<T>
) {
  return (prefersReducedMotion: boolean): T => {
    if (prefersReducedMotion) {
      return { ...normalVariants, ...reducedVariants } as T;
    }
    return normalVariants;
  };
}

/**
 * Common reduced motion safe animation presets
 */
export const safeMotionPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  fadeInUpReduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.2 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3 },
  },
  scaleInReduced: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.15 },
  },
};
