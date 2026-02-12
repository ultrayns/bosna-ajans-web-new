'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ProjectForm {
    title: string;
    slug: string;
    client: string;
    year: number;
    categoryIds: string[];
    subcategoryIds: string[];
    heroPoster: string;
    heroVideo: string;
    shortIntro: string;
    isFeatured: boolean;
}

export default function NewProjectPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [form, setForm] = useState<ProjectForm>({
        title: '',
        slug: '',
        client: '',
        year: new Date().getFullYear(),
        categoryIds: [],
        subcategoryIds: [],
        heroPoster: '',
        heroVideo: '',
        shortIntro: '',
        isFeatured: false,
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/content/categories');
            const data = await res.json();
            if (data.success) {
                setCategories(data.data.categories || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/ü/g, 'u')
            .replace(/ö/g, 'o')
            .replace(/ı/g, 'i')
            .replace(/ğ/g, 'g')
            .replace(/ş/g, 's')
            .replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const handleTitleChange = (title: string) => {
        setForm({ ...form, title, slug: generateSlug(title) });
    };

    const handleCategoryToggle = (categoryId: string) => {
        const newIds = form.categoryIds.includes(categoryId)
            ? form.categoryIds.filter(id => id !== categoryId)
            : [...form.categoryIds, categoryId];
        setForm({ ...form, categoryIds: newIds });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title || !form.client || form.categoryIds.length === 0) {
            setMessage({ type: 'error', text: 'Lütfen gerekli alanları doldurun.' });
            return;
        }

        setSaving(true);
        setMessage(null);

        try {
            // First fetch existing projects
            const existingRes = await fetch('/api/admin/content/projects');
            const existingData = await existingRes.json();
            const existingProjects = existingData.data?.projects || [];

            // Add new project
            const newProject = {
                id: Date.now().toString(36),
                ...form,
                order: existingProjects.length + 1,
            };

            const res = await fetch('/api/admin/content/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projects: [...existingProjects, newProject] }),
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Proje başarıyla eklendi!' });
                setTimeout(() => router.push('/admin/projects'), 1500);
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

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
                    <h1 className="text-2xl font-bold text-white">Yeni Proje</h1>
                    <p className="text-gray-400 mt-1">Yeni bir proje ekleyin.</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                    ← Geri
                </button>
            </div>

            {/* Message */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Proje Adı *</label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="Örn: Ürün Çekimi"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="urun-cekimi"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Müşteri *</label>
                                <input
                                    type="text"
                                    value={form.client}
                                    onChange={(e) => setForm({ ...form, client: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Müşteri adı"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Yıl</label>
                                <input
                                    type="number"
                                    value={form.year}
                                    onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    min={2000}
                                    max={2030}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Kısa Açıklama</label>
                            <textarea
                                value={form.shortIntro}
                                onChange={(e) => setForm({ ...form, shortIntro: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                placeholder="Proje hakkında kısa bir açıklama..."
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Kategoriler *</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-700/50 rounded-lg">
                                {categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-700 rounded">
                                        <input
                                            type="checkbox"
                                            checked={form.categoryIds.includes(cat.id)}
                                            onChange={() => handleCategoryToggle(cat.id)}
                                            className="rounded border-gray-500 bg-gray-600 text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className="text-white text-sm">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Kapak Görseli URL</label>
                            <input
                                type="text"
                                value={form.heroPoster}
                                onChange={(e) => setForm({ ...form, heroPoster: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="/media/projects/genel/image.jpg"
                            />
                            {form.heroPoster && (
                                <div className="mt-2 aspect-video bg-gray-700 rounded-lg overflow-hidden">
                                    <img src={form.heroPoster} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Video URL (opsiyonel)</label>
                            <input
                                type="text"
                                value={form.heroVideo}
                                onChange={(e) => setForm({ ...form, heroVideo: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="/media/videos/video.mp4"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isFeatured}
                                    onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                    className="rounded border-gray-500 bg-gray-600 text-emerald-500 focus:ring-emerald-500 w-5 h-5"
                                />
                                <span className="text-white">Öne çıkan proje olarak işaretle</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-700">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                        İptal
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors"
                    >
                        {saving ? 'Kaydediliyor...' : 'Proje Ekle'}
                    </button>
                </div>
            </form>
        </div>
    );
}
