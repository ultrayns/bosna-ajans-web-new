'use client';

import { useEffect, useState } from 'react';

interface Client {
    id: string;
    name: string;
    logo: string;
    website: string;
    order: number;
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newClient, setNewClient] = useState({ name: '', logo: '', website: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/clients');
            const result = await res.json();
            if (result.success) {
                setClients(result.data.clients || []);
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
            const res = await fetch('/api/admin/content/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ clients }),
            });

            const result = await res.json();
            if (result.success) {
                setMessage({ type: 'success', text: 'Müşteriler kaydedildi!' });
            } else {
                setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
            }
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const handleAdd = () => {
        if (!newClient.name) return;
        const newItem: Client = {
            id: Date.now().toString(36),
            name: newClient.name,
            logo: newClient.logo,
            website: newClient.website,
            order: clients.length + 1,
        };
        setClients([...clients, newItem]);
        setNewClient({ name: '', logo: '', website: '' });
        setShowAddForm(false);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
        setClients(clients.filter(c => c.id !== id));
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Müşteriler</h1>
                    <p className="text-gray-400 mt-1">Logo slider için müşteri logolarını yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowAddForm(true)} className="px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                        + Yeni Müşteri
                    </button>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg">
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {showAddForm && (
                <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Yeni Müşteri Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input type="text" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} placeholder="Müşteri Adı" className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <input type="text" value={newClient.logo} onChange={(e) => setNewClient({ ...newClient, logo: e.target.value })} placeholder="Logo URL" className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <input type="text" value={newClient.website} onChange={(e) => setNewClient({ ...newClient, website: e.target.value })} placeholder="Website (opsiyonel)" className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAdd} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Ekle</button>
                        <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg">İptal</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {clients.map((client) => (
                    <div key={client.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                            {client.logo ? (
                                <img src={client.logo} alt={client.name} className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-gray-400 text-xs">Logo yok</span>
                            )}
                        </div>
                        <h3 className="text-white font-medium mb-2">{client.name}</h3>
                        <button onClick={() => handleDelete(client.id)} className="text-red-400 hover:text-red-300 text-sm">
                            Sil
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
