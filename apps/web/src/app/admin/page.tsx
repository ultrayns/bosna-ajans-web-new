'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Stats {
    projects: number;
    categories: number;
    services: number;
    clients: number;
    team: number;
}

const statCards = [
    { key: 'projects', label: 'Projeler', icon: 'image', href: '/admin/projects', color: 'emerald' },
    { key: 'categories', label: 'Kategoriler', icon: 'folder', href: '/admin/categories', color: 'blue' },
    { key: 'services', label: 'Hizmetler', icon: 'briefcase', href: '/admin/services', color: 'purple' },
    { key: 'clients', label: 'Müşteriler', icon: 'users', href: '/admin/clients', color: 'orange' },
    { key: 'team', label: 'Ekip Üyeleri', icon: 'team', href: '/admin/team', color: 'pink' },
];

const quickActions = [
    { label: 'Yeni Proje Ekle', href: '/admin/projects/new', icon: 'plus' },
    { label: 'Site Ayarlarını Düzenle', href: '/admin/site-settings', icon: 'settings' },
    { label: 'Ana Sayfa Düzenle', href: '/admin/homepage', icon: 'layout' },
    { label: 'Medya Yükle', href: '/admin/media', icon: 'upload' },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        projects: 0,
        categories: 0,
        services: 0,
        clients: 0,
        team: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const [projectsRes, categoriesRes, servicesRes, clientsRes, teamRes] = await Promise.all([
                    fetch('/api/admin/content/projects'),
                    fetch('/api/admin/content/categories'),
                    fetch('/api/admin/content/services'),
                    fetch('/api/admin/content/clients'),
                    fetch('/api/admin/content/team'),
                ]);

                const [projectsData, categoriesData, servicesData, clientsData, teamData] = await Promise.all([
                    projectsRes.json(),
                    categoriesRes.json(),
                    servicesRes.json(),
                    clientsRes.json(),
                    teamRes.json(),
                ]);

                setStats({
                    projects: projectsData.data?.projects?.length || 0,
                    categories: categoriesData.data?.categories?.length || 0,
                    services: servicesData.data?.services?.length || 0,
                    clients: clientsData.data?.clients?.length || 0,
                    team: teamData.data?.team?.length || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    const getColorClasses = (color: string) => {
        const colors: Record<string, string> = {
            emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
            blue: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
            purple: 'bg-purple-500/10 text-purple-500 border-purple-500/30',
            orange: 'bg-orange-500/10 text-orange-500 border-orange-500/30',
            pink: 'bg-pink-500/10 text-pink-500 border-pink-500/30',
        };
        return colors[color] || colors.emerald;
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-gray-400 mt-1">Hoş geldiniz! İşte sitenizin özet bilgileri.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                {statCards.map((card) => (
                    <Link
                        key={card.key}
                        href={card.href}
                        className={`p-5 rounded-xl border ${getColorClasses(card.color)} hover:scale-105 transition-transform`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium opacity-80">{card.label}</span>
                            <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                        <div className="text-3xl font-bold">
                            {loading ? (
                                <div className="w-10 h-8 bg-gray-700 rounded animate-pulse" />
                            ) : (
                                stats[card.key as keyof Stats]
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">Hızlı İşlemler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <Link
                            key={action.href}
                            href={action.href}
                            className="flex items-center gap-3 p-4 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-750 hover:border-gray-600 transition-colors"
                        >
                            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                {action.icon === 'plus' && (
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                )}
                                {action.icon === 'settings' && (
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                                {action.icon === 'layout' && (
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                    </svg>
                                )}
                                {action.icon === 'upload' && (
                                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                )}
                            </div>
                            <span className="text-white font-medium">{action.label}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Info */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Sistem Bilgisi</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Admin Panel Versiyonu</span>
                            <span className="text-white">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Veri Depolama</span>
                            <span className="text-emerald-400">JSON (Local)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Son Güncelleme</span>
                            <span className="text-white">{new Date().toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                </div>

                {/* Help */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Yardım</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        Admin panelinden tüm site içeriklerini yönetebilirsiniz. Sol menüden ilgili bölüme gidin ve düzenleme yapın.
                    </p>
                    <div className="text-sm text-gray-400">
                        <p>📁 <strong className="text-white">Kategoriler:</strong> Portfolio kategorilerini yönetin</p>
                        <p>📷 <strong className="text-white">Projeler:</strong> Proje ekleyin, düzenleyin</p>
                        <p>⚙️ <strong className="text-white">Site Ayarları:</strong> Logo, SEO, iletişim bilgileri</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
