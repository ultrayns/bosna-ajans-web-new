'use client';

import { useEffect, useState } from 'react';

interface FeaturedWork {
    id: string;
    title: string;
    category: string;
    image: string;
    video?: string;
    order: number;
}

export default function FeaturedWorksAdminPage() {
    const [works, setWorks] = useState<FeaturedWork[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newWork, setNewWork] = useState<Partial<FeaturedWork>>({});
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchWorks = async () => {
        try {
            const res = await fetch('/api/admin/content/featured-works');
            const data = await res.json();
            if (data.success && data.data?.featuredWorks) {
                setWorks(data.data.featuredWorks.sort((a: FeaturedWork, b: FeaturedWork) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchWorks(); }, []);

    const saveWorks = async (updatedWorks: FeaturedWork[]) => {
        try {
            const res = await fetch('/api/admin/content/featured-works', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featuredWorks: updatedWorks }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Kaydedildi!' });
                setWorks(updatedWorks);
            } else {
                setMessage({ type: 'error', text: 'Hata oluştu' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAdd = () => {
        if (!newWork.title || !newWork.category) return;
        const work: FeaturedWork = {
            id: Date.now().toString(36),
            title: newWork.title,
            category: newWork.category,
            image: newWork.image || '/media/placeholder.jpg',
            video: newWork.video,
            order: works.length + 1,
        };
        saveWorks([...works, work]);
        setNewWork({});
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Silmek istediğinize emin misiniz?')) {
            saveWorks(works.filter(w => w.id !== id));
        }
    };

    const handleUpdate = (id: string, updates: Partial<FeaturedWork>) => {
        const updatedWorks = works.map(w => w.id === id ? { ...w, ...updates } : w);
        setWorks(updatedWorks);
    };

    const handleSaveEdit = (id: string) => {
        saveWorks(works);
        setEditingId(null);
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Seçili Çalışmalar</h1>
                    <p className="text-gray-400 mt-1">Ana sayfadaki öne çıkan çalışmaları yönetin</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    + Yeni Ekle
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Add Form */}
            {showAddForm && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Çalışma Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Başlık"
                            value={newWork.title || ''}
                            onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Kategori"
                            value={newWork.category || ''}
                            onChange={(e) => setNewWork({ ...newWork, category: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Görsel URL (ör: /media/featured/image.jpg)"
                            value={newWork.image || ''}
                            onChange={(e) => setNewWork({ ...newWork, image: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Video URL (opsiyonel)"
                            value={newWork.video || ''}
                            onChange={(e) => setNewWork({ ...newWork, video: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">
                            Ekle
                        </button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
                            İptal
                        </button>
                    </div>
                </div>
            )}

            {/* Works List */}
            <div className="space-y-4">
                {works.map((work) => (
                    <div key={work.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        {editingId === work.id ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <input
                                    type="text"
                                    value={work.title}
                                    onChange={(e) => handleUpdate(work.id, { title: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                <input
                                    type="text"
                                    value={work.category}
                                    onChange={(e) => handleUpdate(work.id, { category: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                <input
                                    type="text"
                                    value={work.image}
                                    onChange={(e) => handleUpdate(work.id, { image: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                <input
                                    type="text"
                                    value={work.video || ''}
                                    onChange={(e) => handleUpdate(work.id, { video: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Video URL"
                                />
                                <div className="flex gap-2 md:col-span-4">
                                    <button onClick={() => handleSaveEdit(work.id)} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">
                                        Kaydet
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm">
                                        İptal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                    {work.video ? (
                                        <video src={work.video} className="w-full h-full object-cover" muted />
                                    ) : (
                                        <img src={work.image} alt={work.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{work.title}</h3>
                                    <p className="text-gray-400 text-sm">{work.category}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingId(work.id)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                        Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(work.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
                                        Sil
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
