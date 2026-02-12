'use client';

import { useEffect, useState } from 'react';

interface DigitalService {
    id: string;
    title: string;
    titleEn: string;
    description: string;
    descriptionEn: string;
    image: string;
    color: string;
    features: string[];
    featuresEn: string[];
    slug: string;
    order: number;
}

export default function DigitalServicesAdminPage() {
    const [services, setServices] = useState<DigitalService[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newService, setNewService] = useState<Partial<DigitalService>>({ color: 'from-blue-500 to-cyan-500' });

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/admin/content/digital-services');
            const data = await res.json();
            if (data.success && data.data?.digitalServices) {
                setServices(data.data.digitalServices.sort((a: DigitalService, b: DigitalService) => a.order - b.order));
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchServices(); }, []);

    const saveServices = async (updatedServices: DigitalService[]) => {
        try {
            const res = await fetch('/api/admin/content/digital-services');
            const currentData = await res.json();

            const saveRes = await fetch('/api/admin/content/digital-services', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ digitalServices: updatedServices, stats: currentData.data?.stats || [] }),
            });
            const data = await saveRes.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Kaydedildi!' });
                setServices(updatedServices);
            } else {
                setMessage({ type: 'error', text: 'Hata oluştu' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bağlantı hatası' });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
            .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    };

    const handleAdd = () => {
        if (!newService.title) return;
        const service: DigitalService = {
            id: generateSlug(newService.title),
            title: newService.title,
            titleEn: newService.titleEn || newService.title,
            description: newService.description || '',
            descriptionEn: newService.descriptionEn || '',
            image: newService.image || '/media/placeholder.jpg',
            color: newService.color || 'from-blue-500 to-cyan-500',
            features: newService.features || [],
            featuresEn: newService.featuresEn || [],
            slug: generateSlug(newService.title),
            order: services.length + 1,
        };
        saveServices([...services, service]);
        setNewService({ color: 'from-blue-500 to-cyan-500' });
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('Silmek istediğinize emin misiniz?')) {
            saveServices(services.filter(s => s.id !== id));
        }
    };

    const handleUpdate = (id: string, updates: Partial<DigitalService>) => {
        const updatedServices = services.map(s => s.id === id ? { ...s, ...updates } : s);
        setServices(updatedServices);
    };

    const handleSaveEdit = () => {
        saveServices(services);
        setEditingId(null);
    };

    const colorOptions = [
        { value: 'from-blue-500 to-cyan-500', label: 'Mavi' },
        { value: 'from-green-500 to-emerald-500', label: 'Yeşil' },
        { value: 'from-purple-500 to-pink-500', label: 'Mor' },
        { value: 'from-orange-500 to-red-500', label: 'Turuncu' },
    ];

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
                    <h1 className="text-2xl font-bold text-white">Dijital Hizmetler</h1>
                    <p className="text-gray-400 mt-1">Portfolyo sayfasındaki dijital hizmetler bölümünü yönetin</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                >
                    + Yeni Hizmet
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
                    <h3 className="text-lg font-semibold text-white mb-4">Yeni Dijital Hizmet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Başlık (TR)" value={newService.title || ''} onChange={(e) => setNewService({ ...newService, title: e.target.value })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <input type="text" placeholder="Title (EN)" value={newService.titleEn || ''} onChange={(e) => setNewService({ ...newService, titleEn: e.target.value })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <textarea placeholder="Açıklama (TR)" value={newService.description || ''} onChange={(e) => setNewService({ ...newService, description: e.target.value })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" rows={2} />
                        <textarea placeholder="Description (EN)" value={newService.descriptionEn || ''} onChange={(e) => setNewService({ ...newService, descriptionEn: e.target.value })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" rows={2} />
                        <input type="text" placeholder="Görsel URL" value={newService.image || ''} onChange={(e) => setNewService({ ...newService, image: e.target.value })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <select value={newService.color || ''} onChange={(e) => setNewService({ ...newService, color: e.target.value })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white">
                            {colorOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                        <input type="text" placeholder="Özellikler TR (virgülle ayır)" value={newService.features?.join(', ') || ''} onChange={(e) => setNewService({ ...newService, features: e.target.value.split(',').map(f => f.trim()) })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <input type="text" placeholder="Features EN (comma sep)" value={newService.featuresEn?.join(', ') || ''} onChange={(e) => setNewService({ ...newService, featuresEn: e.target.value.split(',').map(f => f.trim()) })} className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Ekle</button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-600 text-white rounded-lg">İptal</button>
                    </div>
                </div>
            )}

            {/* Services List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                        {editingId === service.id ? (
                            <div className="p-4 space-y-3">
                                <input type="text" value={service.title} onChange={(e) => handleUpdate(service.id, { title: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="Başlık" />
                                <textarea value={service.description} onChange={(e) => handleUpdate(service.id, { description: e.target.value })} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white" rows={2} placeholder="Açıklama" />
                                <div className="flex gap-2">
                                    <button onClick={handleSaveEdit} className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-sm">Kaydet</button>
                                    <button onClick={() => setEditingId(null)} className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm">İptal</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className={`h-3 bg-gradient-to-r ${service.color}`} />
                                <div className="p-4">
                                    <h3 className="text-white font-medium text-lg">{service.title}</h3>
                                    <p className="text-gray-400 text-sm mt-1">{service.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-3">
                                        {service.features.slice(0, 3).map((f, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">{f}</span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <button onClick={() => setEditingId(service.id)} className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">Düzenle</button>
                                        <button onClick={() => handleDelete(service.id)} className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm">Sil</button>
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
