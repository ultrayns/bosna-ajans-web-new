'use client';

import { useEffect, useState } from 'react';

interface HomepageData {
    hero: {
        headline: string;
        subline: string;
        ctaPrimaryLabel: string;
        ctaPrimaryUrl: string;
        ctaSecondaryLabel: string;
        ctaSecondaryUrl: string;
        backgroundImages: string[];
        showreelUrl: string;
    };
    manifesto: {
        content: string;
        linkLabel: string;
        linkUrl: string;
        backgroundImage: string;
    };
    capabilities: {
        title: string;
        items: Array<{ title: string; description: string; image: string; slug: string }>;
    };
    process: {
        title: string;
        steps: Array<{ title: string; description: string }>;
    };
    ctaFooter: {
        headline: string;
        showEmail: boolean;
        showSocials: boolean;
    };
}

export default function HomepagePage() {
    const [data, setData] = useState<HomepageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'hero' | 'manifesto' | 'capabilities' | 'process' | 'cta'>('hero');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/homepage');
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

        try {
            const res = await fetch('/api/admin/content/homepage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) setMessage({ type: 'success', text: 'Ana sayfa kaydedildi!' });
            else setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (path: string, value: unknown) => {
        if (!data) return;
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(data));
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setData(newData);
    };

    // Slider görsel yönetimi için fonksiyonlar
    const addSliderImage = () => {
        if (!data) return;
        const newImages = [...data.hero.backgroundImages, ''];
        updateField('hero.backgroundImages', newImages);
    };

    const removeSliderImage = (index: number) => {
        if (!data) return;
        const newImages = data.hero.backgroundImages.filter((_, i) => i !== index);
        updateField('hero.backgroundImages', newImages);
    };

    const updateSliderImage = (index: number, value: string) => {
        if (!data) return;
        const newImages = [...data.hero.backgroundImages];
        newImages[index] = value;
        updateField('hero.backgroundImages', newImages);
    };

    const moveSliderImage = (index: number, direction: 'up' | 'down') => {
        if (!data) return;
        const newImages = [...data.hero.backgroundImages];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newImages.length) return;
        [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
        updateField('hero.backgroundImages', newImages);
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
        { id: 'hero', label: '🎬 Hero Slider' },
        { id: 'manifesto', label: '📝 Manifesto' },
        { id: 'capabilities', label: '⚡ Hizmetler' },
        { id: 'process', label: '🔄 Süreç' },
        { id: 'cta', label: '📩 CTA Footer' },
    ];

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Ana Sayfa Yönetimi</h1>
                    <p className="text-gray-400 mt-1">Ana sayfa bölümlerini düzenleyin.</p>
                </div>
                <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
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
                {/* Hero Tab - Enhanced Slider Management */}
                {activeTab === 'hero' && (
                    <div className="space-y-6">
                        {/* Başlıklar */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Ana Başlık</label>
                                <input
                                    type="text"
                                    value={data.hero.headline}
                                    onChange={(e) => updateField('hero.headline', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Markanızı görsel hikayelerle hayata geçiriyoruz."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Alt Başlık</label>
                                <input
                                    type="text"
                                    value={data.hero.subline}
                                    onChange={(e) => updateField('hero.subline', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="İstanbul merkezli profesyonel prodüksiyon stüdyosu"
                                />
                            </div>
                        </div>

                        {/* Butonlar */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Birincil Buton */}
                            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <h3 className="text-sm font-semibold text-emerald-400 mb-3">🔘 Birincil Buton</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Buton Metni</label>
                                        <input
                                            type="text"
                                            value={data.hero.ctaPrimaryLabel}
                                            onChange={(e) => updateField('hero.ctaPrimaryLabel', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                            placeholder="Projelerimiz"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">URL</label>
                                        <input
                                            type="text"
                                            value={data.hero.ctaPrimaryUrl}
                                            onChange={(e) => updateField('hero.ctaPrimaryUrl', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                            placeholder="/portfolio"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* İkincil Buton */}
                            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                                <h3 className="text-sm font-semibold text-blue-400 mb-3">🔲 İkincil Buton</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Buton Metni</label>
                                        <input
                                            type="text"
                                            value={data.hero.ctaSecondaryLabel}
                                            onChange={(e) => updateField('hero.ctaSecondaryLabel', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                            placeholder="İletişime Geç"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">URL</label>
                                        <input
                                            type="text"
                                            value={data.hero.ctaSecondaryUrl}
                                            onChange={(e) => updateField('hero.ctaSecondaryUrl', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
                                            placeholder="/contact"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Showreel Video */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">🎥 Showreel Video URL (Opsiyonel)</label>
                            <input
                                type="text"
                                value={data.hero.showreelUrl || ''}
                                onChange={(e) => updateField('hero.showreelUrl', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                placeholder="/videos/showreel.mp4"
                            />
                        </div>

                        {/* Slider Görselleri - Enhanced UI */}
                        <div className="border-t border-gray-600 pt-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">🖼️ Slider Görselleri</h3>
                                    <p className="text-sm text-gray-400">Arka plan görselleri otomatik olarak döner. Sürükle-bırak ile sıralayabilirsiniz.</p>
                                </div>
                                <button
                                    onClick={addSliderImage}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                                >
                                    ➕ Görsel Ekle
                                </button>
                            </div>

                            <div className="space-y-3">
                                {data.hero.backgroundImages.map((image, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600 group">
                                        {/* Sıra numarası */}
                                        <span className="w-8 h-8 flex items-center justify-center bg-gray-600 rounded text-white text-sm font-bold">
                                            {index + 1}
                                        </span>

                                        {/* Görsel önizleme */}
                                        <div className="w-16 h-12 bg-gray-600 rounded overflow-hidden flex-shrink-0">
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={`Slide ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = '/media/placeholder.svg';
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* URL input */}
                                        <input
                                            type="text"
                                            value={image}
                                            onChange={(e) => updateSliderImage(index, e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="/media/projects/genel/gorsel.jpg"
                                        />

                                        {/* Sıralama butonları */}
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => moveSliderImage(index, 'up')}
                                                disabled={index === 0}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Yukarı taşı"
                                            >
                                                ⬆️
                                            </button>
                                            <button
                                                onClick={() => moveSliderImage(index, 'down')}
                                                disabled={index === data.hero.backgroundImages.length - 1}
                                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                title="Aşağı taşı"
                                            >
                                                ⬇️
                                            </button>
                                        </div>

                                        {/* Silme butonu */}
                                        <button
                                            onClick={() => removeSliderImage(index)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                                            title="Görseli sil"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                ))}

                                {data.hero.backgroundImages.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-600 rounded-lg">
                                        <p className="text-lg mb-2">📷 Henüz görsel eklenmemiş</p>
                                        <p className="text-sm">Yukarıdaki "Görsel Ekle" butonuna tıklayarak başlayın.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Manifesto Tab */}
                {activeTab === 'manifesto' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">İçerik (HTML destekler)</label>
                            <textarea value={data.manifesto.content} onChange={(e) => updateField('manifesto.content', e.target.value)} rows={6} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white font-mono text-sm resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Link Metni</label>
                                <input type="text" value={data.manifesto.linkLabel} onChange={(e) => updateField('manifesto.linkLabel', e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Link URL</label>
                                <input type="text" value={data.manifesto.linkUrl} onChange={(e) => updateField('manifesto.linkUrl', e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Arka Plan Görseli</label>
                            <input type="text" value={data.manifesto.backgroundImage} onChange={(e) => updateField('manifesto.backgroundImage', e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        </div>
                    </div>
                )}

                {/* Process Tab */}
                {activeTab === 'process' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Bölüm Başlığı</label>
                            <input type="text" value={data.process.title} onChange={(e) => updateField('process.title', e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">Adımlar</label>
                            {data.process.steps.map((step, i) => (
                                <div key={i} className="grid grid-cols-2 gap-4">
                                    <input type="text" value={step.title} onChange={(e) => { const steps = [...data.process.steps]; steps[i].title = e.target.value; updateField('process.steps', steps); }} className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="Başlık" />
                                    <input type="text" value={step.description} onChange={(e) => { const steps = [...data.process.steps]; steps[i].description = e.target.value; updateField('process.steps', steps); }} className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="Açıklama" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* CTA Footer Tab */}
                {activeTab === 'cta' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Başlık</label>
                            <input type="text" value={data.ctaFooter.headline} onChange={(e) => updateField('ctaFooter.headline', e.target.value)} className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        </div>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.ctaFooter.showEmail} onChange={(e) => updateField('ctaFooter.showEmail', e.target.checked)} className="rounded" />
                                <span className="text-white">E-posta göster</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={data.ctaFooter.showSocials} onChange={(e) => updateField('ctaFooter.showSocials', e.target.checked)} className="rounded" />
                                <span className="text-white">Sosyal medya göster</span>
                            </label>
                        </div>
                    </div>
                )}

                {/* Capabilities Tab */}
                {activeTab === 'capabilities' && (
                    <div className="text-gray-400">
                        <p>Hizmetler bölümü otomatik olarak Hizmetler sayfasından çekilir.</p>
                        <p className="mt-2">Hizmetleri düzenlemek için <a href="/admin/services" className="text-emerald-400 hover:underline">Hizmetler</a> sayfasına gidin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
