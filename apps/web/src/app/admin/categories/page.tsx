'use client';

import { useEffect, useState } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    order: number;
    image: string;
}

interface Subcategory {
    id: string;
    name: string;
    slug: string;
    parentSlug: string;
    order: number;
}

interface CategoriesData {
    categories: Category[];
    subcategories: Subcategory[];
}

export default function CategoriesPage() {
    const [data, setData] = useState<CategoriesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<{ name: string; slug: string; image: string }>({ name: '', slug: '', image: '' });
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', image: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/categories');
            const result = await res.json();
            if (result.success) {
                setData(result.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (name: string) => {
        return name
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

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/content/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Kategoriler kaydedildi!' });
                setEditingId(null);
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const handleAddCategory = () => {
        if (!data || !newCategory.name) return;

        const newItem: Category = {
            id: Date.now().toString(36),
            name: newCategory.name,
            slug: newCategory.slug || generateSlug(newCategory.name),
            image: newCategory.image || '/media/projects/genel/placeholder.jpg',
            order: data.categories.length + 1,
        };

        setData({ ...data, categories: [...data.categories, newItem] });
        setNewCategory({ name: '', slug: '', image: '' });
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (!data || !confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) return;
        setData({
            ...data,
            categories: data.categories.filter(c => c.id !== id),
        });
    };

    const startEdit = (category: Category) => {
        setEditingId(category.id);
        setEditForm({ name: category.name, slug: category.slug, image: category.image });
    };

    const saveEdit = () => {
        if (!data || !editingId) return;
        setData({
            ...data,
            categories: data.categories.map(c =>
                c.id === editingId ? { ...c, ...editForm } : c
            ),
        });
        setEditingId(null);
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
                    <h1 className="text-2xl font-bold text-white">Kategoriler</h1>
                    <p className="text-gray-400 mt-1">Portfolio kategorilerini yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Yeni Kategori
                    </button>
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

            {/* Add Form */}
            {showAddForm && (
                <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Yeni Kategori Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input
                            type="text"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value, slug: generateSlug(e.target.value) })}
                            placeholder="Kategori Adı"
                            className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            value={newCategory.slug}
                            onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                            placeholder="Slug (otomatik)"
                            className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            value={newCategory.image}
                            onChange={(e) => setNewCategory({ ...newCategory, image: e.target.value })}
                            placeholder="Görsel URL"
                            className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddCategory} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Ekle</button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">İptal</button>
                    </div>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-750">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Görsel</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ad</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Slug</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Sıra</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {data?.categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-750">
                                <td className="px-4 py-3">
                                    <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                                        {category.image && (
                                            <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === category.id ? (
                                        <input
                                            type="text"
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-white w-full"
                                        />
                                    ) : (
                                        <span className="text-white font-medium">{category.name}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    {editingId === category.id ? (
                                        <input
                                            type="text"
                                            value={editForm.slug}
                                            onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                            className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded text-white w-full"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">{category.slug}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-gray-400">{category.order}</td>
                                <td className="px-4 py-3 text-right">
                                    {editingId === category.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300">Kaydet</button>
                                            <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-white">İptal</button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => startEdit(category)} className="text-blue-400 hover:text-blue-300">Düzenle</button>
                                            <button onClick={() => handleDelete(category.id)} className="text-red-400 hover:text-red-300">Sil</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Subcategories Info */}
            {data?.subcategories && data.subcategories.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-white mb-4">Alt Kategoriler</h2>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {data.subcategories.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                                    <div>
                                        <p className="text-white font-medium">{sub.name}</p>
                                        <p className="text-gray-400 text-sm">Üst: {data.categories.find(c => c.slug === sub.parentSlug)?.name || sub.parentSlug}</p>
                                    </div>
                                    <span className="text-gray-500 text-xs">{sub.slug}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
