'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
    isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

interface ThemeProviderProps {
    children: ReactNode;
    defaultTheme?: Theme;
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
    const [theme, setThemeState] = useState<Theme>(defaultTheme);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setThemeState(stored);
        } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            setThemeState('light');
        }
    }, []);

    // Apply theme class to document
    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme, mounted]);

    const setTheme = (newTheme: Theme) => {
        // Check for reduced motion
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) {
            setThemeState(newTheme);
            return;
        }

        // Animate theme transition
        setIsTransitioning(true);

        // Add transition class for smooth color changes
        document.documentElement.classList.add('theme-transitioning');

        // Small delay for overlay to appear
        requestAnimationFrame(() => {
            setThemeState(newTheme);

            // Remove transition class after animation completes
            setTimeout(() => {
                document.documentElement.classList.remove('theme-transitioning');
                setIsTransitioning(false);
            }, 500);
        });
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isTransitioning }}>
            {isTransitioning && (
                <div
                    className={`fixed inset-0 z-[9999] pointer-events-none animate-[theme-fade_0.5s_ease-out_forwards] ${theme === 'dark' ? 'theme-overlay-dark' : 'theme-overlay-light'
                        }`}
                />
            )}
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Theme toggle button component
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
    const { theme, toggleTheme, isTransitioning } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            disabled={isTransitioning}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${theme === 'dark' ? 'bg-ink-700' : 'bg-paper-300'
                } ${className}`}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            <span
                className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${theme === 'dark'
                    ? 'left-1 bg-paper-50'
                    : 'left-7 bg-ink-900'
                    }`}
            >
                {/* Sun/Moon icon */}
                {theme === 'dark' ? (
                    <svg className="w-full h-full p-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                ) : (
                    <svg className="w-full h-full p-0.5 text-paper-50" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                )}
            </span>
        </button>
    );
}
