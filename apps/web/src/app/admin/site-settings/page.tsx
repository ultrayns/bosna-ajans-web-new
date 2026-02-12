'use client';

import { useEffect, useState } from 'react';

interface SiteSettings {
    brandName: string;
    tagline: string;
    logoUrl: string;
    faviconUrl: string;
    seo: {
        title: string;
        description: string;
        keywords: string;
        ogImage: string;
    };
    contact: {
        email: string;
        phone: string;
        address: string;
        googleMapsUrl: string;
    };
    social: {
        instagram: string;
        vimeo: string;
        behance: string;
        linkedin: string;
        youtube: string;
        tiktok: string;
    };
    footer: {
        copyright: string;
        privacyUrl: string;
        termsUrl: string;
    };
}

export default function SiteSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'contact' | 'social' | 'footer'>('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/content/site-settings');
            const data = await res.json();
            if (data.success) {
                setSettings(data.data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!settings) return;
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch('/api/admin/content/site-settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });

            const data = await res.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'Ayarlar başarıyla kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız oldu.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const updateField = (path: string, value: string) => {
        if (!settings) return;
        const keys = path.split('.');
        const newSettings = { ...settings };
        let current: Record<string, unknown> = newSettings;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]] as Record<string, unknown>;
        }
        current[keys[keys.length - 1]] = value;

        setSettings(newSettings);
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

    if (!settings) {
        return (
            <div className="p-6 lg:p-8">
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                    Ayarlar yüklenemedi.
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'general', label: 'Genel' },
        { id: 'seo', label: 'SEO' },
        { id: 'contact', label: 'İletişim' },
        { id: 'social', label: 'Sosyal Medya' },
        { id: 'footer', label: 'Footer' },
    ];

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Site Ayarları</h1>
                    <p className="text-gray-400 mt-1">Genel site bilgilerini ve ayarları düzenleyin.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600/50 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Kaydet
                        </>
                    )}
                </button>
            </div>

            {/* Message */}
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
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-4 py-2.5 font-medium text-sm transition-colors border-b-2 -mb-px ${activeTab === tab.id
                                    ? 'text-emerald-500 border-emerald-500'
                                    : 'text-gray-400 border-transparent hover:text-white'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Form Content */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Marka Adı</label>
                                <input
                                    type="text"
                                    value={settings.brandName}
                                    onChange={(e) => updateField('brandName', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Slogan</label>
                                <input
                                    type="text"
                                    value={settings.tagline}
                                    onChange={(e) => updateField('tagline', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
                                <input
                                    type="text"
                                    value={settings.logoUrl}
                                    onChange={(e) => updateField('logoUrl', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="/media/logo/logo.png"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Favicon URL</label>
                                <input
                                    type="text"
                                    value={settings.faviconUrl}
                                    onChange={(e) => updateField('faviconUrl', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="/favicon.ico"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* SEO Tab */}
                {activeTab === 'seo' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Site Başlığı (Title)</label>
                            <input
                                type="text"
                                value={settings.seo.title}
                                onChange={(e) => updateField('seo.title', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Site Açıklaması (Description)</label>
                            <textarea
                                value={settings.seo.description}
                                onChange={(e) => updateField('seo.description', e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Anahtar Kelimeler (Keywords)</label>
                            <input
                                type="text"
                                value={settings.seo.keywords}
                                onChange={(e) => updateField('seo.keywords', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="fotoğraf, video, prodüksiyon, İstanbul"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">OG Image URL</label>
                            <input
                                type="text"
                                value={settings.seo.ogImage}
                                onChange={(e) => updateField('seo.ogImage', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder="/media/og-image.jpg"
                            />
                        </div>
                    </div>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">E-posta</label>
                                <input
                                    type="email"
                                    value={settings.contact.email}
                                    onChange={(e) => updateField('contact.email', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Telefon</label>
                                <input
                                    type="tel"
                                    value={settings.contact.phone}
                                    onChange={(e) => updateField('contact.phone', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Adres</label>
                            <input
                                type="text"
                                value={settings.contact.address}
                                onChange={(e) => updateField('contact.address', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Google Maps URL</label>
                            <input
                                type="url"
                                value={settings.contact.googleMapsUrl}
                                onChange={(e) => updateField('contact.googleMapsUrl', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                )}

                {/* Social Tab */}
                {activeTab === 'social' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                            <input
                                type="url"
                                value={settings.social.instagram}
                                onChange={(e) => updateField('social.instagram', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Vimeo</label>
                            <input
                                type="url"
                                value={settings.social.vimeo}
                                onChange={(e) => updateField('social.vimeo', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Behance</label>
                            <input
                                type="url"
                                value={settings.social.behance}
                                onChange={(e) => updateField('social.behance', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
                            <input
                                type="url"
                                value={settings.social.linkedin}
                                onChange={(e) => updateField('social.linkedin', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">YouTube</label>
                            <input
                                type="url"
                                value={settings.social.youtube}
                                onChange={(e) => updateField('social.youtube', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">TikTok</label>
                            <input
                                type="url"
                                value={settings.social.tiktok}
                                onChange={(e) => updateField('social.tiktok', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                    </div>
                )}

                {/* Footer Tab */}
                {activeTab === 'footer' && (
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Copyright Metni</label>
                            <input
                                type="text"
                                value={settings.footer.copyright}
                                onChange={(e) => updateField('footer.copyright', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Gizlilik Politikası URL</label>
                                <input
                                    type="text"
                                    value={settings.footer.privacyUrl}
                                    onChange={(e) => updateField('footer.privacyUrl', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Kullanım Şartları URL</label>
                                <input
                                    type="text"
                                    value={settings.footer.termsUrl}
                                    onChange={(e) => updateField('footer.termsUrl', e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
