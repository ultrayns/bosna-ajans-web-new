'use client';

import { PortfolioFilter, ProjectCard } from '@/components/portfolio';
import { Category, Project } from '@/lib/mock-portfolio';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    parentSlug: string;
    order: number;
}

interface PortfolioGridProps {
    initialProjects: Project[];
    categories: Category[];
    years: number[];
    locale?: string;
}

// Masonry-style layout pattern
const getCardVariant = (index: number, isFiltered: boolean): 'default' | 'featured' | 'tall' | 'wide' => {
    // Force uniform grid layout for a tidy appearance
    return 'default';
};

export default function PortfolioGrid({ initialProjects, categories, years, locale = 'tr' }: PortfolioGridProps) {
    const isEn = locale === 'en';
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(12);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

    // Fetch subcategories from API
    useEffect(() => {
        async function fetchSubcategories() {
            try {
                const res = await fetch('/api/admin/content/categories');
                const data = await res.json();
                if (data.success && data.data?.subcategories) {
                    setSubcategories(data.data.subcategories);
                }
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            }
        }
        fetchSubcategories();
    }, []);

    // Compute category counts from actual projects
    const categoriesWithCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        initialProjects.forEach((project) => {
            (project.categories || []).forEach((cat) => {
                counts[cat.slug] = (counts[cat.slug] || 0) + 1;
            });
        });

        // Start with "All" category
        const enrichedCategories = [
            { name: isEn ? 'All' : 'Tümü', slug: 'all', count: initialProjects.length },
            ...categories
                .filter((cat) => cat.slug !== 'all')
                .map((cat) => ({
                    ...cat,
                    count: counts[cat.slug] || 0,
                }))
                .filter((cat) => cat.count > 0), // Only show categories with projects
        ];

        return enrichedCategories;
    }, [initialProjects, categories, isEn]);

    // Filter projects based on selections
    const filteredProjects = useMemo(() => {
        return initialProjects.filter((project) => {
            const matchesCategory =
                selectedCategory === 'all' ||
                project.categories.some((cat) => cat.slug === selectedCategory);
            const matchesYear = selectedYear === null || project.year === selectedYear;
            // Subcategory filtering (filter by subcategory tag in project if available)
            const matchesSubcategory = !selectedSubcategory ||
                project.subcategories?.some((sub) => sub.slug === selectedSubcategory) ||
                project.categories.some((cat) => cat.slug === selectedSubcategory);
            return matchesCategory && matchesYear && matchesSubcategory;
        });
    }, [initialProjects, selectedCategory, selectedYear, selectedSubcategory]);

    // Visible projects with pagination
    const visibleProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleProjects.length < filteredProjects.length;
    const isFiltered = selectedCategory !== 'all' || selectedYear !== null || selectedSubcategory !== null;

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 6);
    };

    const handleCategoryChange = (slug: string) => {
        setSelectedCategory(slug);
        setSelectedSubcategory(null);
        setVisibleCount(12);
    };

    const handleYearChange = (year: number | null) => {
        setSelectedYear(year);
        setVisibleCount(12);
    };

    const handleSubcategoryChange = (slug: string | null) => {
        setSelectedSubcategory(slug);
        setVisibleCount(12);
    };

    return (
        <>
            {/* Filter Bar */}
            <PortfolioFilter
                categories={categoriesWithCounts}
                years={years}
                selectedCategory={selectedCategory}
                selectedYear={selectedYear}
                selectedSubcategory={selectedSubcategory}
                onCategoryChange={handleCategoryChange}
                onYearChange={handleYearChange}
                onSubcategoryChange={handleSubcategoryChange}
                subcategories={subcategories}
                locale={locale}
            />

            {/* Category title - when filtered */}
            {selectedCategory !== 'all' && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="container mx-auto px-6 md:px-12 lg:px-24 pt-8"
                >
                    <h2 className="font-display text-3xl md:text-4xl text-ink-900 dark:text-paper-50">
                        {categories.find(c => c.slug === selectedCategory)?.name}
                    </h2>
                    <p className="mt-2 text-ink-500 dark:text-paper-400">
                        {filteredProjects.length} {isEn ? 'projects' : 'proje'}
                    </p>
                </motion.div>
            )}

            {/* Projects Grid - Masonry Style */}
            <div className="container mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-16">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedCategory}-${selectedYear}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 auto-rows-[280px]"
                    >
                        {visibleProjects.map((project, index) => {
                            const variant = getCardVariant(index, isFiltered);
                            return (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    variant={variant}
                                    locale={locale}
                                />
                            );
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Empty state */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-ink-100 dark:bg-paper-50/10 flex items-center justify-center">
                            <svg className="w-10 h-10 text-ink-400 dark:text-paper-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <p className="text-ink-500 dark:text-paper-400 text-lg mb-4">
                            {isEn ? 'No projects found matching these criteria.' : 'Bu kriterlere uygun proje bulunamadı.'}
                        </p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSelectedYear(null);
                            }}
                            className="px-6 py-3 bg-forest-500 text-paper-50 font-medium hover:bg-forest-600 transition-colors"
                        >
                            {isEn ? 'Clear filters' : 'Filtreleri temizle'}
                        </button>
                    </motion.div>
                )}

                {/* Load More */}
                {hasMore && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-16 text-center"
                    >
                        <button
                            onClick={handleLoadMore}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-ink-900 dark:bg-paper-50 text-paper-50 dark:text-ink-900 font-medium overflow-hidden transition-all hover:shadow-2xl hover:shadow-ink-900/20"
                        >
                            <span className="relative z-10">{isEn ? 'Load More Projects' : 'Daha Fazla Proje Yükle'}</span>
                            <span className="relative z-10 text-sm opacity-60 bg-paper-50/10 dark:bg-ink-900/10 px-2 py-1 rounded">
                                +{filteredProjects.length - visibleProjects.length}
                            </span>
                            <span className="absolute inset-0 bg-forest-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                    </motion.div>
                )}
            </div>
        </>
    );
}
