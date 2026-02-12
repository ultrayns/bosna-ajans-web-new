'use client';

import { useEffect, useState } from 'react';

interface GalleryImage {
    id: string;
    src: string;
    alt: string;
    category: string;
    order: number;
}

export default function GalleryAdminPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newImage, setNewImage] = useState<Partial<GalleryImage>>({});
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/admin/content/gallery');
            const data = await res.json();
            if (data.success && data.data?.galleryImages) {
                setImages(data.data.galleryImages.sort((a: GalleryImage, b: GalleryImage) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchImages(); }, []);

    const saveImages = async (updatedImages: GalleryImage[]) => {
        try {
            const res = await fetch('/api/admin/content/gallery', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ galleryImages: updatedImages }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Kaydedildi!' });
                setImages(updatedImages);
            } else {
                setMessage({ type: 'error', text: 'Hata oluştu' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAdd = () => {
        if (!newImage.src || !newImage.alt) return;
        const image: GalleryImage = {
            id: 'g' + Date.now().toString(36),
            src: newImage.src,
            alt: newImage.alt,
            category: newImage.category || 'Genel',
            order: images.length + 1,
        };
        saveImages([...images, image]);
        setNewImage({});
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Silmek istediğinize emin misiniz?')) {
            saveImages(images.filter(i => i.id !== id));
        }
    };

    const handleUpdate = (id: string, updates: Partial<GalleryImage>) => {
        const updatedImages = images.map(i => i.id === id ? { ...i, ...updates } : i);
        setImages(updatedImages);
    };

    const handleSaveEdit = () => {
        saveImages(images);
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
                    <h1 className="text-2xl font-bold text-white">Görsel Galeri</h1>
                    <p className="text-gray-400 mt-1">Portfolyo sayfasındaki görsel galeriyi yönetin ({images.length} görsel)</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    + Yeni Görsel
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
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Görsel Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                            type="text"
                            placeholder="Görsel URL (ör: /media/projects/...)"
                            value={newImage.src || ''}
                            onChange={(e) => setNewImage({ ...newImage, src: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Başlık (Alt)"
                            value={newImage.alt || ''}
                            onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Kategori"
                            value={newImage.category || ''}
                            onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Ekle</button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">İptal</button>
                    </div>
                </div>
            )}

            {/* Images Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.map((image) => (
                    <div key={image.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                        {editingId === image.id ? (
                            <div className="p-3 space-y-2">
                                <input
                                    type="text"
                                    value={image.alt}
                                    onChange={(e) => handleUpdate(image.id, { alt: e.target.value })}
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                    placeholder="Başlık"
                                />
                                <input
                                    type="text"
                                    value={image.category}
                                    onChange={(e) => handleUpdate(image.id, { category: e.target.value })}
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                    placeholder="Kategori"
                                />
                                <div className="flex gap-1">
                                    <button onClick={handleSaveEdit} className="flex-1 px-2 py-1 bg-emerald-600 text-white rounded text-xs">Kaydet</button>
                                    <button onClick={() => setEditingId(null)} className="flex-1 px-2 py-1 bg-gray-600 text-white rounded text-xs">İptal</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="aspect-square overflow-hidden">
                                    <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-2">
                                    <p className="text-white text-xs truncate">{image.alt}</p>
                                    <p className="text-gray-400 text-xs">{image.category}</p>
                                    <div className="flex gap-1 mt-2">
                                        <button onClick={() => setEditingId(image.id)} className="flex-1 px-2 py-1 bg-blue-600 text-white rounded text-xs">Düzenle</button>
                                        <button onClick={() => handleDelete(image.id)} className="flex-1 px-2 py-1 bg-red-600 text-white rounded text-xs">Sil</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
