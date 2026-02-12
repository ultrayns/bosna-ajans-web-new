'use client';

import { useEffect, useState } from 'react';

interface LegalData {
    privacy: {
        title: string;
        lastUpdated: string;
        content: string;
    };
    terms: {
        title: string;
        lastUpdated: string;
        content: string;
    };
}

export default function LegalPage() {
    const [data, setData] = useState<LegalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/legal');
            const result = await res.json();
            if (result.success) setData(result.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!data) return;
        setSaving(true);
        setMessage(null);

        // Update lastUpdated
        const updatedData = {
            ...data,
            [activeTab]: {
                ...data[activeTab],
                lastUpdated: new Date().toISOString().split('T')[0],
            },
        };

        try {
            const res = await fetch('/api/admin/content/legal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData),
            });

            const result = await res.json();
            if (result.success) {
                setData(updatedData);
                setMessage({ type: 'success', text: 'Yasal sayfa kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (section: 'privacy' | 'terms', field: string, value: string) => {
        if (!data) return;
        setData({
            ...data,
            [section]: {
                ...data[section],
                [field]: value,
            },
        });
    };

    if (loading || !data) {
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
        { id: 'privacy', label: '🔒 Gizlilik Politikası', url: '/privacy' },
        { id: 'terms', label: '📋 Kullanım Şartları', url: '/terms' },
    ];

    const currentData = data[activeTab];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Yasal Sayfalar</h1>
                    <p className="text-gray-400 mt-1">Gizlilik politikası ve kullanım şartlarını düzenleyin.</p>
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
                <nav className="flex gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as 'privacy' | 'terms')}
                            className={`px-4 py-2.5 font-medium text-sm border-b-2 -mb-px ${activeTab === tab.id ? 'text-emerald-500 border-emerald-500' : 'text-gray-400 border-transparent hover:text-white'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                <div className="space-y-5">
                    {/* Sayfa Bilgisi */}
                    <div className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div>
                            <span className="text-sm text-gray-400">Sayfa URL:</span>
                            <span className="ml-2 text-white font-mono">{tabs.find(t => t.id === activeTab)?.url}</span>
                        </div>
                        <div>
                            <span className="text-sm text-gray-400">Son güncelleme:</span>
                            <span className="ml-2 text-white">{currentData.lastUpdated}</span>
                        </div>
                    </div>

                    {/* Başlık */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Sayfa Başlığı</label>
                        <input
                            type="text"
                            value={currentData.title}
                            onChange={(e) => updateField(activeTab, 'title', e.target.value)}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    {/* İçerik */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            İçerik (HTML destekler)
                            <span className="ml-2 text-xs text-gray-500">h2, p, ul, li tagları kullanılabilir</span>
                        </label>
                        <textarea
                            value={currentData.content}
                            onChange={(e) => updateField(activeTab, 'content', e.target.value)}
                            rows={20}
                            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm resize-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="<h2>Başlık</h2>\n<p>Paragraf içeriği...</p>"
                        />
                    </div>

                    {/* HTML İpuçları */}
                    <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-400 mb-2">💡 HTML Kullanım İpuçları</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div>
                                <code className="text-blue-300">&lt;h2&gt;...&lt;/h2&gt;</code> - Bölüm başlığı
                            </div>
                            <div>
                                <code className="text-blue-300">&lt;p&gt;...&lt;/p&gt;</code> - Paragraf
                            </div>
                            <div>
                                <code className="text-blue-300">&lt;ul&gt;&lt;li&gt;...&lt;/li&gt;&lt;/ul&gt;</code> - Liste
                            </div>
                            <div>
                                <code className="text-blue-300">&lt;strong&gt;...&lt;/strong&gt;</code> - Kalın metin
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
