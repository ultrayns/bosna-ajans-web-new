'use client';

import { useEffect, useState } from 'react';

interface SliderVideo {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    videoUrl: string;
    poster: string;
    order: number;
}

export default function ServicesSliderAdminPage() {
    const [videos, setVideos] = useState<SliderVideo[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newVideo, setNewVideo] = useState<Partial<SliderVideo>>({});
    const [showAddForm, setShowAddForm] = useState(false);

    const fetchVideos = async () => {
        try {
            const res = await fetch('/api/admin/content/services-slider');
            const data = await res.json();
            if (data.success && data.data?.videos) {
                setVideos(data.data.videos.sort((a: SliderVideo, b: SliderVideo) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVideos(); }, []);

    const saveVideos = async (updatedVideos: SliderVideo[]) => {
        try {
            const res = await fetch('/api/admin/content/services-slider', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videos: updatedVideos }),
            });
            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Kaydedildi!' });
                setVideos(updatedVideos);
            } else {
                setMessage({ type: 'error', text: 'Hata oluştu' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const handleAdd = () => {
        if (!newVideo.title || !newVideo.videoUrl) return;
        const video: SliderVideo = {
            id: 'sv' + Date.now().toString(36),
            title: newVideo.title,
            titleEn: newVideo.titleEn || newVideo.title,
            description: newVideo.description || '',
            descriptionEn: newVideo.descriptionEn || '',
            videoUrl: newVideo.videoUrl,
            poster: newVideo.poster || '/media/placeholder.jpg',
            order: videos.length + 1,
        };
        saveVideos([...videos, video]);
        setNewVideo({});
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Silmek istediğinize emin misiniz?')) {
            saveVideos(videos.filter(v => v.id !== id));
        }
    };

    const handleUpdate = (id: string, updates: Partial<SliderVideo>) => {
        const updatedVideos = videos.map(v => v.id === id ? { ...v, ...updates } : v);
        setVideos(updatedVideos);
    };

    const handleSaveEdit = () => {
        saveVideos(videos);
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
                    <h1 className="text-2xl font-bold text-white">Hizmetler Slider</h1>
                    <p className="text-gray-400 mt-1">Services sayfasındaki video slider'ı yönetin</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    + Yeni Video
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
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Video Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Başlık (TR)"
                            value={newVideo.title || ''}
                            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Title (EN)"
                            value={newVideo.titleEn || ''}
                            onChange={(e) => setNewVideo({ ...newVideo, titleEn: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <textarea
                            placeholder="Açıklama (TR)"
                            value={newVideo.description || ''}
                            onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            rows={2}
                        />
                        <textarea
                            placeholder="Description (EN)"
                            value={newVideo.descriptionEn || ''}
                            onChange={(e) => setNewVideo({ ...newVideo, descriptionEn: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                            rows={2}
                        />
                        <input
                            type="text"
                            placeholder="Video URL (ör: /videos/video.mp4)"
                            value={newVideo.videoUrl || ''}
                            onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                        <input
                            type="text"
                            placeholder="Poster URL (ör: /media/poster.jpg)"
                            value={newVideo.poster || ''}
                            onChange={(e) => setNewVideo({ ...newVideo, poster: e.target.value })}
                            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Ekle</button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">İptal</button>
                    </div>
                </div>
            )}

            {/* Videos List */}
            <div className="space-y-4">
                {videos.map((video) => (
                    <div key={video.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                        {editingId === video.id ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    value={video.title}
                                    onChange={(e) => handleUpdate(video.id, { title: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Başlık (TR)"
                                />
                                <input
                                    type="text"
                                    value={video.titleEn}
                                    onChange={(e) => handleUpdate(video.id, { titleEn: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Title (EN)"
                                />
                                <input
                                    type="text"
                                    value={video.videoUrl}
                                    onChange={(e) => handleUpdate(video.id, { videoUrl: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Video URL"
                                />
                                <input
                                    type="text"
                                    value={video.poster}
                                    onChange={(e) => handleUpdate(video.id, { poster: e.target.value })}
                                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="Poster URL"
                                />
                                <div className="flex gap-2 md:col-span-2">
                                    <button onClick={handleSaveEdit} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">Kaydet</button>
                                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm">İptal</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                                    <img src={video.poster} alt={video.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-medium">{video.title}</h3>
                                    <p className="text-gray-400 text-sm">{video.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingId(video.id)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">Düzenle</button>
                                    <button onClick={() => handleDelete(video.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">Sil</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
