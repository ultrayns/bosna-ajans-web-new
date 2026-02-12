'use client';

import { useEffect, useState } from 'react';

interface AboutData {
    title: string;
    subtitle: string;
    heroImage: string;
    story: {
        title: string;
        content: string;
    };
    mission: {
        title: string;
        content: string;
    };
    vision: {
        title: string;
        content: string;
    };
    values: Array<{
        title: string;
        description: string;
    }>;
    stats: Array<{
        value: string;
        label: string;
    }>;
    cta: {
        title: string;
        description: string;
        buttonText: string;
        buttonUrl: string;
    };
}

const defaultData: AboutData = {
    title: 'Hakkımızda',
    subtitle: '',
    heroImage: '',
    story: { title: 'Hikayemiz', content: '' },
    mission: { title: 'Misyonumuz', content: '' },
    vision: { title: 'Vizyonumuz', content: '' },
    values: [],
    stats: [],
    cta: { title: '', description: '', buttonText: 'İletişim', buttonUrl: '/contact' },
};

export default function AboutAdminPage() {
    const [data, setData] = useState<AboutData>(defaultData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'content' | 'values' | 'stats' | 'cta'>('general');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/about');
            const result = await res.json();
            if (result.success && result.data) setData(result.data);
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
            const res = await fetch('/api/admin/content/about', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Sayfa kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (path: string, value: unknown) => {
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    const addValue = () => {
        setData({
            ...data,
            values: [...data.values, { title: '', description: '' }],
        });
    };

    const removeValue = (index: number) => {
        setData({
            ...data,
            values: data.values.filter((_, i) => i !== index),
        });
    };

    const addStat = () => {
        setData({
            ...data,
            stats: [...data.stats, { value: '', label: '' }],
        });
    };

    const removeStat = (index: number) => {
        setData({
            ...data,
            stats: data.stats.filter((_, i) => i !== index),
        });
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

    const tabs = [
        { id: 'general', label: '📋 Genel' },
        { id: 'content', label: '📝 İçerik' },
        { id: 'values', label: '💎 Değerler' },
        { id: 'stats', label: '📊 İstatistikler' },
        { id: 'cta', label: '📩 CTA' },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Hakkımızda Sayfası</h1>
                    <p className="text-gray-400 mt-1">Şirket bilgilerini ve hakkımızda sayfasını düzenleyin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                    {saving ? 'Kaydediliyor...' : '💾 Kaydet'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-700 mb-6">
                <nav className="flex gap-1 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-4 py-2.5 font-medium text-sm border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id ? 'text-emerald-500 border-emerald-500' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Sayfa Başlığı</label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="Hakkımızda"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Alt Başlık</label>
                            <input
                                type="text"
                                value={data.subtitle}
                                onChange={(e) => updateField('subtitle', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="İstanbul merkezli profesyonel prodüksiyon stüdyosu"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Hero Görsel URL (opsiyonel)</label>
                            <input
                                type="text"
                                value={data.heroImage || ''}
                                onChange={(e) => updateField('heroImage', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="/media/about-hero.jpg"
                            />
                        </div>
                    </div>
                )}

                {/* Content Tab */}
                {activeTab === 'content' && (
                    <div className="space-y-6">
                        {/* Story */}
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                            <h3 className="text-lg font-medium text-white mb-4">📖 Hikaye</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        value={data.story.title}
                                        onChange={(e) => updateField('story.title', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">İçerik (HTML destekler)</label>
                                    <textarea
                                        value={data.story.content}
                                        onChange={(e) => updateField('story.content', e.target.value)}
                                        rows={5}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white font-mono text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                            <h3 className="text-lg font-medium text-white mb-4">🎯 Misyon</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        value={data.mission.title}
                                        onChange={(e) => updateField('mission.title', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">İçerik</label>
                                    <textarea
                                        value={data.mission.content}
                                        onChange={(e) => updateField('mission.content', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="p-4 bg-gray-700/50 rounded-lg">
                            <h3 className="text-lg font-medium text-white mb-4">🔭 Vizyon</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        value={data.vision.title}
                                        onChange={(e) => updateField('vision.title', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">İçerik</label>
                                    <textarea
                                        value={data.vision.content}
                                        onChange={(e) => updateField('vision.content', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Values Tab */}
                {activeTab === 'values' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">Değerler</h3>
                            <button onClick={addValue} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg">
                                ➕ Değer Ekle
                            </button>
                        </div>
                        {data.values.map((value, i) => (
                            <div key={i} className="flex gap-4 items-start p-4 bg-gray-700/50 rounded-lg">
                                <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded text-white font-bold">{i + 1}</span>
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        value={value.title}
                                        onChange={(e) => {
                                            const values = [...data.values];
                                            values[i].title = e.target.value;
                                            updateField('values', values);
                                        }}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                        placeholder="Başlık"
                                    />
                                    <input
                                        type="text"
                                        value={value.description}
                                        onChange={(e) => {
                                            const values = [...data.values];
                                            values[i].description = e.target.value;
                                            updateField('values', values);
                                        }}
                                        className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                        placeholder="Açıklama"
                                    />
                                </div>
                                <button onClick={() => removeValue(i)} className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                                    🗑️
                                </button>
                            </div>
                        ))}
                        {data.values.length === 0 && (
                            <p className="text-center text-gray-400 py-8">Henüz değer eklenmemiş.</p>
                        )}
                    </div>
                )}

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium text-white">İstatistikler</h3>
                            <button onClick={addStat} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg">
                                ➕ İstatistik Ekle
                            </button>
                        </div>
                        {data.stats.map((stat, i) => (
                            <div key={i} className="flex gap-4 items-center p-4 bg-gray-700/50 rounded-lg">
                                <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded text-white font-bold">{i + 1}</span>
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                        const stats = [...data.stats];
                                        stats[i].value = e.target.value;
                                        updateField('stats', stats);
                                    }}
                                    className="w-32 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center font-bold"
                                    placeholder="500+"
                                />
                                <input
                                    type="text"
                                    value={stat.label}
                                    onChange={(e) => {
                                        const stats = [...data.stats];
                                        stats[i].label = e.target.value;
                                        updateField('stats', stats);
                                    }}
                                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                                    placeholder="Tamamlanan Proje"
                                />
                                <button onClick={() => removeStat(i)} className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                                    🗑️
                                </button>
                            </div>
                        ))}
                        {data.stats.length === 0 && (
                            <p className="text-center text-gray-400 py-8">Henüz istatistik eklenmemiş.</p>
                        )}
                    </div>
                )}

                {/* CTA Tab */}
                {activeTab === 'cta' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CTA Başlık</label>
                            <input
                                type="text"
                                value={data.cta.title}
                                onChange={(e) => updateField('cta.title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="Birlikte çalışalım"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CTA Açıklama</label>
                            <input
                                type="text"
                                value={data.cta.description}
                                onChange={(e) => updateField('cta.description', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                placeholder="Projeniz için profesyonel destek almak ister misiniz?"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Buton Metni</label>
                                <input
                                    type="text"
                                    value={data.cta.buttonText}
                                    onChange={(e) => updateField('cta.buttonText', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="İletişime Geç"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Buton URL</label>
                                <input
                                    type="text"
                                    value={data.cta.buttonUrl}
                                    onChange={(e) => updateField('cta.buttonUrl', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                                    placeholder="/contact"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
