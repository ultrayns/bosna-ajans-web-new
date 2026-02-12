'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

interface Category {
    name: string;
    slug: string;
    count: number;
}

interface Subcategory {
    name: string;
    slug: string;
    parentSlug: string;
}

interface PortfolioFilterProps {
    categories: Category[];
    years: number[];
    selectedCategory: string;
    selectedYear: number | null;
    selectedSubcategory?: string | null;
    onCategoryChange: (slug: string) => void;
    onYearChange: (year: number | null) => void;
    onSubcategoryChange?: (slug: string | null) => void;
    locale?: string;
    subcategories?: Subcategory[];
}

// Default Züccaciye subcategories
const defaultSubcategories: Subcategory[] = [
    { name: 'Baharatlık', slug: 'baharatlik', parentSlug: 'zuccaciye' },
    { name: 'Banyo Takımı', slug: 'banyo-takimi', parentSlug: 'zuccaciye' },
];

export default function PortfolioFilter({
    categories,
    years,
    selectedCategory,
    selectedYear,
    selectedSubcategory = null,
    onCategoryChange,
    onYearChange,
    onSubcategoryChange,
    locale = 'tr',
    subcategories = defaultSubcategories,
}: PortfolioFilterProps) {
    const isEn = locale === 'en';
    const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

    // Get subcategories for the selected category
    const currentSubcategories = subcategories.filter(s => s.parentSlug === selectedCategory);
    const hasSubcategories = currentSubcategories.length > 0;

    const handleCategoryClick = (slug: string) => {
        onCategoryChange(slug);
        if (onSubcategoryChange) {
            onSubcategoryChange(null);
        }
        // Show subcategory dropdown if züccaciye is selected
        if (slug === 'zuccaciye') {
            setShowSubcategoryDropdown(true);
        } else {
            setShowSubcategoryDropdown(false);
        }
    };

    return (
        <div className="sticky top-0 z-30 bg-paper-50/95 dark:bg-ink-900/95 backdrop-blur-lg border-b border-ink-200/50 dark:border-paper-50/10">
            <div className="container mx-auto px-6 md:px-12 lg:px-24">
                <div className="flex flex-col gap-4 py-5">
                    {/* Main category filters */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat, index) => (
                            <div key={cat.slug} className="relative">
                                <motion.button
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleCategoryClick(cat.slug)}
                                    className={`relative px-4 py-2 text-sm font-medium transition-all overflow-hidden group ${selectedCategory === cat.slug
                                        ? 'bg-ink-900 dark:bg-forest-500 text-paper-50'
                                        : 'bg-transparent text-ink-600 dark:text-paper-400 hover:text-ink-900 dark:hover:text-paper-50'
                                        }`}
                                >
                                    {/* Hover background effect */}
                                    <span className={`absolute inset-0 bg-ink-100 dark:bg-paper-50/10 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${selectedCategory === cat.slug ? 'hidden' : ''
                                        }`} />

                                    <span className="relative z-10 flex items-center gap-2">
                                        {cat.name}
                                        <span className={`text-xs px-1.5 py-0.5 rounded-sm ${selectedCategory === cat.slug
                                            ? 'bg-paper-50/20'
                                            : 'bg-ink-100 dark:bg-paper-50/10'
                                            }`}>
                                            {cat.count}
                                        </span>
                                        {/* Dropdown arrow for züccaciye */}
                                        {cat.slug === 'zuccaciye' && (
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        )}
                                    </span>

                                    {/* Active indicator underline */}
                                    {selectedCategory === cat.slug && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-400"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.button>

                                {/* Subcategory dropdown for züccaciye */}
                                <AnimatePresence>
                                    {cat.slug === 'zuccaciye' && selectedCategory === 'zuccaciye' && showSubcategoryDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="absolute top-full left-0 mt-1 bg-ink-900 border border-paper-50/10 rounded-lg shadow-xl z-40 min-w-[160px]"
                                        >
                                            <button
                                                onClick={() => {
                                                    onSubcategoryChange?.(null);
                                                    setShowSubcategoryDropdown(false);
                                                }}
                                                className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-50/10 transition-colors ${!selectedSubcategory ? 'text-forest-400' : 'text-paper-300'
                                                    }`}
                                            >
                                                {isEn ? 'All Glassware' : 'Tümü'}
                                            </button>
                                            {currentSubcategories.map(sub => (
                                                <button
                                                    key={sub.slug}
                                                    onClick={() => {
                                                        onSubcategoryChange?.(sub.slug);
                                                        setShowSubcategoryDropdown(false);
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-paper-50/10 transition-colors ${selectedSubcategory === sub.slug ? 'text-forest-400' : 'text-paper-300'
                                                        }`}
                                                >
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Bottom row: Year filter + subcategory display + clear */}
                    <div className="flex items-center justify-between">
                        {/* Subcategory badge if selected */}
                        <div className="flex items-center gap-2">
                            {selectedSubcategory && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-forest-500/20 text-forest-400 text-sm font-medium rounded-full"
                                >
                                    {currentSubcategories.find(s => s.slug === selectedSubcategory)?.name || selectedSubcategory}
                                    <button
                                        onClick={() => onSubcategoryChange?.(null)}
                                        className="hover:text-paper-50 transition-colors"
                                        aria-label="Alt kategoriyi kaldır"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </motion.span>
                            )}
                        </div>

                        {/* Year filter */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 text-ink-400 dark:text-paper-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">
                                    {isEn ? 'Year' : 'Yıl'}
                                </span>
                            </div>
                            <div className="relative">
                                <select
                                    value={selectedYear ?? ''}
                                    onChange={(e) => onYearChange(e.target.value ? Number(e.target.value) : null)}
                                    title={isEn ? 'Filter by year' : 'Yıla göre filtrele'}
                                    aria-label={isEn ? 'Filter by year' : 'Yıla göre filtrele'}
                                    className="appearance-none bg-ink-50 dark:bg-paper-50/5 border border-ink-200 dark:border-paper-50/20 text-ink-900 dark:text-paper-50 px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent cursor-pointer hover:bg-ink-100 dark:hover:bg-paper-50/10 transition-colors rounded"
                                >
                                    <option value="">{isEn ? 'All Years' : 'Tüm Yıllar'}</option>
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom dropdown arrow */}
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-ink-400 dark:text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>

                            {/* Clear filters button */}
                            {(selectedCategory !== 'all' || selectedYear !== null || selectedSubcategory) && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => {
                                        onCategoryChange('all');
                                        onYearChange(null);
                                        onSubcategoryChange?.(null);
                                        setShowSubcategoryDropdown(false);
                                    }}
                                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-forest-600 dark:text-forest-400 hover:text-forest-700 dark:hover:text-forest-300 font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    {isEn ? 'Clear' : 'Temizle'}
                                </motion.button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
