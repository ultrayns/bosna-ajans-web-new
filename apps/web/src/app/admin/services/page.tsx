'use client';

import { useEffect, useState } from 'react';

interface Service {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    image: string;
    video: string;
    features: string[];
    order: number;
}

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Service>>({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/services');
            const result = await res.json();
            if (result.success) {
                setServices(result.data.services || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/content/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ services }),
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Hizmetler kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (service: Service) => {
        setEditingId(service.id);
        setEditForm({ ...service });
    };

    const saveEdit = () => {
        if (!editingId || !editForm.title) return;
        setServices(services.map(s =>
            s.id === editingId ? { ...s, ...editForm } as Service : s
        ));
        setEditingId(null);
        setEditForm({});
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
                    <h1 className="text-2xl font-bold text-white">Hizmetler</h1>
                    <p className="text-gray-400 mt-1">{services.length} hizmet bulunuyor.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors"
                >
                    {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Services List */}
            <div className="space-y-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                        {editingId === service.id ? (
                            // Edit Mode
                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={editForm.title || ''}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                        placeholder="Hizmet Adı"
                                        className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.slug || ''}
                                        onChange={(e) => setEditForm({ ...editForm, slug: e.target.value })}
                                        placeholder="Slug"
                                        className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={editForm.shortDescription || ''}
                                    onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                                    placeholder="Kısa Açıklama"
                                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                />
                                <textarea
                                    value={editForm.fullDescription || ''}
                                    onChange={(e) => setEditForm({ ...editForm, fullDescription: e.target.value })}
                                    placeholder="Tam Açıklama"
                                    rows={3}
                                    className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white resize-none"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={editForm.image || ''}
                                        onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                        placeholder="Görsel URL"
                                        className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.video || ''}
                                        onChange={(e) => setEditForm({ ...editForm, video: e.target.value })}
                                        placeholder="Video URL"
                                        className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={saveEdit} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Kaydet</button>
                                    <button onClick={() => setEditingId(null)} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">İptal</button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="flex items-start gap-4 p-5">
                                <div className="w-24 h-24 flex-shrink-0 bg-gray-700 rounded-lg overflow-hidden">
                                    {service.image && <img src={service.image} alt={service.title} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1 line-clamp-2">{service.shortDescription}</p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {service.features?.slice(0, 3).map((f, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">{f}</span>
                                        ))}
                                        {(service.features?.length || 0) > 3 && (
                                            <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">+{(service.features?.length || 0) - 3}</span>
                                        )}
                                    </div>
                                </div>
                                <button onClick={() => startEdit(service)} className="text-blue-400 hover:text-blue-300 text-sm">
                                    Düzenle
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
