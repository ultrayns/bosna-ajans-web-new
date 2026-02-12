'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseScrollRevealOptions {
  threshold?: number;
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  ease?: string;
  once?: boolean;
}

/**
 * Hook for scroll-triggered reveal animations
 */
export function useScrollReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    threshold = 0.2,
    y = 40,
    x = 0,
    duration = 0.8,
    delay = 0,
    stagger = 0.1,
    ease = 'power3.out',
    once = true,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(element, { opacity: 1, y: 0, x: 0 });
      return;
    }

    // Initial state
    gsap.set(element, { opacity: 0, y, x });

    // Create animation
    const animation = gsap.to(element, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [threshold, y, x, duration, delay, ease, once]);

  return ref;
}

/**
 * Hook for staggered children reveal
 */
export function useStaggerReveal<T extends HTMLElement>(
  options: UseScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const {
    threshold = 0.2,
    y = 30,
    duration = 0.6,
    stagger = 0.1,
    ease = 'power3.out',
    once = true,
  } = options;

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const children = container.children;
    if (!children.length) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(children, { opacity: 0, y });

    const animation = gsap.to(children, {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: container,
        start: `top ${100 - threshold * 100}%`,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    });

    return () => {
      animation.kill();
    };
  }, [threshold, y, duration, stagger, ease, once]);

  return ref;
}

/**
 * Hook for parallax effect
 */
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const animation = gsap.to(element, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      animation.kill();
    };
  }, [speed]);

  return ref;
}

/**
 * Hook for text reveal (word by word or letter by letter)
 */
export function useTextReveal<T extends HTMLElement>(
  mode: 'words' | 'letters' = 'words',
  options: UseScrollRevealOptions = {}
) {
  const ref = useRef<T>(null);
  const { duration = 0.6, stagger = 0.03, ease = 'power3.out' } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) return;

    const text = element.textContent || '';
    const units = mode === 'words' ? text.split(' ') : text.split('');

    element.innerHTML = units
      .map(
        (unit) =>
          `<span class="inline-block overflow-hidden"><span class="inline-block translate-y-full">${
            unit === ' ' ? '&nbsp;' : unit
          }</span></span>${mode === 'words' ? ' ' : ''}`
      )
      .join('');

    const innerSpans = element.querySelectorAll('span > span');

    const animation = gsap.to(innerSpans, {
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    return () => {
      animation.kill();
      element.textContent = text;
    };
  }, [mode, duration, stagger, ease]);

  return ref;
}

/**
 * Hook for progress-based animations (hero parallax, etc.)
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress: (progress: number) => void
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    ScrollTrigger.create({
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        onProgress(self.progress);
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [onProgress]);

  return ref;
}
