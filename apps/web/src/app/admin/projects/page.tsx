'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Project {
    id: string;
    title: string;
    slug: string;
    client: string;
    year: number;
    categoryIds: string[];
    heroPoster: string;
    isFeatured: boolean;
    order: number;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, categoriesRes] = await Promise.all([
                fetch('/api/admin/content/projects'),
                fetch('/api/admin/content/categories'),
            ]);
            const [projectsData, categoriesData] = await Promise.all([
                projectsRes.json(),
                categoriesRes.json(),
            ]);

            if (projectsData.success) setProjects(projectsData.data.projects || []);
            if (categoriesData.success) setCategories(categoriesData.data.categories || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/content/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projects }),
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Projeler kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const handleToggleFeatured = (id: string) => {
        setProjects(projects.map(p =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
        ));
    };

    const handleDelete = (id: string) => {
        if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
        setProjects(projects.filter(p => p.id !== id));
    };

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        return cat?.name || categoryId;
    };

    const filteredProjects = filterCategory === 'all'
        ? projects
        : projects.filter(p => p.categoryIds.includes(filterCategory));

    if (loading) {
        return (
            <div className="p-6 lg:p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-700 rounded w-1/4" />
                    <div className="h-64 bg-gray-700 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Projeler</h1>
                    <p className="text-gray-400 mt-1">{projects.length} proje bulunuyor.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/projects/new"
                        className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Proje
                    </Link>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors"
                    >
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Filter */}
            <div className="mb-6 flex items-center gap-4">
                <label className="text-sm text-gray-400">Filtrele:</label>
                <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white"
                >
                    <option value="all">Tüm Kategoriler</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
                <span className="text-gray-500 text-sm">
                    {filteredProjects.length} proje gösteriliyor
                </span>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                    <div key={project.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden group">
                        {/* Image */}
                        <div className="aspect-video bg-gray-700 relative overflow-hidden">
                            {project.heroPoster ? (
                                <img
                                    src={project.heroPoster}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            {project.isFeatured && (
                                <span className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded">
                                    Öne Çıkan
                                </span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                            <p className="text-gray-400 text-sm mb-2">{project.client} • {project.year}</p>
                            <div className="flex flex-wrap gap-1 mb-4">
                                {project.categoryIds.map((catId) => (
                                    <span key={catId} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                                        {getCategoryName(catId)}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                                <button
                                    onClick={() => handleToggleFeatured(project.id)}
                                    className={`text-sm ${project.isFeatured ? 'text-emerald-400' : 'text-gray-400 hover:text-white'}`}
                                >
                                    {project.isFeatured ? '★ Öne Çıkan' : '☆ Öne Çıkar'}
                                </button>
                                <div className="flex gap-3">
                                    <Link href={`/admin/projects/${project.id}`} className="text-blue-400 hover:text-blue-300 text-sm">
                                        Düzenle
                                    </Link>
                                    <button onClick={() => handleDelete(project.id)} className="text-red-400 hover:text-red-300 text-sm">
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p>Henüz proje bulunmuyor.</p>
                    <Link href="/admin/projects/new" className="text-emerald-400 hover:text-emerald-300 mt-2 inline-block">
                        İlk projenizi ekleyin →
                    </Link>
                </div>
            )}
        </div>
    );
}
