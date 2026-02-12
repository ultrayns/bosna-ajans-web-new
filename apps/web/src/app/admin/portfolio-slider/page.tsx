'use client';

import { useEffect, useState } from 'react';

interface Slide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    category: string;
    client: string;
    year: number;
    image: string;
    order: number;
}

export default function PortfolioSliderAdminPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newSlide, setNewSlide] = useState<Partial<Slide>>({});
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchSlides = async () => {
        try {
            const res = await fetch('/api/admin/content/portfolio-slider');
            const data = await res.json();
            if (data.success && data.data?.slides) {
                setSlides(data.data.slides.sort((a: Slide, b: Slide) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSlides(); }, []);

    const saveSlides = async (updatedSlides: Slide[]) => {
        try {
            const res = await fetch('/api/admin/content/portfolio-slider', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slides: updatedSlides }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Kaydedildi!' });
                setSlides(updatedSlides);
            } else {
                setMessage({ type: 'error', text: 'Hata oluştu' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAdd = () => {
        if (!newSlide.title || !newSlide.category) return;
        const slide: Slide = {
            id: Date.now().toString(36),
            title: newSlide.title,
            subtitle: newSlide.subtitle || '',
            description: newSlide.description || '',
            category: newSlide.category,
            client: newSlide.client || '',
            year: newSlide.year || new Date().getFullYear(),
            image: newSlide.image || '/media/placeholder.jpg',
            order: slides.length + 1,
        };
        saveSlides([...slides, slide]);
        setNewSlide({});
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Silmek istediğinize emin misiniz?')) {
            saveSlides(slides.filter(s => s.id !== id));
        }
    };

    const handleUpdate = (id: string, updates: Partial<Slide>) => {
        const updatedSlides = slides.map(s => s.id === id ? { ...s, ...updates } : s);
        setSlides(updatedSlides);
    };

    const handleSaveEdit = (id: string) => {
        saveSlides(slides);
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
                    <h1 className="text-2xl font-bold text-white">Portfolyo Slider</h1>
                    <p className="text-gray-400 mt-1">Portfolyo sayfasındaki slider alanını yönetin</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    + Yeni Slide
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
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Slide Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Başlık"
                            value={newSlide.title || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Alt Başlık"
                            value={newSlide.subtitle || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Kategori"
                            value={newSlide.category || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, category: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Müşteri"
                            value={newSlide.client || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, client: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="number"
                            placeholder="Yıl"
                            value={newSlide.year || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, year: parseInt(e.target.value) })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Görsel URL"
                            value={newSlide.image || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <textarea
                            placeholder="Açıklama"
                            value={newSlide.description || ''}
                            onChange={(e) => setNewSlide({ ...newSlide, description: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2 lg:col-span-3"
                            rows={2}
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

            {/* Slides List */}
            <div className="space-y-4">
                {slides.map((slide) => (
                    <div key={slide.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        {editingId === slide.id ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <input
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => handleUpdate(slide.id, { title: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Başlık"
                                />
                                <input
                                    type="text"
                                    value={slide.subtitle}
                                    onChange={(e) => handleUpdate(slide.id, { subtitle: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Alt Başlık"
                                />
                                <input
                                    type="text"
                                    value={slide.category}
                                    onChange={(e) => handleUpdate(slide.id, { category: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Kategori"
                                />
                                <input
                                    type="text"
                                    value={slide.image}
                                    onChange={(e) => handleUpdate(slide.id, { image: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white md:col-span-2 lg:col-span-3"
                                    placeholder="Görsel URL"
                                />
                                <div className="flex gap-2 md:col-span-2 lg:col-span-3">
                                    <button onClick={() => handleSaveEdit(slide.id)} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">
                                        Kaydet
                                    </button>
                                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm">
                                        İptal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{slide.title}</h3>
                                    <p className="text-gray-400 text-sm">{slide.category} • {slide.client} • {slide.year}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingId(slide.id)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                        Düzenle
                                    </button>
                                    <button onClick={() => handleDelete(slide.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">
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
