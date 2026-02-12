'use client';

import { useEffect, useState } from 'react';

interface TeamMember {
    id: string;
    name: string;
    role: string;
    photo: string;
    bio: string;
    order: number;
}

interface Award {
    id: string;
    title: string;
    year: number;
    type: 'award' | 'press';
    order: number;
}

interface TeamData {
    team: TeamMember[];
    awards: Award[];
}

export default function TeamPage() {
    const [data, setData] = useState<TeamData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMember, setNewMember] = useState({ name: '', role: '', photo: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch('/api/admin/content/team');
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
            const res = await fetch('/api/admin/content/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) setMessage({ type: 'success', text: 'Ekip kaydedildi!' });
            else setMessage({ type: 'error', text: 'Kaydetme başarısız.' });
        } catch {
            setMessage({ type: 'error', text: 'Bir hata oluştu.' });
        } finally {
            setSaving(false);
        }
    };

    const handleAddMember = () => {
        if (!data || !newMember.name) return;
        const member: TeamMember = {
            id: Date.now().toString(36),
            ...newMember,
            bio: '',
            order: data.team.length + 1,
        };
        setData({ ...data, team: [...data.team, member] });
        setNewMember({ name: '', role: '', photo: '' });
        setShowAddMember(false);
    };

    const handleDeleteMember = (id: string) => {
        if (!data || !confirm('Silmek istediğinize emin misiniz?')) return;
        setData({ ...data, team: data.team.filter(m => m.id !== id) });
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

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Ekip</h1>
                    <p className="text-gray-400 mt-1">Ekip üyelerini ve ödülleri yönetin.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setShowAddMember(true)} className="px-4 py-2.5 bg-gray-700 text-white rounded-lg">+ Üye Ekle</button>
                    <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-emerald-600 text-white font-medium rounded-lg">
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                    </button>
                </div>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border border-red-500/50 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            {showAddMember && (
                <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Yeni Ekip Üyesi</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <input type="text" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Ad Soyad" className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <input type="text" value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="Pozisyon" className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                        <input type="text" value={newMember.photo} onChange={(e) => setNewMember({ ...newMember, photo: e.target.value })} placeholder="Fotoğraf URL" className="px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white" />
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleAddMember} className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Ekle</button>
                        <button onClick={() => setShowAddMember(false)} className="px-4 py-2 bg-gray-700 text-white rounded-lg">İptal</button>
                    </div>
                </div>
            )}

            {/* Team Members */}
            <h2 className="text-lg font-semibold text-white mb-4">Ekip Üyeleri ({data.team.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {data.team.map((member) => (
                    <div key={member.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
                        <div className="w-20 h-20 mx-auto mb-3 bg-gray-700 rounded-full overflow-hidden">
                            {member.photo ? (
                                <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl">{member.name.charAt(0)}</div>
                            )}
                        </div>
                        <h3 className="text-white font-medium">{member.name}</h3>
                        <p className="text-gray-400 text-sm">{member.role}</p>
                        <button onClick={() => handleDeleteMember(member.id)} className="text-red-400 hover:text-red-300 text-sm mt-2">Sil</button>
                    </div>
                ))}
            </div>

            {/* Awards */}
            <h2 className="text-lg font-semibold text-white mb-4">Ödüller & Basın ({data.awards.length})</h2>
            <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-750">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Başlık</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Yıl</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tür</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {data.awards.map((award) => (
                            <tr key={award.id}>
                                <td className="px-4 py-3 text-white">{award.title}</td>
                                <td className="px-4 py-3 text-gray-400">{award.year}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs rounded ${award.type === 'award' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {award.type === 'award' ? 'Ödül' : 'Basın'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
